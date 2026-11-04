import { useId, useState } from "react";
import { trpc } from "@/lib/trpc";

/** An optional newsletter invitation, not a promise of an undelivered article bonus. */
export function BlogContentUpgrade({ blogSlug }: { blogSlug: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [renderedAt] = useState(() => Date.now());
  const subscription = trpc.newsletter.subscribe.useMutation();

  return (
    <aside className="journal-newsletter" aria-labelledby={`${id}-title`} data-article={blogSlug}>
      <p className="journal-eyebrow">A letter, now and then</p>
      <h2 id={`${id}-title`}>Keep a place in the Inner Circle.</h2>
      <p>Notes from Reese, new-release news, and a free Hudson Dynasty prequel. Only if you’d like them.</p>
      {subscription.isSuccess ? (
        <div role="status">
          <p>You’re subscribed. Your free prequel is available below.</p>
          <a href={subscription.data.bookDownloadUrl} target="_blank" rel="noopener noreferrer" className="journal-link">Read The First Acquisition on BookFunnel <span className="sr-only">(opens in a new tab)</span></a>
        </div>
      ) : (
        <form onSubmit={event => {
          event.preventDefault();
          subscription.mutate({ email: email.trim(), company_website: website, formRenderedAt: renderedAt, formSubmittedAt: Date.now() });
        }}>
          <label htmlFor={`${id}-email`}>Your email address</label>
          <div className="journal-signup-row">
            <input id={`${id}-email`} type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required maxLength={254} aria-describedby={`${id}-consent`} />
            <button type="submit" className="journal-button" disabled={subscription.isPending}>{subscription.isPending ? "Joining…" : "Join the letters"}</button>
          </div>
          <div hidden aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
          {subscription.error && <p role="alert">We couldn’t subscribe you just now. Please try again in a moment.</p>}
          <p id={`${id}-consent`} className="journal-fine-print">By joining, you agree to receive Reese’s newsletter. Unsubscribe anytime. <a href="/privacy">Privacy policy</a>.</p>
        </form>
      )}
    </aside>
  );
}
