import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { Request, Response } from 'express';

/** General API rate limiter: 100 req / 15 min per IP */
export const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Too many requests, please try again later', 429, 'RATE_LIMITED');
    },
});

/** Auth limiter: 5 req / 15 min per IP (OTP & login) */
export const authLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Too many auth attempts, please try again later', 429, 'RATE_LIMITED');
    },
});
