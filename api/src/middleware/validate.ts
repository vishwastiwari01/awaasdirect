import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

type Target = 'body' | 'query' | 'params';

export const validate =
    (schema: ZodSchema, target: Target = 'body') =>
        (req: Request, res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req[target]);
            if (!result.success) {
                const errors = result.error.flatten().fieldErrors;
                const firstMessage = Object.values(errors).flat()[0] ?? 'Validation failed';
                sendError(res, firstMessage, 422, 'VALIDATION_ERROR');
                return;
            }
            // Replace request target with parsed + coerced data
            (req as Record<string, unknown>)[target] = result.data;
            next();
        };
