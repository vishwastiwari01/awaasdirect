import { Request } from 'express';
import { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string | null;
                name: string | null;
                role: Role;
                aadhaarVerified: boolean;
            };
        }
    }
}

export { };
