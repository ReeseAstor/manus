import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { GOLD } from "@/components/author-kit";

type Props = {
  /** The wrapped admin page. */
  children: ReactNode;
};

/**
 * Client-side gate for /admin/* routes.
 *
 * Behavior:
 *   - While the auth check is pending, renders a centered gold spinner.
 *   - If the user is unauthenticated, redirects to /auth/login with a
 *     `redirect` query param so they bounce back after sign-in.
 *   - If the user is authenticated but not admin, renders a 403 panel
 *     (no redirect — they're already signed in, just not allowed).
 *   - If the user is admin, renders the wrapped children.
 *
 * Server-side authorization is still enforced via tRPC `adminProcedure`;
 * this guard is purely a UX improvement so non-admins never see the
 * admin chrome render before a tRPC 401/403 unmounts it.
 */
export function AdminRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;
    if (user) return;
    // Unauthenticated — bounce to login with redirect-back parameter.
    const next = encodeURIComponent(location);
    setLocation(`/auth/login?redirect=${next}`);
  }, [loading, user, location, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: `2px solid ${GOLD}33`, borderTopColor: GOLD }}
        />
      </div>
    );
  }

  if (!user) {
    // Redirect effect is in flight — render nothing in the meantime.
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="max-w-[480px] text-center">
          <div
            className="font-inter text-[11px] font-semibold uppercase mb-4"
            style={{ color: GOLD, letterSpacing: "0.32em" }}
          >
            403 · Not authorized
          </div>
          <h1
            className="font-display text-[36px] leading-[1.1] mb-4"
            style={{ color: "#F2ECDF", letterSpacing: "-0.02em" }}
          >
            This area is admin-only.
          </h1>
          <p className="font-cormorant italic text-[18px]" style={{ color: "#B9B0A2" }}>
            Your account doesn&rsquo;t have access. If you believe this is wrong, contact press@reeseastor.com.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
