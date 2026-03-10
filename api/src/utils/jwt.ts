import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '@prisma/client';

export interface JwtPayload {
    sub: string;      // user id
    email: string | null;
    name: string | null;
    role: Role;
    aadhaarVerified: boolean;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export const signTokens = (payload: JwtPayload): TokenPair => {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as string,
    });
    const refreshToken = jwt.sign({ sub: payload.sub }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as string,
    });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): { sub: string } => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
};
