import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import * as SavedService from '../services/saved.service';
import * as AuthService from '../services/auth.service';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getMe(req.user!.id);
    sendSuccess(res, user);
});

export const saveProperty = asyncHandler(async (req: Request, res: Response) => {
    const saved = await SavedService.saveProperty(req.user!.id, req.params.propertyId);
    sendCreated(res, saved, 'Property saved to wishlist');
});

export const getSaved = asyncHandler(async (req: Request, res: Response) => {
    const saved = await SavedService.getSavedProperties(req.user!.id);
    sendSuccess(res, saved);
});

export const unsaveProperty = asyncHandler(async (req: Request, res: Response) => {
    await SavedService.unsaveProperty(req.user!.id, req.params.propertyId);
    sendSuccess(res, null, 'Property removed from wishlist');
});
