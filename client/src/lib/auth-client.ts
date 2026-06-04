import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client for browser-side operations.
 *
 * Talks to the Better Auth handler mounted at `/api/auth/*` on the server
 * (see `server/_core/app.ts`). When the client and server share the same
 * origin you can omit `baseURL` entirely; we set it explicitly from
 * `VITE_BETTER_AUTH_URL` so deployments that serve the API from a different
 * origin keep working. Falls back to the current origin in the browser.
 */
const baseURL =
  import.meta.env.VITE_BETTER_AUTH_URL ||
  (typeof window !== "undefined" ? window.location.origin : undefined);

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
