import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        sendError(res, 'Missing or invalid authorization header', 401, 'UNAUTHORIZED');
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            aadhaarVerified: payload.aadhaarVerified,
        };
        next();
    } catch (err) {
        logger.warn('Invalid token attempt', { error: (err as Error).message });
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
