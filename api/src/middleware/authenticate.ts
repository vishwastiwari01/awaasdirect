import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';
import { env } from '../config/env';

interface SupabaseJWTPayload {
    sub: string;          // Supabase user UUID
    email?: string;
    user_metadata?: {
        full_name?: string;
        name?: string;
        avatar_url?: string;
        picture?: string;
    };
    role?: string;
    aud?: string;
    exp?: number;
    iat?: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        sendError(res, 'Missing or invalid authorization header', 401, 'UNAUTHORIZED');
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify using Supabase JWT secret
        const payload = jwt.verify(token, env.SUPABASE_JWT_SECRET) as SupabaseJWTPayload;

        if (!payload.sub) {
            sendError(res, 'Invalid token payload', 401, 'TOKEN_INVALID');
            return;
        }

        // Auto-upsert user in our DB on first login
        const user = await prisma.user.upsert({
            where: { supabaseId: payload.sub },
            update: {
                // Update name/image if changed in Google profile
                ...(payload.email && { email: payload.email }),
                lastLoginAt: new Date(),
            },
            create: {
                supabaseId: payload.sub,
                email: payload.email ?? null,
                name: payload.user_metadata?.full_name ?? payload.user_metadata?.name ?? null,
                image: payload.user_metadata?.avatar_url ?? payload.user_metadata?.picture ?? null,
                phone: payload.sub, // placeholder — required field, use supabase ID
                phoneHash: payload.sub,
                role: 'BUYER', // default — owner upgrade flow later
                isActive: true,
                lastLoginAt: new Date(),
            },
        });

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            aadhaarVerified: user.aadhaarVerified,
        };
        next();
    } catch (err) {
        logger.warn('Invalid Supabase token', { error: (err as Error).message });
        sendError(res, 'Invalid or expired token', 401, 'TOKEN_INVALID');
    }
};

/** Gate: user must have completed Aadhaar KYC */
export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
        return;
    }
    if (!req.user.aadhaarVerified) {
        sendError(res, 'Aadhaar KYC verification required to perform this action', 403, 'KYC_REQUIRED');
        return;
    }
    next();
};

/** Gate: user must be an OWNER or ADMIN */
export const requireOwner = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN')) {
        sendError(res, 'Owner account required', 403, 'FORBIDDEN');
        return;
    }
    next();
};

/** Gate: user must be an ADMIN */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'ADMIN') {
        sendError(res, 'Admin account required', 403, 'FORBIDDEN');
        return;
    }
    next();
};
