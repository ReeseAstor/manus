import { breadcrumbSchema, romanceSeriesSchemas } from "@/data/structured-data";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import {
  CoverHalo,
  Eyebrow,
  GOLD,
  GOLD_SOFT,
  INK,
  KIT_EASE,
  Ornament,
  RetailerButtons,
  SURFACE,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";
import { BOOKS, getBooksInLane, LANE_META, type Book, type Lane } from "@/data/books";

const LANE_ORDER: Lane[] = ["manhattan_money_kings", "hudson_dynasty"];

export default function BooksCatalog() {

  return (
    <div
      className="kit-grain min-h-screen font-cormorant"
      style={{ background: INK, color: TEXT, overflowX: "clip" }}
    >
      <EnhancedSEOHead
        title="Reese Astor Books in Reading Order"
        description="Every Reese Astor book in reading order: the Hudson Dynasty and the Manhattan Money Kings. Steamy billionaire romance, each a standalone with a happy ending."
        canonical="/books"
        structuredData={[
          ...romanceSeriesSchemas(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Books", path: "/books" },
          ]),
        ]}
      />

      {/* Page eyebrow + heading */}
      <section className="px-6 md:px-16 pt-[120px] pb-[60px]">
        <div className="max-w-[1180px] mx-auto text-center">
          <Eyebrow align="center">The Catalog</Eyebrow>
          <h1
            className="font-display font-normal text-[44px] md:text-[64px] leading-[1.05] mt-5"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            Books by Reese Astor
          </h1>
          <p
            className="font-cormorant italic text-[20px] mt-6 max-w-[640px] mx-auto"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            Three lines, distinct in voice and tempo. Choose the room you want to be in tonight.
          </p>
          <p data-age-notice className="text-[15px] mt-4" style={{ color: TEXT_SOFT }}>
            For readers 18+.
          </p>
        </div>
      </section>

      {LANE_ORDER.map((lane, i) => (
        <LaneSection key={lane} lane={lane} dividerAbove={i > 0} />
      ))}
    </div>
  );
}

function LaneSection({ lane, dividerAbove }: { lane: Lane; dividerAbove: boolean }) {
  const meta = LANE_META[lane];
  const books = getBooksInLane(lane);
  if (books.length === 0) return null;

  // The Intimate Psychological Narratives lane uses a single hero card
  // instead of a rail/grid (one title, longer dwell time).
  const heroLayout = lane === "intimate_psychological_narratives";

  return (
    <section
      className="px-6 md:px-16 py-[120px]"
      style={{ background: lane === "hudson_dynasty" ? SURFACE : INK }}
    >
      {dividerAbove && (
        <div className="max-w-[1180px] mx-auto mb-20">
          <Ornament />
        </div>
      )}

      <div className="max-w-[1180px] mx-auto">
        <div className="text-center mb-16">
          <Eyebrow align="center">{meta.eyebrow}</Eyebrow>
          <h2
            className="font-display font-normal text-[36px] md:text-[48px] leading-[1.05] mt-5"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            {meta.title}
          </h2>
          <p
            className="font-cormorant italic text-[19px] mt-5 max-w-[680px] mx-auto"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            {meta.subtitle}
          </p>
        </div>

        {heroLayout ? (
          <HeroCard book={books[0]} />
        ) : (
          <CardGrid books={books} flagAudiobook={lane === "hudson_dynasty"} />
        )}
      </div>
    </section>
  );
}

function CardGrid({ books, flagAudiobook }: { books: Book[]; flagAudiobook?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div
      // Horizontal scroll-snap rail at narrow viewports, 3-up grid at wide.
      className="-mx-6 md:mx-0 px-6 md:px-0 flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none"
    >
      {books.map((book, i) => (
        <motion.article
          key={book.slug}
          className="snap-center flex-shrink-0 w-[78vw] md:w-auto flex flex-col"
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: KIT_EASE }}
        >
          <Link href={`/books/${book.slug}`}>
            <a className="block no-underline group" style={{ color: TEXT }}>
              <div className="flex justify-center mb-6">
                <CoverHalo
                  src={book.cover_image}
                  title={book.title}
                  alt={`Cover of ${book.title}`}
                  width={240}
                />
              </div>
              <div
                className="font-inter text-[10px] font-semibold uppercase mb-2"
                style={{ color: GOLD, letterSpacing: "0.32em" }}
              >
                {book.position_label}
              </div>
              <h3
                className="font-display font-normal text-[24px] leading-[1.2]"
                style={{ color: TEXT, letterSpacing: "-0.01em", textWrap: "balance" }}
              >
                {book.title}
              </h3>
              {flagAudiobook && book.audiobook_available && (
                <span
                  className="inline-block mt-3 font-inter text-[10px] font-semibold uppercase"
                  style={{
                    color: INK,
                    background: GOLD,
                    padding: "4px 12px",
                    letterSpacing: "0.24em",
                    borderRadius: 999,
                  }}
                >
                  Audiobook
                </span>
              )}
              <p
                className="font-cormorant italic text-[17px] leading-[1.5] mt-4"
                style={{ color: TEXT_SOFT, textWrap: "pretty" }}
              >
                {book.tagline}
              </p>
            </a>
          </Link>
          <div className="mt-5">
            <RetailerButtons book={book} layout="row" />
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function HeroCard({ book }: { book: Book }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-12 items-center max-w-[1100px] mx-auto"
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: KIT_EASE }}
    >
      <div className="flex justify-center lg:justify-start">
        <CoverHalo
          src={book.cover_image_square ?? book.cover_image}
          title={book.title}
          alt={`Cover of ${book.title}`}
          width={320}
        />
      </div>
      <div>
        <div
          className="font-inter text-[10px] font-semibold uppercase"
          style={{ color: GOLD, letterSpacing: "0.32em" }}
        >
          {book.position_label}
        </div>
        <h3
          className="font-display font-normal text-[34px] md:text-[42px] leading-[1.1] mt-3"
          style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
        >
          {book.title}
        </h3>
        <div className="my-6 h-px w-14" style={{ background: GOLD_SOFT }} />
        <p
          className="font-cormorant italic text-[20px] leading-[1.5]"
          style={{ color: TEXT, textWrap: "pretty" }}
        >
          {book.pull_quote ?? book.tagline}
        </p>
        <p
          className="font-cormorant text-[18px] leading-[1.7] mt-5"
          style={{ color: TEXT_SOFT, textWrap: "pretty" }}
        >
          {book.blurb}
        </p>
        <div className="mt-8">
          <Link href={`/books/${book.slug}`}>
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
              Listen now
            </a>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
