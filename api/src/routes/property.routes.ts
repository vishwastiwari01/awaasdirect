import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, requireVerified, requireOwner } from '../middleware/authenticate';
import { generalLimiter } from '../middleware/rateLimiter';
import * as PropertyController from '../controllers/property.controller';
import {
    CreatePropertySchema,
    UpdatePropertySchema,
    PropertyFiltersSchema,
} from '../services/listing.service';

const router = Router();

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Search and list properties with filters
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [APARTMENT,VILLA,INDEPENDENT_HOUSE,PLOT,COMMERCIAL,PG] }
 *       - in: query
 *         name: transactionType
 *         schema: { type: string, enum: [SALE, RENT] }
 *       - in: query
 *         name: bhk
 *         schema: { type: integer }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: verifiedOnly
 *         schema: { type: boolean }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [price_asc, price_desc, newest, most_viewed] }
 *     responses:
 *       200: { description: List of properties with pagination }
 */
router.get('/', generalLimiter, validate(PropertyFiltersSchema, 'query'), PropertyController.list);

/**
 * @swagger
 * /api/properties/my:
 *   get:
 *     summary: Get all listings for the authenticated owner
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my', authenticate, requireOwner, PropertyController.myListings);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a single property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/:id', generalLimiter, PropertyController.getById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property listing (owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProperty'
 *     responses:
 *       201: { description: Property created }
 *       403: { description: Owner account required }
 */
router.post(
    '/',
    authenticate,
    requireVerified,
    requireOwner,
    validate(CreatePropertySchema),
    PropertyController.create
);

/**
 * @swagger
 * /api/properties/{id}:
 *   patch:
 *     summary: Update a property listing (owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:id',
    authenticate,
    requireVerified,
    validate(UpdatePropertySchema),
    PropertyController.update
);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Soft-delete a property listing (owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, PropertyController.remove);

export default router;
