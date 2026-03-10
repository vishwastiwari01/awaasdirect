import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendCreated, sendError } from '../utils/response';
import * as AuthService from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.registerUser(req.body);
    sendCreated(res, { user, tokens }, 'Account created successfully');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.loginUser(req.body);
    sendSuccess(res, { user, tokens }, 'Login successful');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { tokens } = await AuthService.refreshTokens(req.body.refreshToken);
    sendSuccess(res, { tokens }, 'Tokens refreshed');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getMe(req.user!.id);
    sendSuccess(res, user);
});
