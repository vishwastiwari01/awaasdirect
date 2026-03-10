import prisma from '../config/database';
import { logger } from '../utils/logger';

export const saveProperty = async (userId: string, propertyId: string): Promise<object> => {
    // Verify property exists
    const property = await prisma.property.findFirst({
        where: { id: propertyId, deletedAt: null },
        select: { id: true },
    });
    if (!property) throw Object.assign(new Error('Property not found'), { status: 404 });

    // Upsert — ignore if already saved
    const saved = await prisma.savedProperty.upsert({
        where: { userId_propertyId: { userId, propertyId } },
        update: {},
        create: { userId, propertyId },
        include: {
            property: {
                select: { id: true, title: true, city: true, locality: true, price: true },
            },
        },
    });

    logger.info('Property saved', { userId, propertyId });
    return saved;
};

export const getSavedProperties = async (userId: string): Promise<object[]> => {
    return prisma.savedProperty.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            property: {
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
                    status: true,
                    photos: { where: { isCover: true }, take: 1, select: { url: true } },
                    verification: { select: { reraStatus: true } },
                },
            },
        },
    });
};

export const unsaveProperty = async (userId: string, propertyId: string): Promise<void> => {
    const existing = await prisma.savedProperty.findUnique({
        where: { userId_propertyId: { userId, propertyId } },
    });
    if (!existing) throw Object.assign(new Error('Saved property not found'), { status: 404 });

    await prisma.savedProperty.delete({
        where: { userId_propertyId: { userId, propertyId } },
    });

    logger.info('Property unsaved', { userId, propertyId });
};
