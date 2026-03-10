import { Response } from 'express';

export interface ApiSuccess<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    code?: string;
}

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message = 'OK',
    status = 200
): Response => res.status(status).json({ success: true, data, message } satisfies ApiSuccess<T>);

export const sendCreated = <T>(res: Response, data: T, message = 'Created'): Response =>
    sendSuccess(res, data, message, 201);

export const sendError = (
    res: Response,
    message: string,
    status = 400,
    code?: string
): Response => res.status(status).json({ success: false, message, code } satisfies ApiError);
