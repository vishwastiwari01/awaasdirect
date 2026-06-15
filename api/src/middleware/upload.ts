import multer from 'multer';
import { Request } from 'express';
import { sendError } from '../utils/response';

// Store files in memory so we can upload them directly to S3 without touching local disk
const storage = multer.memoryStorage();

// Allowed image formats
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('INVALID_FILE_TYPE'));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
});

export const handleUploadError = (err: any, req: Request, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return sendError(res, 'File size exceeds 10MB limit', 413, 'FILE_TOO_LARGE');
        }
        return sendError(res, err.message, 400, 'UPLOAD_ERROR');
    } else if (err.message === 'INVALID_FILE_TYPE') {
        return sendError(res, 'Only JPG, PNG, and WEBP files are allowed', 415, 'INVALID_FILE_TYPE');
    }
    next(err);
};
