import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { trpc } from "@/lib/trpc";
import { EmbeddedCheckoutModal } from "@/components/EmbeddedCheckoutModal";
import {
  AudioSamplePlayer,
  CoverHalo,
  Eyebrow,
  GOLD,
  GOLD_SOFT,
  INK,
  KIT_EASE,
  RetailerButtons,
  SectionHeading,
  SURFACE,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";
import { getBook, getBooksInLane } from "@/data/books";

const SAMPLE_AUDIO_SRC = "/permission/sample.mp3";
const COVER_SQUARE_SRC = "/covers/permission-square-1200.jpg";
const CANONICAL_URL = "https://reeseastor.com/permission";

const PERMISSION_GROUP_ID =
  (import.meta.env.VITE_MAILERLITE_PERMISSION_GROUP_ID as string | undefined) || undefined;

const audiobookSchema = {
  "@context": "https://schema.org",
  "@type": "Audiobook",
  "name": "The Need for Permission: On the Quiet Recovery of Self-Trust",
  "author": { "@type": "Person", "name": "Reese Astor" },
  "readBy": { "@type": "Person", "name": "Reese Astor" },
  "duration": "PT60M",
  "numberOfChapters": 10,
  "inLanguage": "en",
  "url": CANONICAL_URL,
  "image": `https://reeseastor.com${COVER_SQUARE_SRC}`,
  "publisher": { "@type": "Organization", "name": "Reese Astor" },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "4.99",
    "highPrice": "4.99",
    "priceCurrency": "USD",
    "offerCount": 1,
  },
};

