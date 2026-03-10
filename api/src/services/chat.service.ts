import { z } from 'zod';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// ─── Zod Schemas ─────────────────────────────────────────────

export const CreateConversationSchema = z.object({
    propertyId: z.string().cuid(),
});

export const SendMessageSchema = z.object({
    conversationId: z.string().cuid(),
    content: z.string().min(1).max(2000),
});

export const GetMessagesSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(30),
});

// ─── Service Functions ──────────────────────────────────────

export const createOrGetConversation = async (
    buyerId: string,
    propertyId: string
): Promise<object> => {
    // Ensure property exists and is active
    const property = await prisma.property.findFirst({
        where: { id: propertyId, deletedAt: null, status: 'ACTIVE' },
        select: { id: true, ownerId: true, title: true },
    });
    if (!property) throw Object.assign(new Error('Property not found or inactive'), { status: 404 });

    // Prevent owner chatting with themselves
    if (property.ownerId === buyerId) {
        throw Object.assign(new Error('You cannot start a conversation on your own listing'), { status: 400 });
    }

    // Upsert — one conversation per buyer+property
    const conversation = await prisma.conversation.upsert({
        where: { buyerId_propertyId: { buyerId, propertyId } },
        update: {},
        create: { buyerId, propertyId },
        include: {
            property: { select: { id: true, title: true, city: true, locality: true } },
            buyer: { select: { id: true, name: true } },
        },
    });

    logger.info('Conversation created/fetched', { conversationId: conversation.id, buyerId });
    return conversation;
};

export const getMyConversations = async (userId: string): Promise<object[]> => {
    // A user might be a buyer or an owner — we fetch both perspectives
    const conversations = await prisma.conversation.findMany({
        where: {
            deletedAt: null,
            OR: [
                { buyerId: userId },
                { property: { ownerId: userId } },
            ],
        },
        orderBy: { updatedAt: 'desc' },
        include: {
            property: {
                select: { id: true, title: true, city: true, locality: true, ownerId: true },
            },
            buyer: { select: { id: true, name: true, image: true } },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { content: true, createdAt: true, senderId: true },
            },
        },
    });

    return conversations;
};

export const sendMessage = async (
    senderId: string,
    conversationId: string,
    content: string
): Promise<object> => {
    // Verify conversation exists and sender is a participant
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, deletedAt: null },
        include: { property: { select: { ownerId: true } } },
    });

    if (!conversation) throw Object.assign(new Error('Conversation not found'), { status: 404 });

    const isParticipant =
        conversation.buyerId === senderId || conversation.property.ownerId === senderId;
    if (!isParticipant) throw Object.assign(new Error('Forbidden'), { status: 403 });

    const message = await prisma.message.create({
        data: { conversationId, senderId, content },
        include: {
            sender: { select: { id: true, name: true, image: true } },
        },
    });

    // Touch conversation.updatedAt so inbox re-sorts
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    logger.info('Message sent', { conversationId, senderId, messageId: message.id });
    return message;
};

export const getMessages = async (
    userId: string,
    conversationId: string,
    page: number,
    limit: number
): Promise<{ messages: object[]; total: number; page: number; totalPages: number }> => {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, deletedAt: null },
        include: { property: { select: { ownerId: true } } },
    });

    if (!conversation) throw Object.assign(new Error('Conversation not found'), { status: 404 });

    const isParticipant =
        conversation.buyerId === userId || conversation.property.ownerId === userId;
    if (!isParticipant) throw Object.assign(new Error('Forbidden'), { status: 403 });

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                sender: { select: { id: true, name: true, image: true } },
            },
        }),
        prisma.message.count({ where: { conversationId } }),
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
        where: {
            conversationId,
            senderId: { not: userId },
            readAt: null,
        },
        data: { readAt: new Date() },
    });

    return { messages: messages.reverse(), total, page, totalPages: Math.ceil(total / limit) };
};
