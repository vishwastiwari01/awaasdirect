import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

/** Sign in with Google — redirects to Google OAuth page */
export async function signInWithGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });
    if (error) throw error;
}

/** Sign up with Email/Password */
export async function signUpWithEmail(email: string, password: string, name: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            }
        }
    });
    if (error) throw error;
    return data;
}

/** Sign in with Email/Password */
export async function signInWithEmail(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

/** Sign out from Supabase */
export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
}

/** Get current session */
export async function getSession() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
