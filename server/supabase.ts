import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client.
 *
 * Env resolution (first non-empty value wins):
 *   • SUPABASE_URL                — canonical server var
 *   • NEXT_PUBLIC_SUPABASE_URL    — legacy name kept for back-compat
 *   • VITE_SUPABASE_URL           — Vercel often exposes the Vite-prefixed
 *                                    client envs to the server as well
 *
 * Anon key follows the same priority order.
 *
 * Behavior when unconfigured: this module exports `isSupabaseConfigured =
 * false` and a `supabase` proxy that throws *on first use*. Importing the
 * file is always safe — the server can boot, OAuth routes can register,
 * and only the actual sign-in attempt fails (with a readable error,
 * surfaced at /auth/login?error=…).
 */

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Server client not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY ' +
      '(or the VITE_* equivalents) in the environment to enable auth callbacks.',
  );
}

function makeClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured on the server. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Server-side: don't auto-persist or auto-refresh anything;
      // we're stateless and only use this client for verify/exchange.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!_client) _client = makeClient();
  return _client;
}

// Lazy proxy: defers client creation (and therefore the env check) until
// a property is actually accessed. Lets the module import succeed even
// when envs are missing in local dev.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

/**
 * Create a Supabase client scoped to a specific user's access token —
 * use this when calling Supabase APIs that respect row-level security
 * on behalf of that user.
 */
export function createSupabaseClient(accessToken: string): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured on the server.');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
