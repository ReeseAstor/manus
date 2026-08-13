import { useEffect, useState } from "react";
import { motion, useReducedMotion, cubicBezier } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import {
  Ornament,
  GOLD,
  GOLD_SOFT,
  INK,
  RAISED,
  RULE,
  RULE_SOFT,
  SURFACE,
  TEXT,
  TEXT_SOFT,
  KIT_EASE,
} from "@/components/author-kit";

// Typed easing (cubicBezier returns a framer-motion EasingFunction, so it
// satisfies Transition["ease"] without the codebase's number[] cast workaround).
const EASE = cubicBezier(KIT_EASE[0], KIT_EASE[1], KIT_EASE[2], KIT_EASE[3]);

// ─────────────────────────────────────────────────────────────────────────
// EDITABLE CONFIG — update funnel links and author URLs in one place.
// BookFunnel lead magnets are the primary conversion path on this page.
// ─────────────────────────────────────────────────────────────────────────
const LINKS = {
  firstAcquisition: "https://dl.bookfunnel.com/kw1yge3479",
  oneNightStand: "https://dl.bookfunnel.com/xrodg0t77p",
  amazonAuthor: "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
};

// Local accent tokens that extend the author-kit palette for this page:
// deep-wine accent + ivory card surfaces, per the brand mood.
const WINE = "#6E1F2E";
const IVORY = "#F4EEE3";
const CARD_INK = "#14110A"; // headline text on ivory
const CARD_BODY = "#43392B"; // body text on ivory
const CARD_MUTED = "#6A6052"; // supporting text on ivory
const BRONZE = "#7A5E10"; // deep antique-gold; AA-legible on ivory (~5.4:1)
const IVORY_RULE = "rgba(20,17,10,0.12)";

type LeadMagnet = {
  id: string;
  series: string;
  offer: string;
  title: string;
  description: string;
  bestFor: string;
  cta: string;
  href: string;
  cover: string;
  coverAlt: string;
  /** Prioritise the first (above-the-fold) cover for LCP. */
  eager?: boolean;
  /** Accent colour that distinguishes this card's series within the brand system. */
  accent: string;
  /** Legible-on-ivory label colour for the series eyebrow. */
  label: string;
};

const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: "first-acquisition",
    series: "Hudson Dynasty",
    offer: "Free Book",
    title: "The First Acquisition",
    description:
      "A darker corporate romance prequel with fake engagement tension, forensic scandal, boardroom warfare, personal threats, and a morally gray billionaire hero.",
    bestFor:
      "Best for readers who want corporate danger, forced proximity, fake engagement, legal tension, and a ruthless billionaire with secrets.",
    cta: "Get The First Acquisition Free",
    href: LINKS.firstAcquisition,
    cover:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/uMHRMKanHXREGUzc.jpeg",
    coverAlt: "The First Acquisition — a Hudson Dynasty billionaire romance by Reese Astor",
    eager: true,
    accent: WINE,
    label: WINE,
  },
  {
    id: "one-night-stand",
    series: "Manhattan Money Kings",
    offer: "Free Starter Novella",
    title: "The Billionaire’s One Night Stand",
    description:
      "A high-heat billionaire romance novella about one dangerous night, professional ambition, betrayal, and a desire neither of them can control.",
    bestFor:
      "Best for readers who want workplace tension, billionaire heat, emotional betrayal, sharp banter, and a fast, steamy read.",
    cta: "Get One Night Stand Free",
    href: LINKS.oneNightStand,
    cover: "https://m.media-amazon.com/images/I/815-iFRAlpL._SL1500_.jpg",
    coverAlt:
      "The Billionaire’s One Night Stand — a Manhattan Money Kings billionaire romance by Reese Astor",
    accent: GOLD,
    label: BRONZE,
  },
];

type Series = {
  name: string;
  copy: string;
  books: string[];
  /** Title of the free starter in this series + its funnel link. */
  freeStarter: { title: string; href: string };
};

