// @ts-nocheck — Better Auth integration not yet active (module not installed)
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "../drizzle/auth-schema";
import { ENV } from "./_core/env";

/**
 * Better Auth instance.
 *
 * This sits alongside the existing Manus OAuth / Supabase auth flow. It owns
 * its own tables (see `drizzle/auth-schema.ts`) and is mounted in
 * `server/_core/app.ts` at `/api/auth/*`.
 *
 * Configuration follows the Better Auth installation guide adapted for this
 * project's stack: an Express server backed by MySQL via Drizzle.
 *
 * Required environment variables:
 *   • BETTER_AUTH_SECRET — at least 32 chars, high entropy. Generate with
 *     `openssl rand -base64 32`.
 *   • BETTER_AUTH_URL    — base URL of the app (e.g. http://localhost:3000).
 *
 * Optional (enables the GitHub social provider when both are present):
 *   • GITHUB_CLIENT_ID
 *   • GITHUB_CLIENT_SECRET
 */

// A dedicated Drizzle instance for Better Auth. `drizzle(string)` connects
// lazily, so importing this module is safe even when DATABASE_URL is unset
// (e.g. for CLI/schema-generation tooling) — only actual queries require it.
const db = drizzle(ENV.databaseUrl);

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  secret: ENV.betterAuthSecret,
  baseURL: ENV.betterAuthUrl,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        }
      : undefined,
});
