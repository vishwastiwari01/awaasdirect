import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authLimiter } from '../middleware/rateLimiter';
import * as AuthController from '../controllers/auth.controller';
import {
    RegisterSchema,
    LoginSchema,
    RefreshSchema,
} from '../services/auth.service';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, password]
 *             properties:
 *               name:      { type: string }
 *               email:     { type: string, format: email }
 *               phone:     { type: string, example: "9876543210" }
 *               password:  { type: string, minLength: 8 }
 *               role:      { type: string, enum: [BUYER, OWNER] }
 *     responses:
 *       201: { description: Account created }
 *       409: { description: Phone or email already registered }
 *       422: { description: Validation error }
 */
router.post('/register', authLimiter, validate(RegisterSchema), AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with phone + password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone:    { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns tokens }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authLimiter, validate(LoginSchema), AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', validate(RefreshSchema), AuthController.refresh);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, AuthController.me);

export default router;