const SERIES: Series[] = [
  {
    name: "Manhattan Money Kings",
    copy: "For readers who want billionaire bosses, fake wives, secret babies, forbidden nannies, workplace heat, pregnancy romance, emotional betrayal, and addictive series read-through.",
    books: [
      "The Billionaire’s One Night Stand",
      "The Billionaire’s Executive Assistant",
      "The Billionaire’s Fake Wife: Pregnant and Protected",
      "The Billionaire’s Baby Secret: Hidden and His",
      "The Billionaire’s Forbidden Nanny: Forbidden and Forever",
    ],
    freeStarter: { title: "The Billionaire’s One Night Stand", href: LINKS.oneNightStand },
  },
  {
    name: "Hudson Dynasty",
    copy: "For readers who want hostile takeovers, legal warfare, corporate betrayal, ruthless ambition, fake engagements, forensic scandal, and morally gray billionaires.",
    books: ["The First Acquisition", "Hostile Tender", "Poison Pill"],
    freeStarter: { title: "The First Acquisition", href: LINKS.firstAcquisition },
  },
];

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Reese Astor",
  url: "https://reeseastor.com",
  description:
    "Steamy billionaire romance by Reese Astor. Start with two free books — The First Acquisition (Hudson Dynasty) and The Billionaire's One Night Stand (Manhattan Money Kings).",
  author: {
    "@type": "Person",
    name: "Reese Astor",
    url: "https://reeseastor.com/about",
    jobTitle: "Romance Author",
    sameAs: [LINKS.amazonAuthor, "https://www.instagram.com/reeseastor"],
  },
};

// ── Small shared primitives ──────────────────────────────────────────────

/** Scroll-into-view fade-up that respects reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Primary free-book CTA. `tone="dark"` is gold-on-ink for dark sections;
 *  `tone="ivory"` is ink-on-ivory for the cards. Hover gives a small lift +
 *  sheen (real Tailwind hover utilities, not inert inline styles). */
function FreeBookButton({
  href,
  children,
  tone,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone: "dark" | "ivory";
  className?: string;
}) {
  const ivory = tone === "ivory";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-inter hover:-translate-y-px hover:brightness-110 ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 56,
        padding: "16px 26px",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        textDecoration: "none",
        border: ivory ? `1px solid ${CARD_INK}` : `1px solid ${GOLD}`,
        background: ivory ? CARD_INK : GOLD,
        color: ivory ? GOLD : INK,
        textWrap: "balance",
        transition: "all 240ms cubic-bezier(0.65,0.05,0.36,1)",
      }}
    >
      <Gift className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

// Verified affiliate URLs (canonical source: client/src/pages/Books.tsx)
const MMK_AMAZON = {
  executiveAssistant: "https://swiy.co/b01",
  fakeWife: "https://swiy.co/2rd",
  babySecret: "https://swiy.co/3rd",
  forbiddenNanny: "https://swiy.co/4rd",
};
const FREE_BOOK_URL = "https://swiy.co/05";

