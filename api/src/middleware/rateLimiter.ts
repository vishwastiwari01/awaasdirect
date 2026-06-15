import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { Request, Response } from 'express';

// General global limiter (e.g., 100/15min)
export const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Too many requests, please try again later', 429, 'RATE_LIMITED');
    },
});

// Login limiter: 5 requests / 15 min
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Too many login attempts, please try again later', 429, 'RATE_LIMITED');
    },
});

// Register limiter: 3 requests / hour
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Too many registration attempts, please try again later', 429, 'RATE_LIMITED');
    },
});

// Property post limiter: 20 / day
export const propertyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Daily property creation limit reached (20/day)', 429, 'RATE_LIMITED');
    },
});

// Chat messages limiter: 60 / min
export const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError(res, 'Sending messages too fast', 429, 'RATE_LIMITED');
    },
});
