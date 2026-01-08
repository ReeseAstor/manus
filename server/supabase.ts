import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client
 * 
 * This client is for server-side operations only.
 * Use this for:
 * - Server-side data fetching
 * - Background jobs
 * - API routes that need Supabase access
 * 
 * For client-side operations, use the client in client/src/lib/supabase.ts
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * Supabase client for server-side operations
 * Uses the anon key for public access
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a Supabase client with a specific user's access token
 * Use this when you need to perform operations on behalf of a specific user
 * 
 * @param accessToken - User's Supabase access token
 * @returns Supabase client authenticated as the user
 */
export function createSupabaseClient(accessToken: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * Example: Fetch data from Supabase
 * 
 * async function getSupabaseData() {
 *   const { data, error } = await supabase
 *     .from('your_table')
 *     .select('*')
 *     .limit(10);
 *   
 *   if (error) throw error;
 *   return data;
 * }
 */

/**
 * Example: Insert data into Supabase
 * 
 * async function insertSupabaseData(record: any) {
 *   const { data, error } = await supabase
 *     .from('your_table')
 *     .insert(record)
 *     .select()
 *     .single();
 *   
 *   if (error) throw error;
 *   return data;
 * }
 */

/**
 * Example: Subscribe to real-time changes
 * 
 * function subscribeToChanges(callback: (payload: any) => void) {
 *   const subscription = supabase
 *     .channel('your_channel')
 *     .on('postgres_changes', {
 *       event: '*',
 *       schema: 'public',
 *       table: 'your_table'
 *     }, callback)
 *     .subscribe();
 *   
 *   return () => subscription.unsubscribe();
 * }
 */
