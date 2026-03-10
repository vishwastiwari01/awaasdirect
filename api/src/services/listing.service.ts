import { z } from 'zod';
import { Prisma, PropertyType, TransactionType, FurnishingStatus, PropertyStatus } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// ─── Zod Schemas ─────────────────────────────────────────────

export const CreatePropertySchema = z.object({
    title: z.string().min(5).max(200),
    description: z.string().max(5000).optional(),
    type: z.nativeEnum(PropertyType),
    transactionType: z.nativeEnum(TransactionType),
    city: z.string().min(2).max(100),
    locality: z.string().min(2).max(100),
    address: z.string().max(300).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    bhk: z.number().int().min(1).max(10).optional(),
    sqft: z.number().positive(),
    plotLength: z.number().positive().optional(),
    plotWidth: z.number().positive().optional(),
    floors: z.number().int().positive().optional(),
    facing: z.string().max(50).optional(),
    furnishing: z.nativeEnum(FurnishingStatus).optional(),
    availableFrom: z.string().datetime().optional(),
    price: z.number().positive(),
    priceNegotiable: z.boolean().optional(),
    maintenanceCharge: z.number().positive().optional(),
    deposit: z.number().positive().optional(),
    // RERA (optional at creation)
    reraNumber: z.string().max(100).optional(),
    reraState: z.string().max(100).optional(),
});

export const UpdatePropertySchema = CreatePropertySchema.partial();

export const PropertyFiltersSchema = z.object({
    city: z.string().optional(),
    locality: z.string().optional(),
    type: z.nativeEnum(PropertyType).optional(),
    transactionType: z.nativeEnum(TransactionType).optional(),
    bhk: z.coerce.number().int().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    furnishing: z.nativeEnum(FurnishingStatus).optional(),
    verifiedOnly: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
    q: z.string().max(200).optional(),  // full-text search query
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'most_viewed']).default('newest'),
});

// ─── Service Functions ──────────────────────────────────────

export const listProperties = async (
    filters: z.infer<typeof PropertyFiltersSchema>
): Promise<{ properties: object[]; total: number; page: number; totalPages: number }> => {
    const { city, locality, type, transactionType, bhk, minPrice, maxPrice,
        furnishing, verifiedOnly, q, page, limit, sortBy } = filters;

    const where: Prisma.PropertyWhereInput = {
        deletedAt: null,
        status: PropertyStatus.ACTIVE,
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(locality && { locality: { contains: locality, mode: 'insensitive' } }),
        ...(type && { type }),
        ...(transactionType && { transactionType }),
        ...(bhk && { bhk }),
        ...(furnishing && { furnishing }),
        ...(minPrice || maxPrice
            ? { price: { ...(minPrice ? { gte: minPrice } : {}), ...(maxPrice ? { lte: maxPrice } : {}) } }
            : {}),
        ...(verifiedOnly
            ? { verification: { reraStatus: 'VERIFIED' } }
            : {}),
    };

    const orderBy: Prisma.PropertyOrderByWithRelationInput =
        sortBy === 'price_asc' ? { price: 'asc' }
            : sortBy === 'price_desc' ? { price: 'desc' }
                : sortBy === 'most_viewed' ? { viewCount: 'desc' }
                    : { createdAt: 'desc' };

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                title: true,
                type: true,
                transactionType: true,
                city: true,
                locality: true,
                bhk: true,
                sqft: true,
                price: true,
                furnishing: true,
                status: true,
                viewCount: true,
                createdAt: true,
                photos: {
                    where: { isCover: true },
                    take: 1,
                    select: { url: true },
                },
                verification: {
                    select: { reraStatus: true, aadhaarLinked: true },
                },
                owner: {
                    select: { id: true, name: true, aadhaarVerified: true },
                },
            },
        }),
        prisma.property.count({ where }),
    ]);

    return {
        properties,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

export const getPropertyById = async (id: string, incrementView = true): Promise<object> => {
    const property = await prisma.property.findFirst({
        where: { id, deletedAt: null },
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            verification: true,
            virtualTour: true,
            owner: {
                select: { id: true, name: true, image: true, aadhaarVerified: true, createdAt: true },
            },
        },
    });

    if (!property) throw Object.assign(new Error('Property not found'), { status: 404 });

    if (incrementView) {
        // Fire-and-forget view count increment
        prisma.property.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => { });
    }

    return property;
};

export const createProperty = async (
    ownerId: string,
    data: z.infer<typeof CreatePropertySchema>
): Promise<object> => {
    const { reraNumber, reraState, availableFrom, ...propertyData } = data;

    const property = await prisma.property.create({
        data: {
            ...propertyData,
            availableFrom: availableFrom ? new Date(availableFrom) : undefined,
            owner: { connect: { id: ownerId } },
            ...(reraNumber
                ? {
                    verification: {
                        create: {
                            reraNumber,
                            reraState,
                            reraStatus: 'PENDING',
                        },
                    },
                }
                : {}),
        },
        include: {
            photos: true,
            verification: true,
        },
    });

    logger.info('Property created', { propertyId: property.id, ownerId });
    return property;
};

export const updateProperty = async (
    id: string,
    ownerId: string,
    data: z.infer<typeof UpdatePropertySchema>
): Promise<object> => {
    const existing = await prisma.property.findFirst({
        where: { id, deletedAt: null },
    });
    if (!existing) throw Object.assign(new Error('Property not found'), { status: 404 });
    if (existing.ownerId !== ownerId) throw Object.assign(new Error('Forbidden'), { status: 403 });

    const { reraNumber, reraState, availableFrom, ...propertyData } = data;

    const updated = await prisma.property.update({
        where: { id },
        data: {
            ...propertyData,
            ...(availableFrom ? { availableFrom: new Date(availableFrom) } : {}),
        },
        include: { photos: true, verification: true },
    });

    logger.info('Property updated', { propertyId: id, ownerId });
    return updated;
};

export const deleteProperty = async (id: string, ownerId: string): Promise<void> => {
    const existing = await prisma.property.findFirst({
        where: { id, deletedAt: null },
    });
    if (!existing) throw Object.assign(new Error('Property not found'), { status: 404 });
    if (existing.ownerId !== ownerId) throw Object.assign(new Error('Forbidden'), { status: 403 });

    await prisma.property.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    logger.info('Property soft-deleted', { propertyId: id, ownerId });
};

export const getMyProperties = async (ownerId: string): Promise<object[]> => {
    return prisma.property.findMany({
        where: { ownerId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: {
            photos: { where: { isCover: true }, take: 1 },
            verification: { select: { reraStatus: true } },
            _count: { select: { conversations: true } },
        },
    });
};
