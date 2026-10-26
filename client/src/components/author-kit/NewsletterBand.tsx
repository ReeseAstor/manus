import { motion, useReducedMotion } from "framer-motion";
import { FormEvent, useState } from "react";
import { Eyebrow } from "./Eyebrow";
import { GOLD, GOLD_SOFT, KIT_EASE, MUTED, RULE_SOFT, SURFACE, TEXT, TEXT_SOFT } from "./tokens";

type Props = {
  /**
   * Required handler that performs the actual subscription. The component
   * only advances to its success state once this resolves; if it rejects,
   * the error message is shown inline and the form stays editable.
   */
  onSubscribe: (email: string) => Promise<void>;
  /** Where the "Or claim your free prequel novella" link points. */
  freeBookHref?: string;
};

export function NewsletterBand({ onSubscribe, freeBookHref = "/free-book" }: Props) {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubscribe(email);
      setSubscribed(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="px-16 py-[160px]"
      style={{ background: SURFACE, borderTop: `1px solid ${RULE_SOFT}`, borderBottom: `1px solid ${RULE_SOFT}` }}
    >
      <motion.div
        className="max-w-[680px] mx-auto text-center"
        initial={reduce ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: KIT_EASE }}
      >
        <Eyebrow align="center">The Inner Circle</Eyebrow>
        <h2
          className="font-display font-normal text-[54px] leading-[1.05] mt-[22px]"
          style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
        >
          News and new releases,<br />
          <em className="font-normal">straight from Reese.</em>
        </h2>
        <div className="mx-auto my-8 h-px w-14" style={{ background: GOLD_SOFT }} />
        <p
          className="font-cormorant italic text-[21px] leading-[1.55] mb-11"
          style={{ color: TEXT_SOFT, textWrap: "pretty" }}
        >
          News, new releases, and a free prequel novella, straight from Reese.
        </p>

        {subscribed ? (
          <div className="font-cormorant italic text-[22px]" style={{ color: GOLD }}>
            Welcome. Your free prequel novella is on its way.
          </div>
        ) : (
          <>
            <form
              onSubmit={submit}
              className="mx-auto flex max-w-[540px] justify-center"
              style={{ borderBottom: `1px solid ${GOLD_SOFT}` }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email address"
                required
                disabled={submitting}
                aria-label="Email address"
                className="font-cormorant flex-1 bg-transparent border-none outline-none disabled:opacity-60"
                style={{ color: TEXT, padding: "14px 4px", fontSize: 19 }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="font-inter cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                style={{
                  background: "transparent", border: "none", color: GOLD,
                  padding: "14px 4px", fontWeight: 600, fontSize: 11,
                  letterSpacing: "0.28em", textTransform: "uppercase",
                }}
              >
                {submitting ? "Joining…" : "Subscribe →"}
              </button>
            </form>
            {error && (
              <p
                className="font-inter text-[12px] mt-4"
                style={{ color: "#7A4F4C", letterSpacing: "0.08em" }}
                role="alert"
              >
                {error}
              </p>
            )}
          </>
        )}

        <p
          className="font-inter text-[11px] uppercase mt-[18px]"
          style={{ color: MUTED, letterSpacing: "0.22em" }}
        >
          A couple of emails a month · Unsubscribe anytime
        </p>

        <a
          href={freeBookHref}
          className="font-cormorant italic text-[17px] inline-block mt-[26px] no-underline pb-0.5"
          style={{ color: GOLD, borderBottom: `1px solid ${GOLD_SOFT}` }}
        >
          Or claim your free prequel novella instantly →
        </a>
      </motion.div>
    </section>
  );
}
