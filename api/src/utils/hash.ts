import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

const BCRYPT_ROUNDS = 12;

export const hashPassword = (plain: string): Promise<string> =>
    bcrypt.hash(plain, BCRYPT_ROUNDS);

export const comparePassword = (plain: string, hashed: string): Promise<boolean> =>
    bcrypt.compare(plain, hashed);

/** SHA-256 hex — used for phone & Aadhaar (never stored plain) */
export const sha256 = (value: string): string =>
    createHash('sha256').update(value).digest('hex');
