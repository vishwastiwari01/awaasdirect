import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(4000),
    API_URL: z.string().url(),
    FRONTEND_URL: z.string().url(),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    AWS_REGION: z.string().default('ap-south-1'),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),

    OPENAI_API_KEY: z.string().min(1),

    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().email().default('noreply@awaasdirect.in'),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX: z.coerce.number().default(100),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().default(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
