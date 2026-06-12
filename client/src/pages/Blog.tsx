import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import {
  Eyebrow,
  JournalCard,
  NewsletterBand,
  Ornament,
  RAButton,
  ScrollProgress,
  GOLD,
  GOLD_SOFT,
  INK,
  KIT_EASE,
  RAISED,
  RULE_SOFT,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";

const POSTS_PER_PAGE = 9;

function CategoryTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-inter group relative cursor-pointer bg-transparent pb-2 text-[11px] font-semibold uppercase transition-colors duration-200"
      style={{ border: "none", letterSpacing: "0.26em", color: active ? GOLD : TEXT_SOFT }}
    >
      {label}
      <span
        aria-hidden
        className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
        style={{ background: active ? GOLD : GOLD_SOFT }}
      />
    </button>
  );
}

export default function Blog() {
  useEffect(() => {
    document.title = "Romance Writing Blog | Tips & Insights by Reese Astor";
  }, []);

  const reduce = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [selectedCategory]);

  const { data: blogPosts, isLoading } = trpc.blog.list.useQuery({
    published: true,
    category: selectedCategory,
  });

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();
  const handleSubscribe = async (email: string) => {
    await subscribeMutation.mutateAsync({ email: email.trim() });
  };

  // Get unique categories from all posts (fetch without category filter for category list)
  const { data: allPosts } = trpc.blog.list.useQuery({ published: true });
  const uniqueCategories = allPosts?.map((post) => post.category) || [];
  const categories = ["All", ...Array.from(new Set(uniqueCategories))];

  const allDisplayPosts = blogPosts ?? [];

  // Paginated posts - show only visibleCount posts
  const displayPosts = useMemo(
    () => allDisplayPosts.slice(0, visibleCount),
    [allDisplayPosts, visibleCount],
  );

  const hasMore = allDisplayPosts.length > visibleCount;
  const remainingCount = allDisplayPosts.length - visibleCount;

  return (
    <div className="kit-grain min-h-screen font-cormorant" style={{ background: INK, color: TEXT }}>
      <ScrollProgress />
      <EnhancedSEOHead
        title="Romance Writing Blog | Tips & Insights by Reese Astor"
        description="Writing tips, behind-the-scenes insights, and romance industry advice from USA Today Bestselling author Reese Astor. Learn the craft of storytelling."
        canonical="/blog"
        ogType="website"
        keywords={["romance writing tips", "author blog", "writing advice", "Reese Astor blog", "romance author insights", "storytelling craft"]}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 pb-20 pt-24 md:px-16 md:pb-24 md:pt-32"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${RAISED} 0%, ${INK} 70%)` }}
      >
        <motion.div
          className="mx-auto max-w-[820px] text-center"
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: KIT_EASE }}
        >
          <Eyebrow align="center">The Journal · Insights &amp; Inspiration</Eyebrow>
          <h1
            className="font-display mt-6 text-[44px] font-normal leading-[1.05] md:text-[64px]"
            style={{ color: TEXT, letterSpacing: "-0.022em", textWrap: "balance" }}
          >
            Writing &amp; <em className="font-normal">Publishing</em>
          </h1>
          <div className="mt-8">
            <Ornament width={120} />
          </div>
          <p
            className="font-cormorant mx-auto mt-7 max-w-[580px] text-[20px] italic leading-[1.6]"
            style={{ color: TEXT_SOFT, textWrap: "pretty" }}
          >
            Tips, strategies, and insights on romance writing, self-publishing, and building a profitable author business.
          </p>
        </motion.div>
      </section>

      {/* Category filter */}
      {categories.length > 1 && (
        <section className="px-6 pb-16 md:px-16">
          <motion.nav
            className="mx-auto flex max-w-[980px] flex-wrap items-center justify-center gap-x-8 gap-y-4"
            aria-label="Filter posts by category"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((category) => (
              <CategoryTab
                key={category}
                label={category}
                active={(category === "All" && !selectedCategory) || category === selectedCategory}
                onClick={() => setSelectedCategory(category === "All" ? undefined : category)}
              />
            ))}
          </motion.nav>
        </section>
      )}

      {/* Posts */}
      <section className="px-6 pb-28 md:px-16">
        <div className="mx-auto max-w-[1240px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} />
            </div>
          ) : displayPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ columnGap: 48, rowGap: 72 }}>
                {displayPosts.map((post, index) => (
                  <JournalCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    href={`/blog/${post.slug}`}
                    image={post.featuredImage || undefined}
                    dateLabel={post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : undefined}
                    readTime={post.readTime || undefined}
                    delay={(index % 3) * 0.08}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-20 flex flex-col items-center gap-5">
                  <Eyebrow align="center">
                    Showing {displayPosts.length} of {allDisplayPosts.length} essays
                  </Eyebrow>
                  <RAButton variant="outline" size="lg" onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}>
                    Load more ({remainingCount} remaining)
                  </RAButton>
                </div>
              )}

              {!hasMore && allDisplayPosts.length > POSTS_PER_PAGE && (
                <p className="font-cormorant mt-20 text-center text-[17px] italic" style={{ color: TEXT_SOFT }}>
                  You&rsquo;ve reached the end — all {allDisplayPosts.length} essays loaded.
                </p>
              )}
            </>
          ) : (
            /* Empty state — no dead placeholder links */
            <motion.div
              className="mx-auto max-w-[560px] py-16 text-center"
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: KIT_EASE }}
            >
              <Ornament width={100} />
              <h2
                className="font-display mt-8 text-[30px] font-normal leading-[1.2]"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                {selectedCategory ? "Nothing filed here yet." : "The first essay is being written."}
              </h2>
              <p className="font-cormorant mt-5 text-[19px] italic leading-[1.6]" style={{ color: TEXT_SOFT }}>
                {selectedCategory
                  ? "Try another category, or browse everything."
                  : "Join the Inner Circle below and it will arrive in your inbox first."}
              </p>
              {selectedCategory && (
                <div className="mt-8">
                  <RAButton variant="outline" onClick={() => setSelectedCategory(undefined)}>
                    View all essays
                  </RAButton>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Pull-line between grid and newsletter */}
      <section
        className="px-6 py-16 text-center md:px-16"
        style={{ borderTop: `1px solid ${RULE_SOFT}` }}
      >
        {/* Quote verbatim from About.tsx */}
        <p className="font-display m-0 text-[22px] italic md:text-[26px]" style={{ color: TEXT_SOFT, textWrap: "balance" }}>
          &ldquo;I believe romance novels are more than just entertainment&mdash;they&rsquo;re empowerment.&rdquo;
        </p>
        <div className="mt-4">
          <Link href="/about">
            <a
              className="font-inter text-[11px] font-semibold uppercase no-underline"
              style={{ color: GOLD, letterSpacing: "0.28em", borderBottom: `1px solid ${GOLD_SOFT}`, paddingBottom: 3 }}
            >
              About Reese →
            </a>
          </Link>
        </div>
      </section>

      <NewsletterBand onSubscribe={handleSubscribe} freeBookHref="/free-book" />
    </div>
  );
}
