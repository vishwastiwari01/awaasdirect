import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Supabase OAuth callback handler.
 * After Google login, Supabase redirects here with a ?code= param.
 * We exchange it for a session, then sync the user to our backend DB.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/properties';

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=missing_code`);
    }

    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.headers.get('cookie')?.split('; ').map(c => {
                        const [name, ...v] = c.split('=');
                        return { name, value: v.join('=') };
                    }) ?? [];
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error('[auth/callback] Error exchanging code:', error.message);
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    return response;
}
