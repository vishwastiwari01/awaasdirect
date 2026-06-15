import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// We use the service role key to bypass RLS for uploads from our backend
export const supabaseStorage = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
);

export const STORAGE_BUCKET = env.SUPABASE_BUCKET_NAME;
