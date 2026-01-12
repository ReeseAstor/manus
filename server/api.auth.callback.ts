import { Request, Response } from 'express';
import { supabase } from './supabase';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Supabase Auth Callback Handler
 * 
 * This route handles the OAuth callback from Supabase Auth.
 * It exchanges the auth code for a session and syncs the user with the local database.
 * 
 * Route: GET /api/auth/callback
 * Query params: code, error, error_description
 */
export async function authCallback(req: Request, res: Response) {
  const { code, error, error_description, redirect } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('Supabase Auth error:', error, error_description);
    return res.redirect(`/?error=${encodeURIComponent(error_description as string || 'Authentication failed')}`);
  }

  // Validate code parameter
  if (!code || typeof code !== 'string') {
    return res.redirect('/?error=Invalid authentication code');
  }

  try {
    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError);
      return res.redirect(`/?error=${encodeURIComponent(sessionError.message)}`);
    }

    if (!sessionData.session || !sessionData.user) {
      return res.redirect('/?error=No session data received');
    }

    const { user: supabaseUser, session } = sessionData;

    // Sync user with local database
    await syncUserToLocalDatabase(supabaseUser);

    // Set session cookie or JWT token
    // Option 1: Store Supabase session in cookie
    res.cookie('supabase_session', JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Option 2: Create your own JWT token
    // const token = await createJWT({ userId: supabaseUser.id, email: supabaseUser.email });
    // res.cookie('auth_token', token, { ... });

    // Redirect to original destination or dashboard
    const redirectUrl = (redirect && typeof redirect === 'string') ? redirect : '/dashboard';
    return res.redirect(redirectUrl);

  } catch (err) {
    console.error('Unexpected error in auth callback:', err);
    return res.redirect('/?error=Authentication failed');
  }
}

/**
 * Sync Supabase user to local database
 * Creates or updates user record in the local users table
 */
async function syncUserToLocalDatabase(supabaseUser: any) {
  const email = supabaseUser.email;
  const supabaseId = supabaseUser.id;

  if (!email) {
    throw new Error('User email is required');
  }

  // Check if user exists in local database
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUsers.length > 0) {
    // Update existing user with Supabase ID if not already set
    const existingUser = existingUsers[0];
    
    // Add supabaseId field to user metadata if needed
    await db
      .update(users)
      .set({
        // Store Supabase ID in a metadata field or create a new column
        // For now, we'll just update the updated_at timestamp
        // You may want to add a supabaseId column to the users table
      })
      .where(eq(users.id, existingUser.id));

    return existingUser;
  } else {
    // Create new user
    // Use Supabase ID as openId for new users
    await db
      .insert(users)
      .values({
        openId: `supabase:${supabaseId}`,
        email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        loginMethod: 'supabase',
      });

    // Fetch the newly created user
    const newUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return newUsers[0];
  }
}

/**
 * Get current user from Supabase session cookie
 * Use this in protected routes to verify authentication
 */
export async function getCurrentUser(req: Request) {
  const sessionCookie = req.cookies.supabase_session;

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie);
    
    // Verify session with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);

    if (error || !user) {
      return null;
    }

    // Get user from local database
    const db = await getDb();
    if (!db) {
      return null;
    }

    const localUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!))
      .limit(1);

    return localUsers[0] || null;

  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

/**
 * Middleware to protect routes
 * Use this to ensure user is authenticated before accessing a route
 */
export async function requireAuth(req: Request, res: Response, next: Function) {
  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach user to request object
  (req as any).user = user;
  next();
}
