import { Link, useParams } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { toAbsoluteUrl } from "@/lib/seo-url";
import { trpc } from "@/lib/trpc";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import {
  CoverHalo,
  Eyebrow,
  GOLD,
  GOLD_SOFT,
  INK,
  KIT_EASE,
  NewsletterBand,
  Ornament,
  RetailerButtons,
  SURFACE,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";
import {
  getBook,
  getOtherBooksInLane,
  LANE_META,
  type Book,
} from "@/data/books";
import { bookSchema, breadcrumbSchema } from "@/data/structured-data";

export default function BookTitle() {
  const { slug } = useParams<{ slug: string }>();
  const book = slug ? getBook(slug) : undefined;

  if (!book) return <NotInCatalog slug={slug ?? ""} />;
  return <BookLayout book={book} />;
}

function BookLayout({ book }: { book: Book }) {
  const reduce = useReducedMotion();
  const lane = LANE_META[book.lane];
  const others = getOtherBooksInLane(book.slug);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();
  const handleSubscribe = async (email: string) => {
    await subscribeMutation.mutateAsync({ email: email.trim() });
  };

  const structured = [
    bookSchema(book),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Books", path: "/books" },
      { name: book.title, path: `/books/${book.slug}` },
    ]),
  ];

  return (
    <div
      className="kit-grain min-h-screen font-cormorant"
      style={{ background: INK, color: TEXT, overflowX: "clip" }}
    >
      <EnhancedSEOHead
        title={`${book.title} by Reese Astor`}
        description={`${book.tagline} ${book.blurb}`}
        canonical={`/books/${book.slug}`}
        ogType="book"
        ogImage={book.cover_image_square ?? book.cover_image ?? undefined}
        structuredData={structured}
      />

      {/* ──────────────── Hero ──────────────── */}
      <section className="px-6 md:px-16 py-[120px] md:py-[160px]">
        <div className="max-w-[1100px] mx-auto text-center">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: KIT_EASE }}
          >
            <Eyebrow align="center">
              {lane.title}
              {book.position_label ? ` · ${book.position_label}` : ""}
            </Eyebrow>
            <h1
              className="font-display font-normal text-[44px] md:text-[64px] leading-[1.05] mt-5"
              style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
            >
              {book.title}
            </h1>
            <div className="mx-auto my-7 h-px w-14" style={{ background: GOLD_SOFT }} />
            <p
              className="font-cormorant italic text-[22px] md:text-[24px] leading-[1.45] max-w-[680px] mx-auto"
              style={{ color: TEXT, textWrap: "pretty" }}
            >
              {book.tagline}
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center mt-12"
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: KIT_EASE }}
          >
            <CoverHalo
              src={book.cover_image_square ?? book.cover_image}
              title={book.title}
              alt={`${book.title} — cover`}
              width={320}
            />
          </motion.div>

          <div className="mt-12 max-w-[640px] mx-auto">
            <RetailerButtons book={book} layout="grid" />
          </div>
        </div>
      </section>

      {/* ──────────────── Blurb ──────────────── */}
      <section className="px-6 md:px-16 py-[100px]" style={{ background: SURFACE }}>
        <div className="max-w-[760px] mx-auto">
          <p
            className="font-cormorant text-[19px] md:text-[20px] leading-[1.75]"
            style={{ color: TEXT, textWrap: "pretty" }}
          >
            {book.blurb}
          </p>
        </div>
      </section>

      {/* ──────────────── Pull quote ──────────────── */}
      {book.pull_quote && (
        <section className="px-6 md:px-16 py-[120px]">
          <div className="max-w-[820px] mx-auto text-center">
            <Eyebrow align="center">Inside this book</Eyebrow>
            <blockquote
              className="font-display italic text-[28px] md:text-[36px] leading-[1.4] mt-7 m-0"
              style={{ color: TEXT, textWrap: "balance" }}
            >
              {book.pull_quote}
            </blockquote>
          </div>
        </section>
      )}

      {/* ──────────────── Other books in lane (lane-scoped, never cross) ──────────────── */}
      {others.length > 0 && (
        <section className="px-6 md:px-16 py-[100px]" style={{ background: SURFACE }}>
          <div className="max-w-[1100px] mx-auto">
            <Ornament />
            <div className="text-center mt-12 mb-12">
              <Eyebrow align="center">Other books in this series</Eyebrow>
              <h2
                className="font-display font-normal text-[28px] md:text-[34px] leading-[1.15] mt-5"
                style={{ color: TEXT, letterSpacing: "-0.02em" }}
              >
                {lane.title}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {others.map((other) => (
                <Link key={other.slug} href={`/books/${other.slug}`}>
                  <a className="block no-underline" style={{ color: TEXT }}>
                    <div className="flex justify-center">
                      <CoverHalo
                        src={other.cover_image}
                        title={other.title}
                        alt={`${other.title} — cover`}
                        width={180}
                      />
                    </div>
                    <div
                      className="font-inter text-[10px] font-semibold uppercase mt-4 text-center"
                      style={{ color: GOLD, letterSpacing: "0.28em" }}
                    >
                      {other.position_label}
                    </div>
                    <h3
                      className="font-display text-[18px] leading-[1.2] mt-2 text-center"
                      style={{ color: TEXT, letterSpacing: "-0.01em", textWrap: "balance" }}
                    >
                      {other.title}
                    </h3>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterBand onSubscribe={handleSubscribe} freeBookHref="/free-book" />
    </div>
  );
}

function NotInCatalog({ slug }: { slug: string }) {
  return (
    <div
      className="kit-grain min-h-screen font-cormorant flex items-center justify-center px-6"
      style={{ background: INK, color: TEXT }}
    >
      <EnhancedSEOHead
        title="Title not found · Reese Astor"
        description="That title is not in the Reese Astor catalog."
        canonical="/books"
        noindex
      />
      <div className="max-w-[560px] text-center">
        <Eyebrow align="center">Not in catalog</Eyebrow>
        <h1
          className="font-display font-normal text-[36px] mt-5"
          style={{ color: TEXT, letterSpacing: "-0.02em" }}
        >
          We can&rsquo;t find that title.
        </h1>
        <p
          className="font-cormorant italic text-[18px] mt-6"
          style={{ color: TEXT_SOFT }}
        >
          The slug <code style={{ color: GOLD }}>{slug}</code> isn&rsquo;t in the Reese Astor catalog.
        </p>
        <Link href="/books">
          <a
            className="font-inter inline-flex items-center gap-2 text-[12px] font-semibold uppercase no-underline mt-10 transition-all duration-200 hover:-translate-y-px"
            style={{
              color: INK,
              background: GOLD,
              padding: "16px 28px",
              letterSpacing: "0.22em",
              borderRadius: 4,
            }}
          >
            Visit the catalog
          </a>
        </Link>
      </div>
    </div>
  );
}
