import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import * as ChatService from '../services/chat.service';

export const startConversation = asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.body;
    const conversation = await ChatService.createOrGetConversation(req.user!.id, propertyId);
    sendCreated(res, conversation, 'Conversation started');
});

export const myConversations = asyncHandler(async (req: Request, res: Response) => {
    const conversations = await ChatService.getMyConversations(req.user!.id);
    sendSuccess(res, conversations);
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId, content } = req.body;
    const message = await ChatService.sendMessage(req.user!.id, conversationId, content);
    sendCreated(res, message, 'Message sent');
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '30' } = req.query as Record<string, string>;
    const result = await ChatService.getMessages(
        req.user!.id,
        req.params.conversationId,
        parseInt(page),
        parseInt(limit)
    );
    sendSuccess(res, result);
});
