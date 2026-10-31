import { useEffect, useState } from "react";
import { personSchema, romanceSeriesSchemas, websiteSchema } from "@/data/structured-data";
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
const WINE = "#7A4F4C"; // rosewood
const IVORY = "#FAF7F7"; // pearl card
const CARD_INK = "#4A3B3A"; // cocoa
const CARD_BODY = "#4A3B3A"; // cocoa
const CARD_MUTED = "#6E5F5A"; // taupe
const BRONZE = "#7A4F4C"; // rosewood
const IVORY_RULE = "rgba(74,59,58,0.14)";

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
    offer: "Free with my newsletter",
    title: "The First Acquisition",
    description:
      "A darker corporate romance prequel with fake engagement tension, forensic scandal, boardroom warfare, a media firestorm, and a morally gray billionaire hero.",
    bestFor:
      "Best for readers who want corporate danger, forced proximity, fake engagement, legal tension, and a ruthless billionaire with secrets.",
    cta: "Get The First Acquisition",
    href: LINKS.firstAcquisition,
    cover: "/covers/hd-0-first-acquisition.jpg",
    coverAlt: "The First Acquisition — a Hudson Dynasty billionaire romance by Reese Astor",
    eager: true,
    accent: WINE,
    label: WINE,
  },
  {
    id: "one-night-stand",
    series: "Manhattan Money Kings",
    offer: "Free with my newsletter",
    title: "The Billionaire’s One Night Stand",
    description:
      "A high-heat billionaire romance novella about one dangerous night, professional ambition, betrayal, and a desire neither of them can control.",
    bestFor:
      "Best for readers who want workplace tension, billionaire heat, emotional betrayal, sharp banter, and a fast, steamy read.",
    cta: "Get One Night Stand",
    href: LINKS.oneNightStand,
    cover: "/covers/mmk-0-one-night-stand.jpg",
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
    books: ["The First Acquisition", "Hostile Tender", "Poison Pill", "Golden Parachute"],
    freeStarter: { title: "The First Acquisition", href: LINKS.firstAcquisition },
  },
];

