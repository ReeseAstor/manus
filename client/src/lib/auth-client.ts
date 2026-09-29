/**
 * Auth client stub — project uses Supabase Auth (see supabase client).
 * Kept for compatibility; Better Auth is not installed to avoid extra dependency.
 * If Better Auth is needed later, install `better-auth` and restore the original.
 */
export const authClient = {
  signIn: async () => ({ error: "Better Auth not configured — use Supabase" }),
  signUp: async () => ({ error: "Better Auth not configured" }),
  signOut: async () => {},
  useSession: () => ({ data: null, isPending: false, error: null }),
} as unknown as { signIn: typeof fetch; signUp: typeof fetch; signOut: typeof fetch; useSession: () => { data: null; isPending: boolean; error: null } };

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