export default function Home() {
  const reduce = useReducedMotion();
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    document.title = "Reese Astor | Free Steamy Billionaire Romance";
  }, []);

  // Reveal the mobile sticky CTA once the hero cards have scrolled away.
  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="kit-grain min-h-screen font-cormorant"
      style={{ background: INK, color: TEXT }}
    >
      <EnhancedSEOHead
        title="Reese Astor | Free Steamy Billionaire Romance"
        description="Get two free steamy billionaire romances from Reese Astor: The First Acquisition (Hudson Dynasty) and The Billionaire's One Night Stand. Boardroom betrayal, forbidden attraction, high heat."
        canonical="/"
        keywords={[
          "free billionaire romance",
          "steamy billionaire romance",
          "Reese Astor",
          "Manhattan Money Kings",
          "Hudson Dynasty",
          "free romance book",
          "corporate romance",
          "morally gray billionaire",
        ]}
        structuredData={[homeStructuredData]}
      />

      {/* ───────────────── 1 + 2. HERO with the two free books above the fold ── */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${RAISED} 0%, ${INK} 55%),
                       radial-gradient(80% 60% at 85% 10%, rgba(110,31,46,0.28) 0%, transparent 60%)`,
        }}
      >
        {/* thin gold edge rules — luxury framing on larger screens */}
        <div
          className="pointer-events-none absolute inset-y-0 left-6 hidden w-px lg:block"
          style={{ background: `linear-gradient(180deg, transparent, ${RULE} 25%, ${RULE} 75%, transparent)` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-6 hidden w-px lg:block"
          style={{ background: `linear-gradient(180deg, transparent, ${RULE} 25%, ${RULE} 75%, transparent)` }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1180px]">
          <Reveal className="mx-auto max-w-[840px] text-center">
            <div
              className="font-inter text-[11px] font-semibold uppercase"
              style={{ color: GOLD, letterSpacing: "0.34em" }}
            >
              Start here · Two free books
            </div>
            <h1
              id="hero-heading"
              className="font-display font-normal text-[34px] leading-[1.05] mt-5 sm:text-[52px] lg:text-[60px]"
              style={{ color: TEXT, letterSpacing: "-0.022em", textWrap: "balance" }}
            >
              Choose Your Free Steamy <em className="font-normal italic">Billionaire Romance</em>
            </h1>
            <p
              className="font-cormorant mx-auto mt-6 max-w-[640px] text-[19px] leading-[1.55] sm:text-[22px]"
              style={{ color: TEXT_SOFT, textWrap: "pretty" }}
            >
              Enter the Reese Astor world of ruthless billionaires, ambitious women, dangerous
              attraction, boardroom betrayal, and love that never stays simple.
            </p>
            <p
              className="font-inter mx-auto mt-5 max-w-[560px] text-[12px] leading-[1.7]"
              style={{ color: TEXT_SOFT, letterSpacing: "0.02em" }}
            >
              For adult romance readers 18+. You&rsquo;ll also receive new release alerts, bonus
              scenes, and Reese Astor reader updates.
            </p>
            <div className="mt-9 flex justify-center">
              <Ornament width={110} />
            </div>
          </Reveal>

          {/* Lead-magnet cards — shown immediately, not buried below the fold. */}
          <ul
            id="free-books"
            className="mx-auto mt-10 grid max-w-[940px] scroll-mt-24 list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-7 sm:mt-12"
          >
            {LEAD_MAGNETS.map((book, i) => (
              <li key={book.id} className="flex">
                <Reveal delay={i * 0.08} className="flex w-full">
                  <article
                    className="flex w-full flex-col overflow-hidden hover:-translate-y-1"
                    style={{
                      background: IVORY,
                      border: `1px solid ${IVORY_RULE}`,
                      boxShadow: "0 30px 70px -30px rgba(0,0,0,0.75)",
                      transition: "transform 280ms cubic-bezier(0.65,0.05,0.36,1), box-shadow 280ms",
                    }}
                  >
                    {/* accent rule distinguishes the series */}
                    <div style={{ height: 4, background: book.accent }} aria-hidden="true" />

                    {/* Cover display shelf — dark stage so the cover art pops. */}
                    <div
                      className="relative flex items-center justify-center px-6 pt-8 pb-7"
                      style={{ background: `linear-gradient(165deg, ${RAISED} 0%, ${INK} 100%)` }}
                    >
                      <span
                        className="font-inter absolute right-4 top-4 text-[10px] font-bold uppercase"
                        style={{
                          color: book.accent === GOLD ? CARD_INK : "#FFFFFF",
                          background: book.accent === GOLD ? GOLD : WINE,
                          letterSpacing: "0.16em",
                          padding: "5px 11px",
                          borderRadius: 999,
                          whiteSpace: "nowrap",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                        }}
                      >
                        {book.offer}
                      </span>
                      <img
                        src={book.cover}
                        alt={book.coverAlt}
                        loading={book.eager ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={book.eager ? "high" : "auto"}
                        className="block h-auto w-auto max-h-[260px] select-none"
                        draggable={false}
                        style={{
                          boxShadow: "0 22px 48px -16px rgba(0,0,0,0.85)",
                          border: `1px solid ${RULE}`,
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-7 sm:p-8">
                      <span
                        className="font-inter text-[11px] font-semibold uppercase"
                        style={{ color: book.label, letterSpacing: "0.24em" }}
                      >
                        {book.series}
                      </span>

                      <h2
                        className="font-display font-normal text-[27px] leading-[1.15] mt-4 sm:text-[30px]"
                        style={{ color: CARD_INK, letterSpacing: "-0.01em", textWrap: "balance" }}
                      >
                        {book.title}
                      </h2>

                      <p
                        className="font-cormorant text-[17px] leading-[1.55] mt-3"
                        style={{ color: CARD_BODY, textWrap: "pretty" }}
                      >
                        {book.description}
                      </p>

                      <p
                        className="font-cormorant italic text-[15px] leading-[1.5] mt-5 pl-4"
                        style={{ color: CARD_MUTED, borderLeft: `2px solid ${book.accent}` }}
                      >
                        {book.bestFor}
                      </p>

                      <div className="mt-7 pt-1">
                        <FreeBookButton href={book.href} tone="ivory" className="w-full">
                          {book.cta}
                        </FreeBookButton>
                        <p
                          className="font-inter text-[10px] uppercase mt-3 text-center"
                          style={{ color: CARD_MUTED, letterSpacing: "0.14em" }}
                        >
                          Free instant download · Delivered by BookFunnel
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────── 3. SERIES ──────────────────────────────────────── */}
      <section
        aria-labelledby="series-heading"
        className="px-5 py-20 sm:px-8 sm:py-28"
        style={{ background: SURFACE, borderTop: `1px solid ${RULE_SOFT}` }}
      >
        <div className="mx-auto max-w-[1080px]">
          <Reveal className="mx-auto max-w-[680px] text-center">
            <div
              className="font-inter text-[11px] font-semibold uppercase"
              style={{ color: GOLD, letterSpacing: "0.34em" }}
            >
              The Worlds
            </div>
            <h2
              id="series-heading"
              className="font-display font-normal text-[34px] leading-[1.08] mt-5 sm:text-[46px]"
              style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
            >
              Read the Reese Astor Worlds
            </h2>
            <div className="mt-7 flex justify-center">
              <Ornament width={120} />
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden md:grid-cols-2"
            style={{ border: `1px solid ${RULE}`, background: RULE }}>
            {SERIES.map((series, i) => (
              <Reveal key={series.name} delay={i * 0.08} style={{ background: SURFACE }}>
                <div className="flex h-full flex-col p-7 sm:p-10" style={{ background: SURFACE }}>
                  <h3
                    className="font-display font-normal text-[24px] leading-[1.15] sm:text-[28px]"
                    style={{ color: TEXT, letterSpacing: "-0.01em" }}
                  >
                    {series.name}
                  </h3>
                  <p
                    className="font-cormorant italic text-[17px] leading-[1.55] mt-4"
                    style={{ color: TEXT_SOFT, textWrap: "pretty" }}
                  >
                    {series.copy}
                  </p>
                  <ul className="mt-7 flex list-none flex-col gap-3 p-0">
                    {series.books.map((bookTitle) => {
                      const isFree = bookTitle === series.freeStarter.title;
                      return (
                        <li
                          key={bookTitle}
                          className="flex items-start gap-3"
                          style={{ color: TEXT }}
                        >
                          <span
                            className="mt-[10px] block h-[5px] w-[5px] shrink-0 rotate-45"
                            style={{ background: GOLD }}
                            aria-hidden="true"
                          />
                          <span className="font-cormorant text-[18px] leading-[1.4]">
                            {bookTitle}
                            {isFree && (
                              <a
                                href={series.freeStarter.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-inter ml-2 inline-flex items-center gap-1 align-middle text-[10px] font-bold uppercase no-underline"
                                style={{
                                  color: INK,
                                  background: GOLD,
                                  letterSpacing: "0.12em",
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                }}
                              >
                                Free <ArrowRight className="h-3 w-3" aria-hidden="true" />
                              </a>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── 4. ABOUT ───────────────────────────────────────── */}
      <section
        aria-labelledby="about-heading"
        className="px-5 py-20 sm:px-8 sm:py-28"
        style={{ background: INK }}
      >
        <Reveal className="mx-auto max-w-[760px] text-center">
          <div
            className="font-inter text-[11px] font-semibold uppercase"
            style={{ color: GOLD, letterSpacing: "0.34em" }}
          >
            About the Author
          </div>
          <h2
            id="about-heading"
            className="font-display font-normal text-[34px] leading-[1.1] mt-5 sm:text-[44px]"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            Meet Reese Astor
          </h2>
          <div className="mx-auto my-8 h-px w-14" style={{ background: GOLD_SOFT }} />
          <p
            className="font-cormorant text-[19px] leading-[1.75] sm:text-[21px]"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            Reese Astor writes high-heat billionaire romance, corporate power games, forbidden
            attraction, and ambitious characters who do not fall in love quietly. Her stories are
            built for readers who like desire with consequences, wealth with teeth, and
            happily-ever-afters that have to be fought for.
          </p>
        </Reveal>
      </section>

      {/* ───────────────── 5. FINAL CTA ───────────────────────────────────── */}
      <section
        aria-labelledby="final-cta-heading"
        className="px-5 py-20 sm:px-8 sm:py-28"
        style={{
          background: `radial-gradient(110% 90% at 50% 0%, ${RAISED} 0%, ${INK} 60%)`,
          borderTop: `1px solid ${RULE_SOFT}`,
        }}
      >
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2
            id="final-cta-heading"
            className="font-display font-normal text-[32px] leading-[1.1] sm:text-[44px]"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            Start Reading Reese Astor Free
          </h2>
          <p
            className="font-cormorant italic text-[19px] leading-[1.55] mt-5 sm:text-[22px]"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            Choose your first world: Manhattan money, Hudson power, or both.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <FreeBookButton href={LINKS.firstAcquisition} tone="dark">
              Get The First Acquisition Free
            </FreeBookButton>
            <FreeBookButton href={LINKS.oneNightStand} tone="dark">
              Get One Night Stand Free
            </FreeBookButton>
          </div>
          <p
            className="font-inter text-[11px] uppercase mt-6"
            style={{ color: TEXT_SOFT, letterSpacing: "0.2em" }}
          >
            Free instant downloads · Delivered by BookFunnel
          </p>
        </Reveal>
      </section>

      {/* ───────────────── Sticky mobile CTA (tasteful, repeated) ─────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 md:hidden"
        style={{
          background: "linear-gradient(180deg, rgba(7,13,28,0) 0%, rgba(7,13,28,0.92) 38%)",
          transform: showStickyCta ? "translateY(0)" : "translateY(120%)",
          opacity: showStickyCta ? 1 : 0,
          // visibility:hidden removes the off-screen link from the tab order;
          // delayed on hide so the slide-out still animates.
          visibility: showStickyCta ? "visible" : "hidden",
          transition: reduce
            ? "none"
            : `transform 320ms cubic-bezier(0.65,0.05,0.36,1), opacity 320ms, visibility 0s linear ${showStickyCta ? "0s" : "320ms"}`,
          pointerEvents: showStickyCta ? "auto" : "none",
        }}
        aria-hidden={!showStickyCta}
      >
        <a
          href="#free-books"
          className="font-inter flex items-center justify-center gap-2"
          style={{
            minHeight: 54,
            background: GOLD,
            color: INK,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: `1px solid ${GOLD}`,
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
          }}
        >
          <Gift className="h-[18px] w-[18px]" aria-hidden="true" />
          Choose your free book
        </a>
      </div>
    </div>
  );
}
