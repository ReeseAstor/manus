import { createClient } from '@supabase/supabase-js';

/**
 * Client-side Supabase client
 * 
 * This client is for browser-side operations.
 * Use this for:
 * - Real-time subscriptions
 * - Client-side data fetching
 * - Browser-based authentication (if using Supabase auth)
 * 
 * For server-side operations, use the client in server/supabase.ts
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable Supabase features.'
  );
}

/**
 * Supabase client for client-side operations
 * Singleton instance - only created once
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Example: Fetch data from Supabase
 * 
 * import { supabase } from '@/lib/supabase';
 * 
 * async function fetchData() {
 *   const { data, error } = await supabase
 *     .from('your_table')
 *     .select('*')
 *     .limit(10);
 *   
 *   if (error) {
 *     console.error('Error fetching data:', error);
 *     return [];
 *   }
 *   return data;
 * }
 */

/**
 * Example: Real-time subscription
 * 
 * import { supabase } from '@/lib/supabase';
 * import { useEffect, useState } from 'react';
 * 
 * function useRealtimeData() {
 *   const [data, setData] = useState([]);
 * 
 *   useEffect(() => {
 *     // Initial fetch
 *     supabase.from('your_table').select('*').then(({ data }) => {
 *       if (data) setData(data);
 *     });
 * 
 *     // Subscribe to changes
 *     const subscription = supabase
 *       .channel('your_channel')
 *       .on('postgres_changes', {
 *         event: '*',
 *         schema: 'public',
 *         table: 'your_table'
 *       }, (payload) => {
 *         console.log('Change received!', payload);
 *         // Update local state based on payload
 *       })
 *       .subscribe();
 * 
 *     return () => {
 *       subscription.unsubscribe();
 *     };
 *   }, []);
 * 
 *   return data;
 * }
 */

/**
 * Example: Upload file to Supabase Storage
 * 
 * import { supabase } from '@/lib/supabase';
 * 
 * async function uploadFile(file: File, bucket: string, path: string) {
 *   const { data, error } = await supabase.storage
 *     .from(bucket)
 *     .upload(path, file);
 *   
 *   if (error) {
 *     console.error('Error uploading file:', error);
 *     throw error;
 *   }
 *   
 *   // Get public URL
 *   const { data: { publicUrl } } = supabase.storage
 *     .from(bucket)
 *     .getPublicUrl(path);
 *   
 *   return publicUrl;
 * }
 */
