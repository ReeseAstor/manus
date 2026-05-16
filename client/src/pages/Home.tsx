import { useEffect } from "react";
import { Link } from "wouter";
import { Gift, BookOpen } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { trpc } from "@/lib/trpc";
import {
  AuthorIntro,
  BookCard,
  BookHero,
  NewsletterBand,
  SectionHeading,
  GOLD,
  GOLD_SOFT,
  INK,
  KIT_EASE,
  SURFACE,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Reese Astor",
  url: "https://reeseastor.com",
  description:
    "Official website of Reese Astor, USA Today Bestselling romance author of the Manhattan Money Kings series and Hudson Dynasty.",
  author: {
    "@type": "Person",
    name: "Reese Astor",
    url: "https://reeseastor.com/about",
    jobTitle: "Romance Author & Writing Coach",
    sameAs: [
      "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
      "https://www.instagram.com/reeseastor",
    ],
  },
};

// Verified affiliate URLs (canonical source: client/src/pages/Books.tsx)
const MMK_AMAZON = {
  executiveAssistant: "https://swiy.co/b01",
  fakeWife: "https://swiy.co/2rd",
  babySecret: "https://swiy.co/3rd",
  forbiddenNanny: "https://swiy.co/4rd",
};
const FREE_BOOK_URL = "https://BookHip.com/JHRBVXT";

