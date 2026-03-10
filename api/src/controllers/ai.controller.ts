import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import * as AiService from '../services/ai.service';

export const generateFloorPlan = asyncHandler(async (req: Request, res: Response) => {
    const result = await AiService.generateFloorPlan(req.user!.id, req.body);
    sendCreated(res, result, 'Floor plan generation started');
});

export const aiSearch = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;
    const result = await AiService.aiPropertySearch(query);
    sendSuccess(res, result);
});
