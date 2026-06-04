# Better Auth

[Better Auth](https://www.better-auth.com) is installed alongside the existing
Manus OAuth / Supabase auth flow. It owns its own database tables and HTTP
routes, so the two systems coexist without interfering.

## Files

| File | Purpose |
| --- | --- |
| `server/auth.ts` | The Better Auth instance (Drizzle MySQL adapter, email/password + optional GitHub). |
| `drizzle/auth-schema.ts` | Drizzle schema for the Better Auth tables (`user`, `session`, `account`, `verification`). |
| `drizzle/0027_better_auth.sql` | Migration that creates those tables. |
| `client/src/lib/auth-client.ts` | Browser client (`better-auth/react`). |

The handler is mounted in `server/_core/app.ts` at `/api/auth/*`. It is
registered **before** `express.json()` because `toNodeHandler` parses the raw
request body itself. The legacy Supabase callback (`GET /api/auth/callback`) is
registered just ahead of the catch-all so it keeps handling that exact path;
Better Auth's own sub-routes (e.g. `/api/auth/sign-in/email`,
`/api/auth/callback/github`) fall through to the catch-all.

## Environment variables

```txt
BETTER_AUTH_SECRET=        # >= 32 chars, high entropy: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
VITE_BETTER_AUTH_URL=http://localhost:3000   # exposed to the browser client
GITHUB_CLIENT_ID=          # optional — set both to enable GitHub sign-on
GITHUB_CLIENT_SECRET=
```

## Database tables

Apply the migration with the project's existing tooling:

```bash
pnpm db:push   # drizzle-kit generate && drizzle-kit migrate
```

`drizzle/0027_better_auth.sql` can also be applied directly. The Better Auth
tables are intentionally separate from the legacy `users` table (which the
Manus/Supabase flow owns), so adopting Better Auth is non-destructive.

## Usage

Server:

```ts
import { auth } from "@/server/auth";
const session = await auth.api.getSession({ headers: req.headers });
```

Client:

```ts
import { authClient, signIn, signUp, useSession } from "@/lib/auth-client";

await signIn.email({ email, password });
const { data: session } = useSession();
```

See the [Better Auth docs](https://www.better-auth.com/docs/basic-usage) for
more.
