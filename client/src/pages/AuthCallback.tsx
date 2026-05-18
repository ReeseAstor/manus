import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GOLD, INK, TEXT, TEXT_SOFT } from '@/components/author-kit';

/**
 * Client-side bridge for OAuth and magic-link flows.
 *
 * Supabase JS (implicit flow, default) puts the session in the URL hash
 * after the provider redirects back. The library's `detectSessionInUrl`
 * picks it up automatically and stores it in localStorage. Once that
 * happens we forward the access_token to the server route, which mints
 * the Manus JWT cookie the rest of the app uses.
 */
export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.');
      return;
    }

    const url = new URL(window.location.href);
    const urlError =
      url.searchParams.get('error_description') ?? url.searchParams.get('error');
    if (urlError) {
      setError(urlError);
      return;
    }

    const redirectTo = url.searchParams.get('redirect') || '/';

    let unsubscribed = false;

    const handoff = (accessToken: string) => {
      if (unsubscribed) return;
      const target = `/api/auth/callback?access_token=${encodeURIComponent(
        accessToken,
      )}&redirect=${encodeURIComponent(redirectTo)}`;
      window.location.replace(target);
    };

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (unsubscribed) return;
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (data.session?.access_token) {
        handoff(data.session.access_token);
        return;
      }
      // Session may not be ready yet — wait for onAuthStateChange.
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (unsubscribed) return;
      if (event === 'SIGNED_IN' && session?.access_token) {
        handoff(session.access_token);
      }
    });

    const timeout = window.setTimeout(() => {
      if (unsubscribed) return;
      setError('Sign-in is taking too long. Please try again.');
    }, 15_000);

    return () => {
      unsubscribed = true;
      sub.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-cormorant"
      style={{ background: INK, color: TEXT }}
    >
      <div
        className="max-w-[420px] w-full p-10 text-center"
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(201,166,70,0.25)',
          borderRadius: 4,
        }}
      >
        <div
          className="font-inter text-[11px] font-semibold uppercase mb-4"
          style={{ color: GOLD, letterSpacing: '0.32em' }}
        >
          {error ? 'Sign-in problem' : 'One moment'}
        </div>
        <p
          className="font-cormorant italic text-[18px]"
          style={{ color: TEXT_SOFT }}
        >
          {error ? error : 'Finishing your sign-in…'}
        </p>
        {error && (
          <a
            href="/auth/login"
            className="font-inter inline-flex items-center justify-center gap-2 text-[12px] font-semibold uppercase no-underline mt-8 transition-all duration-200 hover:-translate-y-px"
            style={{
              color: INK,
              background: GOLD,
              padding: '14px 28px',
              letterSpacing: '0.22em',
              borderRadius: 4,
            }}
          >
            Try again
          </a>
        )}
      </div>
    </div>
  );
}
