import { Request, Response } from 'express';
import { supabase } from './supabase';
import * as db from './db';
import { sdk } from './_core/sdk';
import { getSessionCookieOptions } from './_core/cookies';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';

/**
 * Supabase Auth callback / session-handoff route.
 *
 * Route: GET /api/auth/callback
 *
 * Accepts either:
 *   • `?code=<pkce_code>` — for OAuth or magic-link flows where Supabase
 *     redirected the browser back here directly with a PKCE code that
 *     still needs exchanging server-side.
 *   • `?access_token=<jwt>` — for client-side flows (email/password,
 *     signup) where supabase-js already produced a session and the
 *     client is handing it off so we can mint the app session cookie.
 *
 * On success we mint a Manus-flavored signed JWT cookie (the same
 * `COOKIE_NAME` cookie the rest of the app already trusts via
 * `sdk.authenticateRequest()`) keyed to `supabase:<supabase_user_id>`.
 * Without this, a Supabase sign-in completes locally but every tRPC
 * call still sees the user as anonymous.
 */
export async function authCallback(req: Request, res: Response) {
  const { code, error, error_description, redirect, access_token } = req.query;

  if (error) {
    console.error('[Auth] Supabase returned error:', error, error_description);
    return res.redirect(
      `/auth/login?error=${encodeURIComponent(
        (error_description as string) || (error as string) || 'Authentication failed',
      )}`,
    );
  }

  try {
    let supabaseUser: { id: string; email?: string | null; user_metadata?: any } | null = null;

    if (typeof code === 'string' && code.length > 0) {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError || !data.user) {
        console.error('[Auth] exchangeCodeForSession failed:', exchangeError);
        return res.redirect(
          `/auth/login?error=${encodeURIComponent(exchangeError?.message ?? 'Could not exchange code')}`,
        );
      }
      supabaseUser = data.user as any;
    } else if (typeof access_token === 'string' && access_token.length > 0) {
      const { data, error: getUserError } = await supabase.auth.getUser(access_token);
      if (getUserError || !data.user) {
        console.error('[Auth] getUser(access_token) failed:', getUserError);
        return res.redirect(
          `/auth/login?error=${encodeURIComponent(getUserError?.message ?? 'Invalid session')}`,
        );
      }
      supabaseUser = data.user as any;
    } else {
      return res.redirect('/auth/login?error=Missing+authentication+code');
    }

    if (!supabaseUser?.id) {
      return res.redirect('/auth/login?error=Supabase+user+missing+id');
    }

    const openId = `supabase:${supabaseUser.id}`;
    const email = supabaseUser.email ?? null;
    const name =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      (email ? email.split('@')[0] : null);

    await db.upsertUser({
      openId,
      email,
      name,
      loginMethod: 'supabase',
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(openId, {
      name: name ?? '',
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

    const redirectUrl =
      typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/';
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('[Auth] Unexpected error in callback:', err);
    return res.redirect('/auth/login?error=Authentication+failed');
  }
}
