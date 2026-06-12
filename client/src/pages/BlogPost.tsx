import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2, AudioLines } from "lucide-react";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { BlogToShopBridge } from "@/components/BlogToShopBridge";
import { BlogContentUpgrade } from "@/components/BlogContentUpgrade";
import { AffiliateProductSection, FTCDisclosure } from "@/components/AffiliateProductCard";
import { affiliateProductsBySlug } from "@/data/affiliateProducts";
import {
  Eyebrow,
  JournalCard,
  Ornament,
  RAButton,
  ScrollProgress,
  GOLD,
  GOLD_SOFT,
  INK,
  KIT_EASE,
  MUTED,
  RAISED,
  RULE,
  RULE_SOFT,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";

function ShareIcon({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 cursor-pointer items-center justify-center bg-transparent transition-all duration-200 hover:-translate-y-px"
      style={{ border: `1px solid ${RULE}`, color: GOLD }}
    >
      {children}
    </button>
  );
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const reduce = useReducedMotion();

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });
  const { data: relatedPosts } = trpc.blog.list.useQuery(
    { published: true, category: post?.category },
    { enabled: !!post?.category }
  );

  // Filter out current post from related posts and limit to 3
  const filteredRelatedPosts = relatedPosts
    ?.filter((p) => p.slug !== slug)
    .slice(0, 3) || [];

  // Check if this article has affiliate product data
  const affiliateData = slug ? affiliateProductsBySlug[slug] : undefined;

  // SEO Meta Tags - Update document head when post loads
  useEffect(() => {
    if (post) {
      // Update page title
      document.title = `${post.title} | Reese Astor - Romance Author`;

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.excerpt);

      // Update or create Open Graph tags for social sharing
      const ogTags = [
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:site_name', content: 'Reese Astor - Romance Author' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.title },
        { name: 'twitter:description', content: post.excerpt },
      ];

      ogTags.forEach(tag => {
        const selector = tag.property
          ? `meta[property="${tag.property}"]`
          : `meta[name="${tag.name}"]`;
        let metaTag = document.querySelector(selector);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          if (tag.property) metaTag.setAttribute('property', tag.property);
          if (tag.name) metaTag.setAttribute('name', tag.name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });

      // Add article-specific meta tags
      let articleAuthor = document.querySelector('meta[name="author"]');
      if (!articleAuthor) {
        articleAuthor = document.createElement('meta');
        articleAuthor.setAttribute('name', 'author');
        document.head.appendChild(articleAuthor);
      }
      articleAuthor.setAttribute('content', 'Reese Astor');

      // Add keywords based on category
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      const baseKeywords = 'romance books, billionaire romance, Manhattan Money Kings, Reese Astor';
      const categoryKeywords: Record<string, string> = {
        'Reading Recommendations': 'book recommendations, romance series, best romance books 2024',
        'Writing Tips': 'romance writing tips, how to write romance, author advice',
        'Author Journey': 'self-publishing, indie author, author business',
        'Marketing': 'book marketing, author platform, social media for authors',
      };
      metaKeywords.setAttribute('content', `${baseKeywords}, ${categoryKeywords[post.category] || ''}`);
    }

    // Cleanup - reset title when leaving page
    return () => {
      document.title = 'Reese Astor | USA Today Bestselling Romance Author';
    };
  }, [post]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: INK }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ background: INK }}>
        <div className="max-w-[480px] text-center">
          <Ornament width={100} />
          <h1 className="font-display mt-8 text-[36px] font-normal" style={{ color: TEXT }}>
            Essay not found
          </h1>
          <p className="font-cormorant mt-4 text-[19px] italic" style={{ color: TEXT_SOFT }}>
            The page you&rsquo;re looking for has been filed elsewhere.
          </p>
          <div className="mt-9">
            <RAButton variant="primary" size="lg" href="/blog">Back to the journal</RAButton>
          </div>
        </div>
      </div>
    );
  }

  const dateLabel = post.publishedAt
    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
    : format(new Date(post.createdAt), "MMMM d, yyyy");

  return (
    <div className="kit-grain min-h-screen font-cormorant" style={{ background: INK, color: TEXT }}>
      <ScrollProgress />
      <EnhancedSEOHead
        title={`${post.title} | Reese Astor Blog`}
        description={post.excerpt?.slice(0, 155) || `${post.title} - Read the latest from romance author Reese Astor's blog.`}
        canonical={`/blog/${slug}`}
        ogType="article"
        keywords={[post.title, post.category || "romance", "Reese Astor blog", "romance writing"].filter(Boolean) as string[]}
      />

      {/* Article header */}
      <section
        className="relative overflow-hidden px-6 pb-14 pt-16 md:px-16 md:pt-24"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${RAISED} 0%, ${INK} 70%)` }}
      >
        <motion.div
          className="mx-auto max-w-[820px]"
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: KIT_EASE }}
        >
          <Link href="/blog">
            <a
              className="font-inter inline-flex items-center gap-2 text-[11px] font-semibold uppercase no-underline transition-colors duration-200 hover:text-[#C9A646]"
              style={{ color: TEXT_SOFT, letterSpacing: "0.26em" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              The Journal
            </a>
          </Link>

          <div className="mt-10">
            <Eyebrow>{post.category}</Eyebrow>
          </div>

          <h1
            className="font-display mt-5 text-[36px] font-normal leading-[1.12] md:text-[52px]"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            {post.title}
          </h1>

          <div className="my-8 flex items-center gap-[18px]">
            <span className="h-px w-14" style={{ background: GOLD }} />
            <span className="font-display text-base italic" style={{ color: GOLD }}>&#10038;</span>
            <span className="h-px w-14" style={{ background: GOLD_SOFT }} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="font-inter m-0 text-[11px] uppercase" style={{ color: MUTED, letterSpacing: "0.24em" }}>
              By Reese Astor · {dateLabel}{post.readTime ? ` · ${post.readTime}` : ""}
            </p>
            <div className="flex items-center gap-2.5">
              <ShareIcon label="Share on X" onClick={() => handleShare("twitter")}><Twitter className="h-4 w-4" /></ShareIcon>
              <ShareIcon label="Share on Facebook" onClick={() => handleShare("facebook")}><Facebook className="h-4 w-4" /></ShareIcon>
              <ShareIcon label="Share on LinkedIn" onClick={() => handleShare("linkedin")}><Linkedin className="h-4 w-4" /></ShareIcon>
              <ShareIcon label="Copy link" onClick={() => handleShare("copy")}><Share2 className="h-4 w-4" /></ShareIcon>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured image — double hairline frame, as on book covers */}
      {post.featuredImage && (
        <section className="px-6 md:px-16">
          <motion.div
            className="relative mx-auto max-w-[980px]"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: KIT_EASE, delay: 0.15 }}
          >
            <div className="pointer-events-none absolute -inset-[14px] border" style={{ borderColor: RULE }} />
            <img
              src={post.featuredImage}
              alt={post.title}
              className="block h-[280px] w-full select-none object-cover md:h-[440px]"
              style={{ boxShadow: "0 40px 80px -24px rgba(0,0,0,0.8)" }}
              draggable={false}
            />
          </motion.div>
        </section>
      )}

      {/* Body */}
      <section className="px-6 py-20 md:px-16 md:py-24">
        <motion.article
          className="mx-auto max-w-[760px]"
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: KIT_EASE, delay: 0.2 }}
        >
          {/* Lead / excerpt */}
          {post.excerpt && (
            <p
              className="font-cormorant mb-12 pl-7 text-[22px] italic leading-[1.6]"
              style={{ color: TEXT_SOFT, borderLeft: `1px solid ${GOLD_SOFT}`, textWrap: "pretty" }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Audio narration */}
          {post.audioUrl && (
            <div className="mb-12 p-7" style={{ background: RAISED, border: `1px solid ${RULE}` }}>
              <div className="mb-5 flex items-center gap-4">
                <span
                  className="flex h-11 w-11 items-center justify-center"
                  style={{ border: `1px solid ${RULE}`, color: GOLD }}
                >
                  <AudioLines className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-[19px]" style={{ color: TEXT }}>Listen to this essay</div>
                  <Eyebrow>Audio narration</Eyebrow>
                </div>
              </div>
              <audio controls className="w-full" style={{ filter: "invert(1) hue-rotate(180deg)" }}>
                <source src={post.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* FTC Disclosure for affiliate articles */}
          {affiliateData?.ftcDisclosure && <FTCDisclosure />}

          {/* Main Content */}
          <div className="prose prose-lg prose-invert mb-16 max-w-none">
            <div
              className="font-cormorant space-y-6 text-[19px] leading-[1.85]"
              style={{ color: "#D8D2C4" }}
            >
              <Streamdown>{post.content}</Streamdown>
            </div>
          </div>

          {/* Content Upgrade - Contextual email capture */}
          <BlogContentUpgrade blogSlug={slug} />

          {/* Affiliate Product Recommendations */}
          {affiliateData?.topPicks && affiliateData.topPicks.length > 0 && (
            <AffiliateProductSection
              products={affiliateData.topPicks}
              title="Top Picks"
              subtitle="Recommended Products from This Article"
              sourceSlug={post.slug}
            />
          )}

          {/* Author bio */}
          <div className="mt-4 p-8 md:p-10" style={{ background: RAISED, border: `1px solid ${RULE}` }}>
            <div className="flex flex-col items-start gap-7 md:flex-row">
              <div
                className="font-display flex h-20 w-20 shrink-0 items-center justify-center text-[26px]"
                style={{ border: `1px solid ${RULE}`, color: GOLD }}
              >
                RA
              </div>
              <div className="flex-1">
                <Eyebrow>About the author</Eyebrow>
                <h3 className="font-display mt-3 text-[26px] font-normal" style={{ color: TEXT }}>
                  Reese Astor
                </h3>
                <p className="font-cormorant mt-3 text-[17px] leading-[1.7]" style={{ color: TEXT_SOFT, textWrap: "pretty" }}>
                  USA Today Bestselling Author of steamy billionaire romance. Former corporate VP turned full-time author, helping aspiring writers build profitable author businesses through coaching and mentorship.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <RAButton variant="primary" href="/about">More about Reese</RAButton>
                  <RAButton variant="ghost" href="/books">Browse the books</RAButton>
                </div>
              </div>
            </div>
          </div>

          {/* Blog to Shop Bridge — sibling of the bio card, not nested inside it */}
          <BlogToShopBridge category={post.category?.toLowerCase().replace(/\s+/g, '-')} />
        </motion.article>
      </section>

      {/* Related posts */}
      {filteredRelatedPosts.length > 0 && (
        <section
          className="px-6 py-24 md:px-16"
          style={{ background: "#0B1226", borderTop: `1px solid ${RULE_SOFT}` }}
        >
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-16 text-center">
              <Eyebrow align="center">Keep reading</Eyebrow>
              <h2
                className="font-display mt-5 text-[34px] font-normal leading-[1.1] md:text-[42px]"
                style={{ color: TEXT, letterSpacing: "-0.02em" }}
              >
                Related <em className="font-normal">essays</em>
              </h2>
              <div className="mt-7"><Ornament width={110} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3" style={{ columnGap: 48, rowGap: 64 }}>
              {filteredRelatedPosts.map((relatedPost, index) => (
                <JournalCard
                  key={relatedPost.id}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt}
                  category={relatedPost.category}
                  href={`/blog/${relatedPost.slug}`}
                  image={relatedPost.featuredImage || undefined}
                  readTime={relatedPost.readTime || undefined}
                  delay={index * 0.08}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <RAButton variant="outline" size="lg" href="/blog">View all essays</RAButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
