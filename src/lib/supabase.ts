import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side client — only call inside Route Handlers or Server Components
export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      '[SpendPilot] Supabase env vars not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient(url, serviceKey);
}

// Client-side singleton (only used in browser components)
let _browserClient: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient() must only be called in the browser');
  }
  if (!_browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    _browserClient = createClient(url, key);
  }
  return _browserClient;
}
