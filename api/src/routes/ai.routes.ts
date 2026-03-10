import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, requireVerified } from '../middleware/authenticate';
import { generalLimiter } from '../middleware/rateLimiter';
import * as AiController from '../controllers/ai.controller';
import { FloorPlanSchema, PropertySearchSchema } from '../services/ai.service';

const router = Router();

/**
 * @swagger
 * /api/ai/floor-plan:
 *   post:
 *     summary: Generate an AI floor plan for a plot listing
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, plotLength, plotWidth, floors, roomPrefs]
 *             properties:
 *               propertyId:  { type: string }
 *               plotLength:  { type: number }
 *               plotWidth:   { type: number }
 *               floors:      { type: integer }
 *               stylePrefs:  { type: string }
 *               roomPrefs:
 *                 type: object
 *                 properties:
 *                   bedrooms:  { type: integer }
 *                   bathrooms: { type: integer }
 *                   kitchen:   { type: integer }
 *                   hall:      { type: integer }
 *                   pooja:     { type: boolean }
 *                   parking:   { type: integer }
 *     responses:
 *       201: { description: Floor plan generated (returns layoutJson + floorPlanUrl) }
 *       429: { description: Rate limit exceeded (3 per property per 24h) }
 *       400: { description: Property is not a plot }
 */
router.post(
    '/floor-plan',
    authenticate,
    requireVerified,
    validate(FloorPlanSchema),
    AiController.generateFloorPlan
);

/**
 * @swagger
 * /api/ai/property-search:
 *   post:
 *     summary: Convert a natural language query into search filters
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query]
 *             properties:
 *               query: { type: string, example: "3 bhk flat in Whitefield under 50 lakhs" }
 *     responses:
 *       200: { description: Structured filter object returned }
 */
router.post(
    '/property-search',
    generalLimiter,
    validate(PropertySearchSchema),
    AiController.aiSearch
);

export default router;
