import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { generalLimiter } from '../middleware/rateLimiter';
import * as UserController from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile with stats
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', generalLimiter, UserController.getProfile);

/**
 * @swagger
 * /api/saved-properties/{propertyId}:
 *   post:
 *     summary: Save a property to wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/saved-properties/:propertyId', UserController.saveProperty);

/**
 * @swagger
 * /api/saved-properties:
 *   get:
 *     summary: Get all saved properties for the user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/saved-properties', generalLimiter, UserController.getSaved);

/**
 * @swagger
 * /api/saved-properties/{propertyId}:
 *   delete:
 *     summary: Remove a property from wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/saved-properties/:propertyId', UserController.unsaveProperty);

export default router;
