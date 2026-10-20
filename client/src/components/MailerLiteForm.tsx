import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ml?: ((...args: any[]) => void) & { q?: any[] };
  }
}

const MAILERLITE_UNIVERSAL_SRC = "https://assets.mailerlite.com/js/universal.js";
const MAILERLITE_ACCOUNT_ID = "1246760";

interface MailerLiteFormProps {
  /** The MailerLite embedded form ID (the data-form value). */
  formId: string;
  className?: string;
}

/**
 * Renders a MailerLite embedded form (`<div class="ml-embedded" data-form="...">`).
 *
 * The global MailerLite Universal snippet was removed from index.html because
 * the account-level auto-popup it loaded showed a name that does not belong on
 * this site. Embedded forms now opt in explicitly: this component bootstraps the
 * universal loader + account on mount, then re-scans the DOM so the
 * `.ml-embedded` div hydrates on any client-side route. Loading MailerLite only
 * where a form is actually rendered keeps the auto-popup off the rest of the site.
 */
export function MailerLiteForm({ formId, className }: MailerLiteFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hydrate = () => {
      const container = containerRef.current;
      if (!container) return;

      // If MailerLite already populated this form, do nothing.
      if (container.querySelector("form, iframe")) return;

      // Define the universal command stub if the library hasn't loaded yet,
      // mirroring the snippet that previously lived in index.html.
      if (typeof window.ml !== "function") {
        window.ml = function (...args: any[]) {
          (window.ml!.q = window.ml!.q || []).push(args);
        };
      }

      // (Re-)inject the universal script so the library scans the DOM and
      // hydrates the now-mounted embed div. A fresh element is appended each
      // mount so the script's IIFE re-runs (browsers dedupe cached fetches).
      const script = document.createElement("script");
      script.src = `${MAILERLITE_UNIVERSAL_SRC}?v=${Date.now()}`;
      script.async = true;
      document.body.appendChild(script);

      // Register the account so the embedded form can hydrate. Queued until
      // universal.js finishes loading, then processed.
      window.ml("account", MAILERLITE_ACCOUNT_ID);
    };

    // Defer one tick so the embed div is in the DOM before the scan runs.
    const timer = window.setTimeout(hydrate, 50);
    return () => window.clearTimeout(timer);
  }, [formId]);

  return (
    <div className={className}>
      <div className="ml-embedded" data-form={formId} ref={containerRef} />
    </div>
  );
}

export default MailerLiteForm;
