import { useState } from 'react';
import { Link } from 'wouter';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLoginUrl } from '../const';
import { GOLD, GOLD_SOFT, INK, TEXT, TEXT_SOFT } from '@/components/author-kit';

// If Manus OAuth env is set, getLoginUrl() returns the portal URL; otherwise
// it falls back to /auth/login (this page). Used to offer "Continue with
// Manus" as a fallback when Supabase isn't configured.
const manusOAuthUrl = (() => {
  const portal = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  if (!portal || portal === 'undefined' || !appId) return null;
  return getLoginUrl();
})();

type Mode = 'signin' | 'signup';

export default function AuthLogin() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('error');
  });
  const [message, setMessage] = useState<string | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect') || '/';

  if (!isSupabaseConfigured) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 font-cormorant"
        style={{ background: INK, color: TEXT }}
      >
        <div
          className="max-w-[480px] w-full p-10 text-center"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${GOLD_SOFT}`,
            borderRadius: 4,
          }}
        >
          <div
            className="font-inter text-[11px] font-semibold uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.32em' }}
          >
            Sign in
          </div>
          <h2
            className="font-display text-[28px] leading-[1.2] mb-4"
            style={{ color: TEXT }}
          >
            Email sign-in is not yet enabled.
          </h2>
          <p
            className="font-cormorant italic text-[17px] mb-8"
            style={{ color: TEXT_SOFT }}
          >
            {manusOAuthUrl
              ? 'You can continue with the Manus OAuth portal, or come back later once email sign-in is configured.'
              : 'Reader sign-in is being set up. Please come back soon.'}
          </p>
          {manusOAuthUrl && (
            <a
              href={manusOAuthUrl}
              className="font-inter inline-flex items-center justify-center gap-2 text-[12px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
              style={{
                color: INK,
                background: GOLD,
                padding: '14px 28px',
                letterSpacing: '0.22em',
                borderRadius: 4,
              }}
            >
              Continue with Manus
            </a>
          )}
          <p className="font-cormorant italic text-[14px] mt-8" style={{ color: '#7B7464' }}>
            <Link href="/">
              <a style={{ color: GOLD, textDecoration: 'none' }}>&larr; Back to reeseastor.com</a>
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /** After a client-side session is established, hand the access_token
   *  to the server route so it can issue the Manus JWT cookie that the
   *  rest of the app reads via `ctx.user`. */
  const handoffToServer = (accessToken: string) => {
    window.location.href = `/api/auth/callback?access_token=${encodeURIComponent(
      accessToken,
    )}&redirect=${encodeURIComponent(redirectTo)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signin') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (data.session) {
          handoffToServer(data.session.access_token);
          return;
        }
        throw new Error('No session returned. Please try again.');
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
              redirectTo,
            )}`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          handoffToServer(data.session.access_token);
          return;
        }
        setMessage(
          'Check your email for a confirmation link to complete your sign-up.',
        );
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Enter your email first to receive a magic link.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
            redirectTo,
          )}`,
        },
      });
      if (otpError) throw otpError;
      setMessage('Check your email for the magic link.');
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
            redirectTo,
          )}`,
        },
      });
      if (oauthError) throw oauthError;
      // signInWithOAuth performs a full-page navigation; control rarely returns here.
    } catch (err: any) {
      setError(err.message || 'Failed to start OAuth');
      setLoading(false);
    }
  };

  const isSignIn = mode === 'signin';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 font-cormorant"
      style={{ background: INK, color: TEXT }}
    >
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-10">
          <div
            className="font-inter text-[11px] font-semibold uppercase mb-3"
            style={{ color: GOLD, letterSpacing: '0.32em' }}
          >
            Reader sign-in
          </div>
          <h1
            className="font-display text-[34px] leading-[1.15] m-0"
            style={{ color: TEXT, letterSpacing: '-0.01em' }}
          >
            {isSignIn ? 'Welcome back.' : 'Create your reader account.'}
          </h1>
          <p
            className="font-cormorant italic text-[16px] mt-3"
            style={{ color: TEXT_SOFT }}
          >
            For your purchase history and account details.
          </p>
        </div>

        <div
          className="p-8"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${GOLD_SOFT}`,
            borderRadius: 4,
          }}
        >
          {error && (
            <div
              className="mb-5 px-4 py-3 font-inter text-[13px]"
              role="alert"
              style={{
                background: 'rgba(224,141,141,0.08)',
                border: '1px solid rgba(224,141,141,0.4)',
                color: '#e08d8d',
                borderRadius: 4,
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="mb-5 px-4 py-3 font-cormorant italic text-[15px]"
              style={{
                background: 'rgba(201,166,70,0.08)',
                border: `1px solid ${GOLD_SOFT}`,
                color: TEXT,
                borderRadius: 4,
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="font-inter block text-[11px] font-semibold uppercase mb-2"
                style={{ color: GOLD, letterSpacing: '0.24em' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-inter w-full px-4 py-3 text-[15px] focus:outline-none transition"
                style={{
                  background: 'transparent',
                  border: `1px solid ${GOLD_SOFT}`,
                  color: TEXT,
                  borderRadius: 4,
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-inter block text-[11px] font-semibold uppercase mb-2"
                style={{ color: GOLD, letterSpacing: '0.24em' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignIn ? undefined : 8}
                className="font-inter w-full px-4 py-3 text-[15px] focus:outline-none transition"
                style={{
                  background: 'transparent',
                  border: `1px solid ${GOLD_SOFT}`,
                  color: TEXT,
                  borderRadius: 4,
                }}
                placeholder={isSignIn ? '••••••••' : 'At least 8 characters'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-inter w-full inline-flex items-center justify-center gap-2 text-[12px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-wait"
              style={{
                color: INK,
                background: GOLD,
                padding: '16px 22px',
                letterSpacing: '0.22em',
                border: 'none',
                borderRadius: 4,
              }}
            >
              {loading
                ? isSignIn
                  ? 'Signing in…'
                  : 'Creating account…'
                : isSignIn
                ? 'Sign in'
                : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading || !email}
            className="font-inter w-full mt-3 text-[12px] font-semibold uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: TEXT,
              background: 'transparent',
              padding: '14px 22px',
              letterSpacing: '0.22em',
              border: `1px solid ${GOLD_SOFT}`,
              borderRadius: 4,
            }}
          >
            Email me a magic link
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: GOLD_SOFT }} />
            <span
              className="font-inter text-[10px] font-semibold uppercase"
              style={{ color: TEXT_SOFT, letterSpacing: '0.32em' }}
            >
              Or continue with
            </span>
            <div className="flex-1 h-px" style={{ background: GOLD_SOFT }} />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="font-inter w-full inline-flex items-center justify-center gap-3 text-[12px] font-semibold uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: TEXT,
                background: 'transparent',
                padding: '14px 22px',
                letterSpacing: '0.22em',
                border: `1px solid ${GOLD_SOFT}`,
                borderRadius: 4,
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="font-inter w-full inline-flex items-center justify-center gap-3 text-[12px] font-semibold uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: TEXT,
                background: 'transparent',
                padding: '14px 22px',
                letterSpacing: '0.22em',
                border: `1px solid ${GOLD_SOFT}`,
                borderRadius: 4,
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMessage(null);
                setMode(isSignIn ? 'signup' : 'signin');
              }}
              className="font-cormorant italic text-[15px] underline-offset-4 hover:underline"
              style={{ color: GOLD, background: 'transparent', border: 'none' }}
            >
              {isSignIn
                ? "Don't have an account? Create one."
                : 'Already have an account? Sign in.'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <a
              className="font-cormorant italic text-[14px] no-underline"
              style={{ color: TEXT_SOFT }}
            >
              &larr; Back to reeseastor.com
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
