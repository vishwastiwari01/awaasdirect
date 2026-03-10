import { z } from 'zod';
import prisma from '../config/database';
import { hashPassword, comparePassword, sha256 } from '../utils/hash';
import { signTokens, verifyRefreshToken, TokenPair } from '../utils/jwt';
import { logger } from '../utils/logger';
import { Role } from '@prisma/client';

// ─── Zod Schemas ─────────────────────────────────────────────
export const RegisterSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['BUYER', 'OWNER']).default('BUYER'),
});

export const LoginSchema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/),
    password: z.string().min(1),
});

export const RefreshSchema = z.object({
    refreshToken: z.string().min(1),
});

// ─── Service Functions ────────────────────────────────────────

export const registerUser = async (
    data: z.infer<typeof RegisterSchema>
): Promise<{ user: object; tokens: TokenPair }> => {
    const phoneHash = sha256(data.phone);

    // Check uniqueness
    const existing = await prisma.user.findFirst({
        where: {
            OR: [
                { phoneHash },
                ...(data.email ? [{ email: data.email }] : []),
            ],
        },
    });

    if (existing) {
        if (existing.phoneHash === phoneHash) {
            throw Object.assign(new Error('Phone number already registered'), { status: 409 });
        }
        throw Object.assign(new Error('Email already in use'), { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: phoneHash,       // stored hashed
            phoneHash,
            passwordHash,
            role: data.role as Role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            aadhaarVerified: true,
            createdAt: true,
        },
    });

    const tokens = signTokens({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        aadhaarVerified: user.aadhaarVerified,
    });

    logger.info('User registered', { userId: user.id, role: user.role });
    return { user, tokens };
};

export const loginUser = async (
    data: z.infer<typeof LoginSchema>
): Promise<{ user: object; tokens: TokenPair }> => {
    const phoneHash = sha256(data.phone);

    const user = await prisma.user.findUnique({
        where: { phoneHash },
    });

    if (!user || !user.isActive || user.deletedAt) {
        throw Object.assign(new Error('Invalid phone number or password'), { status: 401 });
    }

    if (!user.passwordHash) {
        throw Object.assign(new Error('This account uses OTP login. Please use OTP.'), { status: 400 });
    }

    const valid = await comparePassword(data.password, user.passwordHash);
    if (!valid) {
        throw Object.assign(new Error('Invalid phone number or password'), { status: 401 });
    }

    // Update lastLoginAt
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });

    const tokens = signTokens({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        aadhaarVerified: user.aadhaarVerified,
    });

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        aadhaarVerified: user.aadhaarVerified,
    };

    logger.info('User logged in', { userId: user.id });
    return { user: safeUser, tokens };
};

export const refreshTokens = async (
    refreshToken: string
): Promise<{ tokens: TokenPair }> => {
    let payload: { sub: string };
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true, aadhaarVerified: true, isActive: true, deletedAt: true },
    });

    if (!user || !user.isActive || user.deletedAt) {
        throw Object.assign(new Error('User not found'), { status: 401 });
    }

    const tokens = signTokens({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        aadhaarVerified: user.aadhaarVerified,
    });

    return { tokens };
};

export const getMe = async (userId: string): Promise<object> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            aadhaarVerified: true,
            isActive: true,
            createdAt: true,
            _count: { select: { properties: true, savedProperties: true } },
        },
    });

    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    return user;
};
