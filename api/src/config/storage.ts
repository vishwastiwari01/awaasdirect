import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { env } from './env';

// We use the service role key to bypass RLS for uploads from our backend
// Pass ws as realtime transport for Node.js < 22 (Render uses Node 20)
export const supabaseStorage = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        realtime: {
            transport: ws as any,
        },
    }
);

export const STORAGE_BUCKET = env.SUPABASE_BUCKET_NAME;