export default function Home() {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = "Reese Astor | USA Today Bestselling Romance Author";
  }, []);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();
  const handleSubscribe = async (email: string) => {
    await subscribeMutation.mutateAsync({ email: email.trim() });
  };

  return (
    <div className="kit-grain min-h-screen font-cormorant" style={{ background: INK, color: TEXT }}>
      <EnhancedSEOHead
        title="Reese Astor | USA Today Bestselling Romance Author"
        description="Discover Hudson Dynasty and the Manhattan Money Kings series by USA Today Bestselling author Reese Astor. Steamy billionaire romances set in Manhattan."
        canonical="/"
        keywords={[
          "Reese Astor",
          "romance author",
          "billionaire romance",
          "Manhattan Money Kings",
          "Hudson Dynasty",
          "Hostile Tender",
          "USA Today bestselling author",
          "free romance book",
        ]}
        structuredData={[homeStructuredData]}
      />

      {/* Hero — Hostile Tender (Hudson Dynasty Book 2). Copy verbatim from HostileTender.tsx schema. */}
      <BookHero
        kicker="Hudson Dynasty · Book 2 · New Release"
        title="Hostile|Tender"
        byline="A Hudson Dynasty Novel · Reese Astor"
        tagline={"She’s the federal auditor sent to dismantle his empire. He’s Manhattan’s most dangerous billionaire fighting to save it."}
        blurb="When the RIVIERA Ledger exposes three generations of Hudson secrets, SDNY forensic auditor Nia Carter and CEO Sebastian Hudson are forced into dangerous proximity. The hostile takeover escalates. Secrets surface from the family archives. The line between investigation and intimacy dissolves — and trusting each other could cost them everything."
        cover="https://m.media-amazon.com/images/I/81iGQzEnacL._SL1500_.jpg"
        primaryCta="See the full pitch"
        primaryHref="/books/hostile-tender"
        secondaryCta="Browse the series"
        secondaryHref="/books"
      />

      {/* Manhattan Money Kings — official descriptions verbatim from Books.tsx */}
      <section className="px-16 py-[160px]" style={{ background: SURFACE }}>
        <div className="max-w-[1240px] mx-auto">
          <SectionHeading
            kicker="The Series"
            title="Manhattan|Money Kings"
            lead="Four interlinked novels of dynastic obsession, set inside the boardrooms, penthouses, and private clubs of New York's most powerful family."
          />
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ columnGap: 56, rowGap: 88 }}
          >
            <BookCard
              index="I"
              kicker="Available"
              title="The Billionaire's Executive Assistant"
              blurb="Sarah Shah needs this job to pay her mother's mounting medical bills. Michael Hastings needs a competent assistant to save his billion-dollar Redwood project. Neither can afford distractions or workplace scandal."
              cover="/author-kit/mmk-1-executive-assistant.jpg"
              href="/books/the-billionaire-s-executive-assistant"
              buyHref={MMK_AMAZON.executiveAssistant}
              price="$3.99"
              delay={0}
            />
            <BookCard
              index="II"
              kicker="Available"
              title="The Billionaire's Fake Wife"
              blurb="When thief Elena Kim breaks into his penthouse, billionaire David Kim catches her red-handed. But instead of calling the police, he makes her an offer she can't refuse."
              cover="/author-kit/mmk-2-fake-wife.jpg"
              href="/books/the-billionaire-s-fake-wife"
              buyHref={MMK_AMAZON.fakeWife}
              price="$3.99"
              delay={0.08}
            />
            <BookCard
              index="III"
              kicker="Available"
              title="The Billionaire's Baby Secret"
              blurb="One night. One secret. One second chance he refuses to lose. When Dominic Kane reclaims his empire, he discovers the daughter Sophia Reed kept hidden."
              cover="/author-kit/mmk-3-baby-secret.jpg"
              href="/books/the-billionaire-s-baby-secret"
              buyHref={MMK_AMAZON.babySecret}
              price="$3.99"
              delay={0.16}
            />
            <BookCard
              index="IV"
              kicker="Final Book"
              title="The Billionaire's Forbidden Nanny"
              blurb="She's the nanny. He's her boss. His mother wants her gone. When Camille Torres takes a job caring for billionaire Ethan Calloway's silent daughter, she never expected to become the family they both desperately need."
              cover="/author-kit/mmk-4-forbidden-nanny.jpg"
              href="/books/the-billionaires-forbidden-nanny"
              buyHref={MMK_AMAZON.forbiddenNanny}
              price="$3.99"
              delay={0}
            />
          </div>

          {/* Series + Amazon overflow CTA */}
          <div className="mt-24 flex flex-wrap items-center justify-center gap-8 text-center">
            <Link href="/books">
              <a
                className="font-inter inline-flex items-center gap-2 text-[11px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
                style={{
                  color: INK,
                  background: GOLD,
                  padding: "16px 34px",
                  letterSpacing: "0.24em",
                }}
              >
                <BookOpen className="w-4 h-4" />
                Browse the bookshop
              </a>
            </Link>
            <a
              href="https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-[11px] font-semibold uppercase no-underline"
              style={{
                color: GOLD,
                letterSpacing: "0.28em",
                borderBottom: `1px solid ${GOLD_SOFT}`,
                paddingBottom: 3,
              }}
            >
              See every title on Amazon →
            </a>
          </div>
        </div>
      </section>

      {/* Free prequel inline lead-magnet — points at the real BookHip funnel */}
      <section
        className="px-6 py-24"
        style={{ background: INK, borderTop: `1px solid ${GOLD_SOFT}`, borderBottom: `1px solid ${GOLD_SOFT}` }}
      >
        <motion.div
          className="max-w-[920px] mx-auto text-center"
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: KIT_EASE as unknown as number[] }}
        >
          <div
            className="font-inter text-[11px] font-semibold uppercase"
            style={{ color: GOLD, letterSpacing: "0.34em" }}
          >
            Free for new readers
          </div>
          <h2
            className="font-display text-[40px] md:text-[48px] leading-[1.05] mt-5"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            The First Acquisition <em className="font-normal">— on the house.</em>
          </h2>
          <p
            className="font-cormorant italic mt-6 text-[19px] mx-auto max-w-[560px]"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            A full-length Manhattan billionaire romance. Yours instantly when you join the Inner Circle.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <a
              href={FREE_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter inline-flex items-center gap-2 text-[12px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
              style={{
                color: INK,
                background: GOLD,
                padding: "16px 34px",
                letterSpacing: "0.24em",
              }}
            >
              <Gift className="w-4 h-4" />
              Get my free book
            </a>
            <Link href="/free-book">
              <a
                className="font-inter text-[11px] font-semibold uppercase no-underline"
                style={{
                  color: GOLD,
                  letterSpacing: "0.28em",
                  borderBottom: `1px solid ${GOLD_SOFT}`,
                  paddingBottom: 3,
                }}
              >
                Learn more →
              </a>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About — Reese's own quote + bio, verbatim from About.tsx */}
      <AuthorIntro />

      <NewsletterBand onSubscribe={handleSubscribe} freeBookHref="/free-book" />
    </div>
  );
}
