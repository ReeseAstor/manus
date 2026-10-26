import { useEffect, useMemo } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { X } from "lucide-react";
import { GOLD, GOLD_SOFT, INK, TEXT, TEXT_SOFT } from "./author-kit";

type Props = {
  /** Controlled visibility. Modal mounts only while open. */
  open: boolean;
  /** Called when the user dismisses (X button, backdrop, or successful completion). */
  onClose: () => void;
  /**
   * Pre-resolved Stripe checkout `client_secret` for an embedded session.
   * Pass `null` to render a loading state (useful when the parent kicks
   * off the mutation and opens the modal in the same batch). Pass an
   * error string via `error` if fetching failed.
   *
   * The caller owns the lifecycle — this component does not fetch.
   * That keeps the state graph simple and avoids the stale-closure
   * footgun of passing a thunk that captures parent state.
   */
  clientSecret: string | null;
  /** Optional error message — shown in place of the iframe. */
  error?: string | null;
  /** Label shown above the embedded iframe — e.g. "Order The Need for Permission". */
  title?: string;
};

// Singleton Stripe.js loader — only ever created once per page.
let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (stripePromise) return stripePromise;
  const key =
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.warn(
      "Stripe publishable key missing. Set VITE_STRIPE_PUBLISHABLE_KEY to enable checkout.",
    );
    stripePromise = Promise.resolve(null);
    return stripePromise;
  }
  stripePromise = loadStripe(key);
  return stripePromise;
}

/**
 * In-page Stripe embedded checkout. Uses ui_mode=embedded sessions so the
 * user never leaves reeseastor.com. The session's client_secret is fetched
 * lazily — the caller provides a thunk so the request only fires when the
 * modal opens.
 *
 * Fulfillment is decoupled: the existing Stripe webhook handler
 * (server/stripe-webhook.ts) processes `checkout.session.completed` events
 * for both this embedded flow and the legacy hosted-redirect flow.
 */
export function EmbeddedCheckoutModal({ open, onClose, clientSecret, error, title }: Props) {
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const options = useMemo(
    () => (clientSecret ? { clientSecret, onComplete: onClose } : null),
    [clientSecret, onClose],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Checkout"}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-cormorant"
      style={{ background: "rgba(74, 59, 58, 0.72)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-auto"
        style={{
          background: "#FAF7F7",
          border: `1px solid ${GOLD_SOFT}`,
          borderRadius: 4,
          color: TEXT,
        }}
      >
        <button
          type="button"
          aria-label="Close checkout"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 transition-opacity hover:opacity-70"
          style={{ color: GOLD, background: "transparent", border: "none" }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-6 pb-3">
          <div
            className="font-inter text-[11px] font-semibold uppercase mb-2"
            style={{ color: GOLD, letterSpacing: "0.32em" }}
          >
            Secure checkout · Stripe
          </div>
          {title && (
            <h2
              className="font-display text-[24px] leading-[1.2] m-0"
              style={{ color: TEXT, letterSpacing: "-0.01em" }}
            >
              {title}
            </h2>
          )}
        </div>

        <div className="px-6 pb-6">
          {!clientSecret && !error && (
            <div
              className="font-cormorant italic py-12 text-center"
              style={{ color: TEXT_SOFT }}
            >
              Preparing checkout…
            </div>
          )}

          {error && (
            <div
              className="font-inter text-[13px] py-8 text-center"
              style={{ color: "#7A4F4C" }}
              role="alert"
            >
              {error}
              <div className="mt-4">
                <button
                  onClick={onClose}
                  className="font-inter text-[12px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
                  style={{
                    color: INK,
                    background: GOLD,
                    padding: "12px 22px",
                    letterSpacing: "0.22em",
                    border: "none",
                    borderRadius: 4,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {options && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
