import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error('Unhandled error', {
        method: req.method,
        path: req.path,
        error: err.message,
        stack: err.stack,
    });

    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';
    sendError(res, err.message || 'An unexpected error occurred', status, code);
};

/** Wraps async route handlers to forward errors to errorHandler */
export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
        (req: Request, res: Response, next: NextFunction): void => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
