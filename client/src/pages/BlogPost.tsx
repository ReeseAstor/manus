import { Link, useParams } from "wouter";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { readingMinutes } from "@/lib/blog-reading";
import { resolveBlogRecommendations } from "@/lib/blog-recommendations";
import { BlogReader } from "@/components/BlogReader";
import { BlogContentUpgrade } from "@/components/BlogContentUpgrade";
import {
  AffiliateProductSection,
  FTCDisclosure,
} from "@/components/AffiliateProductCard";
import {
  EnhancedSEOHead,
  generateArticleSchema,
} from "@/components/ui/enhanced-seo-head";
import { breadcrumbSchema } from "@/data/structured-data";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@shared/site";
import "@/styles/blog.css";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = trpc.blog.getBySlug.useQuery({ slug }, { retry: false });
  const { data: related = [] } = trpc.blog.list.useQuery(
    { published: true, category: post?.category },
    { enabled: !!post }
  );
  const missing = error?.data?.code === "NOT_FOUND";

  if (isLoading)
    return (
      <div className="journal-page journal-state" role="status">
        Opening this note…
      </div>
    );
  if (!post || error)
    return (
      <div className="journal-page journal-state">
        <EnhancedSEOHead
          title={
            missing
              ? "Article not found | Reese Astor"
              : "Article unavailable | Reese Astor"
          }
          description="Return to The Fine Print to find a reading note."
          canonical={`/blog/${slug}`}
          noindex
        />
        <h1>
          {missing ? "This page has turned." : "We couldn’t open this note."}
        </h1>
        <p>
          {missing
            ? "This article is no longer available. There’s more to read in the journal."
            : "The connection may be interrupted. Your reading can wait a moment."}
        </p>
        {!missing && (
          <button className="journal-button" onClick={() => void refetch()}>
            Try again
          </button>
        )}
        <Link className="journal-link" href="/blog">
          Back to The Fine Print
        </Link>
      </div>
    );

  const recommendations = resolveBlogRecommendations({
    slug: post.slug,
    title: post.title,
    content: post.content,
  });
  const nextReads = related.filter(item => item.slug !== post.slug).slice(0, 3);
  const publishedDate = new Date(post.publishedAt || post.createdAt);
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;
  const publishedISO = Number.isNaN(publishedDate.getTime())
    ? undefined
    : publishedDate.toISOString();
  const updatedISO =
    updatedDate && !Number.isNaN(updatedDate.getTime())
      ? updatedDate.toISOString()
      : undefined;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl(`/blog/${post.slug}`));
      toast.success("Article link copied.");
    } catch {
      toast.error(
        "Couldn’t copy the link. You can copy it from your address bar."
      );
    }
  };

  return (
    <div className="journal-page">
      <EnhancedSEOHead
        title={`${post.title} | Reese Astor`}
        description={post.metaDescription || post.excerpt || post.title}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.featuredImage || undefined}
        publishDate={publishedISO}
        modifiedDate={updatedISO}
        structuredData={[
          generateArticleSchema({
            title: post.title,
            description: post.excerpt || post.title,
            url: absoluteUrl(`/blog/${post.slug}`),
            image: absoluteUrl(post.featuredImage || DEFAULT_OG_IMAGE),
            publishDate: publishedISO || "",
            modifiedDate: updatedISO,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Fine Print", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <header className="journal-article-header journal-narrow">
        <Link href="/blog" className="journal-back">
          <ArrowLeft size={16} aria-hidden="true" /> The Fine Print
        </Link>
        <p className="journal-eyebrow">{post.category} · A note from Reese</p>
        <h1>{post.title}</h1>
        <div className="journal-meta">
          {publishedISO && (
            <time dateTime={publishedISO}>
              {publishedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          <span>{readingMinutes(post.content)} min read</span>
          <button onClick={copyLink} className="journal-copy">
            <LinkIcon size={15} aria-hidden="true" /> Copy link
          </button>
        </div>
        {post.excerpt && <p className="journal-article-deck">{post.excerpt}</p>}
      </header>
      {post.featuredImage && (
        <figure className="journal-featured">
          <img
            src={post.featuredImage}
            alt=""
            width={1200}
            height={650}
            decoding="async"
            fetchPriority="high"
          />
        </figure>
      )}
      <article
        className="journal-narrow journal-article-body"
        aria-label={post.title}
      >
        {recommendations.hasAffiliateLinks && <FTCDisclosure />}
        {post.audioUrl && (
          <section className="journal-audio" aria-label="Audio version">
            <h2>Prefer to listen?</h2>
            <p>The article is also available as audio.</p>
            <audio
              controls
              preload="none"
              src={post.audioUrl}
              aria-label={`Listen to ${post.title}`}
            >
              Your browser does not support audio playback.
            </audio>
          </section>
        )}
        <BlogReader key={post.slug} slug={post.slug} content={post.content} />
        {recommendations.products.length > 0 && (
          <section
            id="article-resources"
            aria-label="Optional reading resources"
          >
            <AffiliateProductSection
              products={recommendations.products}
              sourceSlug={post.slug}
            />
          </section>
        )}
        <footer className="journal-author">
          <p className="journal-eyebrow">Written by Reese Astor</p>
          <p>
            Steamy billionaire romance, set in Manhattan. The Hudson Dynasty and
            the Manhattan Money Kings. Every book stands alone and ends happily.
          </p>
          <Link href="/about" className="journal-link">
            More about Reese
          </Link>
        </footer>
        {nextReads.length > 0 && (
          <section
            className="journal-next"
            aria-labelledby="next-reading-title"
          >
            <p className="journal-eyebrow">Stay a little longer</p>
            <h2 id="next-reading-title">Another note, if you like.</h2>
            <div>
              {nextReads.map(item => (
                <Link key={item.id} href={`/blog/${item.slug}`}>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{readingMinutes(item.content)} min read</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        <BlogContentUpgrade key={post.slug} blogSlug={post.slug} />
        <Link href="/blog" className="journal-back">
          <ArrowLeft size={16} aria-hidden="true" /> All notes
        </Link>
      </article>
    </div>
  );
}
