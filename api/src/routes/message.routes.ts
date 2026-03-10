import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { generalLimiter } from '../middleware/rateLimiter';
import * as ChatController from '../controllers/chat.controller';
import { SendMessageSchema } from '../services/chat.service';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, content]
 *             properties:
 *               conversationId: { type: string }
 *               content: { type: string, maxLength: 2000 }
 *     responses:
 *       201: { description: Message sent }
 *       403: { description: Not a participant in this conversation }
 */
router.post('/', validate(SendMessageSchema), ChatController.sendMessage);

/**
 * @swagger
 * /api/messages/{conversationId}:
 *   get:
 *     summary: Get paginated message history for a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 30 }
 */
router.get('/:conversationId', generalLimiter, ChatController.getMessages);

export default router;