export default function Permission() {
  const reduce = useReducedMotion();
  const book = getBook("the-need-for-permission")!;
  const otherInLane = getBooksInLane("intimate_psychological_narratives").filter(
    (b) => b.slug !== book.slug,
  );

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Embedded Stripe checkout for direct purchase ($4.99 audiobook). Keeps
  // the user on reeseastor.com rather than handing off to Gumroad.
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const permissionCheckout = trpc.stripe.createPermissionCheckout.useMutation();
  const fetchCheckoutSecret = useCallback(async () => {
    const result = await permissionCheckout.mutateAsync({});
    return result.clientSecret;
  }, [permissionCheckout]);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => setError(e.message || "Something went wrong. Please try again."),
  });

  useEffect(() => {
    document.title = "The Need for Permission · Reese Astor";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    subscribeMutation.mutate({
      email: email.trim(),
      // groupId tags the subscriber for the launch sequence. Falls back to
      // the default Reader's Club group if the env var isn't set.
      ...(PERMISSION_GROUP_ID ? { groupId: PERMISSION_GROUP_ID } : {}),
    } as Parameters<typeof subscribeMutation.mutate>[0]);
  };

  return (
    <div
      className="kit-grain min-h-screen font-cormorant"
      style={{ background: INK, color: TEXT }}
    >
      <EnhancedSEOHead
        title="The Need for Permission · Reese Astor"
        description="A ten-chapter audiobook on rebuilding self-trust, in your own voice and your own hours. By Reese Astor."
        canonical={CANONICAL_URL}
        ogType="book"
        ogImage={`https://reeseastor.com${COVER_SQUARE_SRC}`}
        keywords={[
          "Reese Astor",
          "The Need for Permission",
          "audiobook",
          "self-trust",
          "quiet recovery",
        ]}
        structuredData={[audiobookSchema]}
      />

      {/* ──────────────── Hero ──────────────── */}
      <section className="px-6 md:px-16 py-[120px] md:py-[160px]">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,440px)] gap-16 items-center">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: KIT_EASE as unknown as number[] }}
          >
            <Eyebrow>{book.position_label ?? "A New Line"}</Eyebrow>
            <h1
              className="font-display font-normal text-[48px] md:text-[68px] leading-[1.05] mt-5"
              style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
            >
              The Need for Permission
            </h1>
            <div className="mx-auto md:mx-0 my-7 h-px w-14" style={{ background: GOLD_SOFT }} />
            <p
              className="font-cormorant italic text-[22px] md:text-[24px] leading-[1.45] max-w-[560px]"
              style={{ color: TEXT_SOFT, textWrap: "pretty" }}
            >
              {book.tagline}
            </p>
            <p
              className="font-cormorant text-[18px] md:text-[19px] leading-[1.75] mt-7 max-w-[560px]"
              style={{ color: TEXT, textWrap: "pretty" }}
            >
              {book.blurb}
            </p>

            <div className="mt-10 max-w-[560px] space-y-4">
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                disabled={permissionCheckout.isPending}
                className="font-inter w-full inline-flex items-center justify-center gap-2 text-[12px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-wait"
                style={{
                  color: INK,
                  background: GOLD,
                  padding: "18px 28px",
                  letterSpacing: "0.22em",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                {permissionCheckout.isPending ? "Opening checkout…" : "Listen now · $4.99"}
              </button>
              <div
                className="font-cormorant italic text-center"
                style={{ color: TEXT_SOFT, fontSize: 14 }}
              >
                or choose another retailer
              </div>
              <RetailerButtons book={book} layout="grid" />
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end"
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: KIT_EASE as unknown as number[] }}
          >
            <CoverHalo
              src={book.cover_image_square ?? book.cover_image}
              alt="The Need for Permission — audiobook cover"
              width={400}
            />
          </motion.div>
        </div>
      </section>

      {/* ──────────────── Audio sample ──────────────── */}
      <section className="px-6 md:px-16 py-[80px]" style={{ background: SURFACE }}>
        <div className="max-w-[820px] mx-auto">
          <SectionHeading
            kicker="Listen first"
            title="A two-minute|opening"
            lead="Sample taken from Chapter 1. Recorded for headphones, late at night."
          />
          <AudioSamplePlayer
            src={SAMPLE_AUDIO_SRC}
            caption="Chapter 1 · Sample"
            durationLabel="2:00"
          />
        </div>
      </section>

      {/* ──────────────── Pull quote ──────────────── */}
      {book.pull_quote && (
        <section className="px-6 md:px-16 py-[120px]">
          <motion.blockquote
            className="max-w-[860px] mx-auto text-center font-display italic text-[28px] md:text-[36px] leading-[1.4] m-0"
            style={{ color: TEXT, textWrap: "balance" }}
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: KIT_EASE as unknown as number[] }}
          >
            {book.pull_quote}
          </motion.blockquote>
          <div
            className="font-inter text-center text-[11px] font-semibold uppercase mt-6"
            style={{ color: GOLD, letterSpacing: "0.32em" }}
          >
            From Chapter 9
          </div>
        </section>
      )}

      {/* ──────────────── Newsletter ──────────────── */}
      <section
        className="px-6 md:px-16 py-[120px]"
        style={{ background: SURFACE, borderTop: `1px solid ${GOLD_SOFT}` }}
      >
        <div className="max-w-[640px] mx-auto text-center">
          <Eyebrow align="center">Stay close</Eyebrow>
          <h2
            className="font-display font-normal text-[34px] md:text-[40px] leading-[1.1] mt-5"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            Quiet notes from the studio.
          </h2>
          <p
            className="font-cormorant italic text-[18px] mt-4"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            New chapters, release notices, and the occasional invitation to listen to something
            before anyone else does.
          </p>

          {submitted ? (
            <p
              className="font-cormorant italic text-[20px] mt-8"
              style={{ color: TEXT }}
            >
              You're on the list. Thank you.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-[460px] mx-auto"
            >
              <label htmlFor="permission-email" className="sr-only">
                Email address
              </label>
              <input
                id="permission-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={subscribeMutation.isPending}
                className="flex-1 px-4 py-3 font-inter text-[14px]"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  color: TEXT,
                  border: `1px solid ${GOLD_SOFT}`,
                  borderRadius: 4,
                }}
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="font-inter text-[12px] font-semibold uppercase whitespace-nowrap transition-all duration-200 hover:-translate-y-px"
                style={{
                  background: GOLD,
                  color: INK,
                  padding: "14px 26px",
                  letterSpacing: "0.22em",
                  borderRadius: 4,
                }}
              >
                {subscribeMutation.isPending ? "Joining…" : "Join the list"}
              </button>
            </form>
          )}

          {error && (
            <p
              className="font-inter text-[12px] mt-4"
              style={{ color: "#e08d8d" }}
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </section>

      {/* ──────────────── More by Reese Astor ──────────────── */}
      {/*
        Recovery readers who reach this section are deliberately shown the
        Intimate Psychological Narratives lane first. The romance lanes are
        reachable via the catalog, not surfaced here, to avoid jarring the
        recovery context. See spec Step 3 + the "10/10" criteria.
      */}
      <section className="px-6 md:px-16 py-[120px]">
        <div className="max-w-[860px] mx-auto text-center">
          <Eyebrow align="center">More by Reese Astor</Eyebrow>
          <h2
            className="font-display font-normal text-[28px] md:text-[34px] leading-[1.2] mt-5"
            style={{ color: TEXT, letterSpacing: "-0.01em" }}
          >
            {otherInLane.length === 0
              ? "More from this line is on the way."
              : `More from this line.`}
          </h2>
          <div className="mt-10">
            <Link href="/books">
              <a
                className="font-inter inline-flex items-center gap-2 text-[12px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
                style={{
                  color: INK,
                  background: GOLD,
                  padding: "16px 28px",
                  letterSpacing: "0.22em",
                  borderRadius: 4,
                }}
              >
                Visit the full bookshop
              </a>
            </Link>
          </div>
        </div>
      </section>

      <EmbeddedCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        fetchClientSecret={fetchCheckoutSecret}
        title="Order The Need for Permission"
      />
    </div>
  );
}
