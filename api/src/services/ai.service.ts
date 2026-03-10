import { z } from 'zod';
import { openai } from '../config/openai';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// ─── Zod Schemas ─────────────────────────────────────────────

export const FloorPlanSchema = z.object({
    propertyId: z.string().cuid(),
    plotLength: z.number().positive().max(500),
    plotWidth: z.number().positive().max(500),
    floors: z.number().int().min(1).max(5),
    stylePrefs: z.string().max(100).optional(),
    roomPrefs: z.object({
        bedrooms: z.number().int().min(1).max(10),
        bathrooms: z.number().int().min(1).max(10),
        kitchen: z.number().int().min(1).max(3).default(1),
        hall: z.number().int().min(1).max(2).default(1),
        pooja: z.boolean().optional(),
        parking: z.number().int().min(0).max(5).default(1),
    }),
});

export const PropertySearchSchema = z.object({
    query: z.string().min(2).max(300),
});

// ─── Rate limit helper ─────────────────────────────────────

const checkFloorPlanRateLimit = async (requesterId: string, propertyId: string) => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await prisma.aIPlanRequest.count({
        where: { requesterId, propertyId, createdAt: { gte: since } },
    });
    if (count >= 3) {
        throw Object.assign(
            new Error('You have reached the limit of 3 floor plan generations per property per 24 hours'),
            { status: 429 }
        );
    }
};

// ─── Floor Plan Generation ──────────────────────────────────

export const generateFloorPlan = async (
    requesterId: string,
    input: z.infer<typeof FloorPlanSchema>
): Promise<object> => {
    const { propertyId, plotLength, plotWidth, floors, stylePrefs = 'modern', roomPrefs } = input;

    // Guard: property must be a PLOT
    const property = await prisma.property.findFirst({
        where: { id: propertyId, deletedAt: null },
        select: { id: true, type: true, title: true },
    });
    if (!property) throw Object.assign(new Error('Property not found'), { status: 404 });
    if (property.type !== 'PLOT') {
        throw Object.assign(new Error('Floor plan generation is only available for plot listings'), { status: 400 });
    }

    await checkFloorPlanRateLimit(requesterId, propertyId);

    // Create a PENDING record immediately
    const planRequest = await prisma.aIPlanRequest.create({
        data: {
            requesterId,
            propertyId,
            status: 'PROCESSING',
            plotLength,
            plotWidth,
            floors,
            stylePrefs,
            roomPrefs,
        },
    });

    const startMs = Date.now();

    try {
        // ── Step 1: GPT-4o layout generation ──────────────────
        const roomList = [
            `${roomPrefs.bedrooms} bedroom(s)`,
            `${roomPrefs.bathrooms} bathroom(s)`,
            `${roomPrefs.kitchen} kitchen`,
            `${roomPrefs.hall} hall/living room`,
            roomPrefs.pooja ? '1 pooja room' : null,
            roomPrefs.parking > 0 ? `${roomPrefs.parking} parking space(s)` : null,
        ]
            .filter(Boolean)
            .join(', ');

        const layoutPrompt = `You are an Indian residential architect. 
Generate a practical 2D floor plan layout for a plot of ${plotLength}ft × ${plotWidth}ft with ${floors} floor(s).
Style: ${stylePrefs}. Vastu-compliant where possible.
Include these spaces: ${roomList}.
Respond ONLY with valid JSON in this exact schema:
{
  "floors": [
    {
      "level": "Ground",
      "rooms": [
        { "name": "Living Room", "dimensions": "16x14ft", "position": "front-centre" }
      ]
    }
  ],
  "totalArea": "2400 sqft",
  "notes": "brief notes"
}`;

        const layoutResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: layoutPrompt }],
            response_format: { type: 'json_object' },
            max_tokens: 1000,
        });

        const layoutJson = JSON.parse(layoutResponse.choices[0].message.content ?? '{}');

        // ── Step 2: DALL·E 3 floor plan image ─────────────────
        const imagePrompt = `Architectural 2D floor plan blueprint, top-down view, white background, precise lines, labeled rooms.
Plot: ${plotLength}ft × ${plotWidth}ft, ${floors} floors, ${stylePrefs} Indian residential style.
Rooms by floor: ${JSON.stringify(layoutJson.floors)}.
Clean, professional, black and white architectural drawing style. No text overlays.`;

        const imageResponse = await openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            size: '1024x1024',
            quality: 'standard',
            n: 1,
        });

        const floorPlanUrl = imageResponse.data[0].url ?? '';
        const generationMs = Date.now() - startMs;

        // Update DB record with results
        const updated = await prisma.aIPlanRequest.update({
            where: { id: planRequest.id },
            data: {
                status: 'COMPLETED',
                layoutJson,
                floorPlanUrl,
                generationMs,
            },
        });

        logger.info('Floor plan generated', {
            requestId: planRequest.id,
            propertyId,
            generationMs,
        });

        return updated;
    } catch (error) {
        await prisma.aIPlanRequest.update({
            where: { id: planRequest.id },
            data: {
                status: 'FAILED',
                errorMessage: (error as Error).message,
            },
        });
        logger.error('Floor plan generation failed', { error, planRequestId: planRequest.id });
        throw Object.assign(new Error('Floor plan generation failed. Please try again.'), { status: 502 });
    }
};

// ─── AI Property Search ─────────────────────────────────────

export const aiPropertySearch = async (query: string): Promise<object> => {
    /**
     * Converts a natural-language query into structured search filters
     * e.g. "3 bhk flat in Whitefield under 50 lakhs" →
     *      { city: "Bangalore", locality: "Whitefield", bhk: 3, type: "APARTMENT", maxPrice: 5000000 }
     */
    const prompt = `You are a smart real estate search assistant for India.
Convert this natural language query into a JSON filter object for searching Indian properties.
Query: "${query}"

Return ONLY valid JSON with these optional fields:
{
  "city": string | null,
  "locality": string | null,
  "bhk": number | null,
  "type": "APARTMENT" | "VILLA" | "INDEPENDENT_HOUSE" | "PLOT" | "COMMERCIAL" | "PG" | null,
  "transactionType": "SALE" | "RENT" | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "furnishing": "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED" | null,
  "keywords": string[]
}
Convert price mentions to INR numbers. "50 lakhs" = 5000000, "1 crore" = 10000000.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 300,
    });

    const filters = JSON.parse(response.choices[0].message.content ?? '{}');
    return { filters, originalQuery: query };
};
