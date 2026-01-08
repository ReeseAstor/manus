import { describe, it, expect } from 'vitest';
import { supabase } from './supabase';

describe('Supabase Integration', () => {
  it('should have valid Supabase configuration', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toMatch(/^https:\/\//);
  });

  it('should create Supabase client successfully', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  it('should connect to Supabase successfully', async () => {
    // Test connection by checking if we can access the auth API
    // This is a lightweight check that doesn't require any tables
    const { data, error } = await supabase.auth.getSession();
    
    // We expect no error (even if session is null, that's fine)
    // An error would indicate connection problems
    expect(error).toBeNull();
  }, 10000); // 10 second timeout for network request
});
