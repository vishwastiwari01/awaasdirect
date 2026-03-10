import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, requireVerified } from '../middleware/authenticate';
import { generalLimiter } from '../middleware/rateLimiter';
import * as ChatController from '../controllers/chat.controller';
import {
    CreateConversationSchema,
    SendMessageSchema,
    GetMessagesSchema,
} from '../services/chat.service';

const router = Router();

// All conversation routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Start or get a conversation with a property owner
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId]
 *             properties:
 *               propertyId: { type: string }
 *     responses:
 *       201: { description: Conversation created or returned }
 *       400: { description: Cannot chat on your own listing }
 */
router.post('/', requireVerified, validate(CreateConversationSchema), ChatController.startConversation);

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Get all conversations for the authenticated user (inbox)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', generalLimiter, ChatController.myConversations);

export default router;