const homeStructuredData = [websiteSchema(), personSchema(), ...romanceSeriesSchemas()];

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
   *  `tone="ivory"` is ink-on-ivory for the cards. Hover gives a lift + sheen + micro-interaction. */
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
        className={`font-inter group relative overflow-hidden hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
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
          color: INK, // pearl on cocoa / rosewood
          textWrap: "balance",
          transition: "all 280ms cubic-bezier(0.65,0.05,0.36,1)",
          outlineColor: ivory ? CARD_INK : GOLD,
        }}
      >
        <Gift
          className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
        <span>{children}</span>
      </a>
    );
  }

// Verified affiliate URLs (canonical source: client/src/pages/Books.tsx)
const MMK_AMAZON = {
  executiveAssistant: "https://swiy.co/b01",
  fakeWife: "https://www.amazon.com/dp/B0FCCBNF8X",
  babySecret: "https://swiy.co/3rd",
  forbiddenNanny: "https://swiy.co/4rd",
};
const FREE_BOOK_URL = "https://dl.bookfunnel.com/kw1yge3479";

export default function Home() {
  const reduce = useReducedMotion();
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    document.title = "Reese Astor | Steamy Billionaire Romance";
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
        title="Reese Astor | Steamy Billionaire Romance"
        description="Start with The First Acquisition or The Billionaire's One Night Stand, each free when you join my newsletter. Steamy billionaire romance by Reese Astor."
        canonical="/"
        keywords={[
          "billionaire romance prequel",
          "steamy billionaire romance",
          "Reese Astor",
          "Manhattan Money Kings",
          "Hudson Dynasty",
          "Reese Astor newsletter",
          "corporate romance",
          "morally gray billionaire",
        ]}
        structuredData={homeStructuredData}
      />

      {/* ───────────────── 1 + 2. HERO with the two free books above the fold ── */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${RAISED} 0%, ${INK} 55%),
                       radial-gradient(80% 60% at 85% 10%, rgba(201, 163, 160,0.28) 0%, transparent 60%)`,
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
              Start here · Free when you join my newsletter
            </div>
            <h1
              id="hero-heading"
              className="font-display font-normal text-[34px] leading-[1.05] mt-5 sm:text-[52px] lg:text-[60px]"
              style={{ color: TEXT, letterSpacing: "-0.022em", textWrap: "balance" }}
            >
              Choose Your First Steamy <em className="font-normal italic">Billionaire Romance</em>
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
                    className="group flex w-full flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{
                      background: IVORY,
                      border: `1px solid ${IVORY_RULE}`,
                      boxShadow: "0 30px 70px -30px rgba(74, 59, 58,0.75)",
                      transition: "transform 300ms cubic-bezier(0.65,0.05,0.36,1), box-shadow 300ms",
                    }}
                  >
                    {/* animated accent rule distinguishes the series */}
                    <div
                      className="h-1 origin-left scale-x-95 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ background: book.accent }}
                      aria-hidden="true"
                    />

                    {/* Cover display shelf — dark stage so the cover art pops. */}
                    <div
                      className="relative flex items-center justify-center px-6 pt-8 pb-7"
                      style={{ background: `linear-gradient(165deg, ${RAISED} 0%, ${INK} 100%)` }}
                    >
                      <span
                        className="font-inter absolute right-4 top-4 text-[10px] font-bold uppercase"
                        style={{
                          color: INK,
                          background: book.accent === GOLD ? GOLD : CARD_INK,
                          letterSpacing: "0.16em",
                          padding: "5px 11px",
                          borderRadius: 0,
                          whiteSpace: "nowrap",
                          boxShadow: "0 6px 16px rgba(74, 59, 58,0.4)",
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
                        className="block h-auto w-auto max-h-[260px] select-none transition-transform duration-700 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-[1.04] group-hover:-translate-y-1"
                        draggable={false}
                        style={{
                          boxShadow: "0 22px 48px -16px rgba(74, 59, 58,0.85)",
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
                          Free when you join my newsletter · Delivered by BookFunnel
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

      {/* ── 3. SERIES ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="series-heading"
        className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
        style={{
          background: SURFACE,
          borderTop: `1px solid ${RULE_SOFT}`,
        }}
      >
        {/* ambient gold/wine glow orbs for depth */}
        <div
          className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full blur-[140px] opacity-20"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 bottom-1/4 h-[360px] w-[360px] rounded-full blur-[140px] opacity-15"
          style={{ background: `radial-gradient(circle, ${WINE} 0%, transparent 70%)` }}
          aria-hidden="true"
        />
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

          <div
            className="relative mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl md:grid-cols-2"
            style={{ border: `1px solid ${RULE}`, background: RULE }}
          >
            {/* subtle glass highlight overlay for the grid */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%, transparent 55%, rgba(201, 163, 160,0.04) 100%)",
              }}
              aria-hidden="true"
            />
              {SERIES.map((series, i) => (
                <Reveal key={series.name} delay={i * 0.08} style={{ background: SURFACE }}>
                  <div
                    className="group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-[#EBD6D3]/0 sm:p-10"
                    style={{ background: SURFACE }}
                  >
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
                          <span className="font-cormorant text-[18px] leading-[1.4] transition-colors duration-300 group-hover:text-[#4A3B3A]">
                            {bookTitle}
                            {isFree && (
                                <a
                                  href={series.freeStarter.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-inter ml-2 inline-flex items-center gap-1 align-middle text-[10px] font-bold uppercase no-underline transition-transform duration-300 hover:scale-105"
                                  style={{
                                    color: INK,
                                    background: GOLD,
                                    letterSpacing: "0.12em",
                                    padding: "2px 8px",
                                    borderRadius: 0,
                                  }}
                                >
                                Free with newsletter <ArrowRight className="h-3 w-3" aria-hidden="true" />
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

      {/* ── 4. ABOUT ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="about-heading"
        className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
        style={{ background: INK }}
      >
        {/* warm ink glow behind the text */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] opacity-10"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
          aria-hidden="true"
        />
        <div className="relative">
          <Reveal className="relative mx-auto max-w-[760px] text-center">
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
        </div>
      </section>

      {/* ── 5. FINAL CTA ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
        style={{
          background: `radial-gradient(110% 90% at 50% 0%, ${RAISED} 0%, ${INK} 60%)`,
          borderTop: `1px solid ${RULE_SOFT}`,
        }}
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full blur-[120px] opacity-12"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
          aria-hidden="true"
        />
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2
            id="final-cta-heading"
            className="font-display font-normal text-[32px] leading-[1.1] sm:text-[44px]"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            Start Reading Reese Astor
          </h2>
          <p
            className="font-cormorant italic text-[19px] leading-[1.55] mt-5 sm:text-[22px]"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            Choose your first world: Manhattan money, Hudson power, or both.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <FreeBookButton href={LINKS.firstAcquisition} tone="dark">
              Get The First Acquisition
            </FreeBookButton>
            <FreeBookButton href={LINKS.oneNightStand} tone="dark">
              Get One Night Stand
            </FreeBookButton>
          </div>
          <p
            className="font-inter text-[11px] uppercase mt-6"
            style={{ color: TEXT_SOFT, letterSpacing: "0.2em" }}
          >
            Both free when you join my newsletter · Delivered by BookFunnel
          </p>
        </Reveal>
      </section>

      {/* ───────────────── Sticky mobile CTA (tasteful, repeated) ─────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 md:hidden"
        style={{
          background: "linear-gradient(180deg, rgba(74, 59, 58,0) 0%, rgba(74, 59, 58,0.92) 38%)",
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
          className="font-inter group flex items-center justify-center gap-2"
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
            boxShadow: "0 12px 30px rgba(74, 59, 58,0.5)",
            transition: "all 280ms cubic-bezier(0.65,0.05,0.36,1)",
          }}
        >
          <Gift
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
          Choose your first book
        </a>
      </div>
    </div>
  );
}
