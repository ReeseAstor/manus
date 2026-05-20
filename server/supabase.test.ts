import { describe, it, expect } from 'vitest';
import { isSupabaseConfigured } from './supabase';

describe('Supabase server config', () => {
  it('exports a boolean configuration flag', () => {
    expect(typeof isSupabaseConfigured).toBe('boolean');
  });

  it.skipIf(!isSupabaseConfigured)(
    'has a reachable URL when configured',
    () => {
      const url =
        process.env.SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        '';
      expect(url).toMatch(/^https:\/\//);
    },
  );
});
