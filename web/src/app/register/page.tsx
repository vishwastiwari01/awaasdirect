'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * /register now just redirects to /login.
 * With Google OAuth, sign-up and sign-in are the same flow —
 * new users are automatically created on first Google login.
 */
export default function RegisterPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/login');
    }, [router]);
    return null;
}
