import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '@prisma/client';

export interface JwtPayload {
    sub: string;
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
    const accessToken = jwt.sign(
        payload as object,
        env.JWT_ACCESS_SECRET as string,
        { expiresIn: '15m' } as jwt.SignOptions
    );
    const refreshToken = jwt.sign(
        { sub: payload.sub } as object,
        env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' } as jwt.SignOptions
    );
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): { sub: string } => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
};
```