import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ml?: (...args: any[]) => void;
  }
}

const MAILERLITE_UNIVERSAL_SRC =
  "https://assets.mailerlite.com/js/universal.js";

interface MailerLiteFormProps {
  /** The MailerLite embedded form ID (the data-form value). */
  formId: string;
  className?: string;
}

/**
 * Renders a MailerLite embedded form (`<div class="ml-embedded" data-form="...">`).
 *
 * The MailerLite Universal snippet lives in index.html and scans the DOM for
 * `.ml-embedded` divs a single time on initial page load. In a client-side
 * routed SPA, this component frequently mounts *after* that scan has already
 * run, so the form would otherwise render as an empty div.
 *
 * To make embeds reliable on every route, we re-inject the universal script on
 * mount. Re-executing universal.js re-scans the DOM and hydrates any
 * `.ml-embedded` divs that are now present, including this one.
 */
export function MailerLiteForm({ formId, className }: MailerLiteFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hydrate = () => {
      const container = containerRef.current;
      if (!container) return;

      // If MailerLite already populated this form, do nothing.
      if (container.querySelector("form, iframe")) return;

      // Re-inject the universal script so the library re-scans the DOM and
      // hydrates the now-mounted embed div. A fresh element is appended each
      // mount so the script's IIFE re-runs (browsers dedupe cached fetches).
      const script = document.createElement("script");
      script.src = `${MAILERLITE_UNIVERSAL_SRC}?v=${Date.now()}`;
      script.async = true;
      document.body.appendChild(script);
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
