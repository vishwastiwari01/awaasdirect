import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import * as ListingService from '../services/listing.service';

export const list = asyncHandler(async (req: Request, res: Response) => {
    const result = await ListingService.listProperties(req.query as any);
    sendSuccess(res, result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const property = await ListingService.getPropertyById(req.params.id);
    sendSuccess(res, property);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const property = await ListingService.createProperty(req.user!.id, req.body);
    sendCreated(res, property, 'Property listing created');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const property = await ListingService.updateProperty(req.params.id, req.user!.id, req.body);
    sendSuccess(res, property, 'Property updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
    await ListingService.deleteProperty(req.params.id, req.user!.id);
    sendSuccess(res, null, 'Property deleted');
});

export const myListings = asyncHandler(async (req: Request, res: Response) => {
    const properties = await ListingService.getMyProperties(req.user!.id);
    sendSuccess(res, properties);
});

export const uploadPhotos = asyncHandler(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return sendError(res, 'No files uploaded', 400, 'BAD_REQUEST');
    }
    const propertyId = req.params.id;
    const ownerId = req.user!.id;
    // Pass the files to the service (which uploads to S3 and saves to DB)
    const photos = await ListingService.uploadPropertyPhotos(propertyId, ownerId, req.files as Express.Multer.File[]);
    sendCreated(res, photos, 'Photos uploaded successfully');
});
