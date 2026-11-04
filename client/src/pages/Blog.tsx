import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { matchesBlogSearch, readingMinutes } from "@/lib/blog-reading";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { BlogContentUpgrade } from "@/components/BlogContentUpgrade";
import "@/styles/blog.css";

const POSTS_PER_PAGE = 9;
const dateLabel = (date: string | Date | null) => {
  if (!date) return "";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function Blog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const { data: posts = [], isLoading, error, refetch } = trpc.blog.list.useQuery({ published: true });
  const categories = useMemo(() => Array.from(new Set(posts.map(post => post.category).filter(Boolean))).sort(), [posts]);
  const filtered = useMemo(() => posts.filter(post =>
    (!category || post.category === category) && matchesBlogSearch(post, query)
  ), [posts, category, query]);
  const displayed = filtered.slice(0, visibleCount);
  const resetFilters = () => { setQuery(""); setCategory(""); setVisibleCount(POSTS_PER_PAGE); };

  return (
    <div className="journal-page">
      <EnhancedSEOHead title="The Fine Print | Reese Astor" description="Reading lists, small rituals, and notes on Manhattan romance. A quieter corner of Reese Astor's world." canonical="/blog" />
      <header className="journal-masthead">
        <p className="journal-eyebrow">Notes from Reese Astor</p>
        <h1>The Fine Print</h1>
        <p className="journal-deck">For the life between chapters.</p>
        <p className="journal-intro">Reading lists, small rituals, and a closer look at the stories. Take what’s useful. Stay as long as you like.</p>
      </header>

      <section className="journal-shell" aria-label="Find an article">
        <div className="journal-discovery">
          <label className="journal-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search articles by title, topic, or category</span>
            <input type="search" value={query} placeholder="Find your next read or reading ritual…" onChange={event => {
              setQuery(event.target.value); setVisibleCount(POSTS_PER_PAGE);
            }} />
          </label>
          <nav className="journal-categories" aria-label="Article categories">
            {["", ...categories].map(item => (
              <button key={item} type="button" aria-pressed={item === category} onClick={() => {
                setCategory(item); setVisibleCount(POSTS_PER_PAGE);
              }}>{item || "All notes"}</button>
            ))}
          </nav>
        </div>
        {isLoading ? (
          <p className="journal-state" role="status">Opening the journal…</p>
        ) : error ? (
          <div className="journal-state" role="alert">
            <h2>The journal couldn’t load.</h2>
            <p>Please try again in a moment.</p>
            <button className="journal-button" onClick={() => void refetch()}>Try again</button>
          </div>
        ) : (
          <>
            <p className="journal-results" role="status">{filtered.length} {filtered.length === 1 ? "article" : "articles"}{category ? ` · ${category}` : ""}{query.trim() ? ` matching “${query.trim()}”` : ""}</p>
            {displayed.length > 0 ? (
              <div className="journal-grid">
                {displayed.map(post => (
                  <article className="journal-card" key={post.id}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.featuredImage && <img src={post.featuredImage} alt="" loading="lazy" decoding="async" width={640} height={400} />}
                      <div className="journal-card-copy">
                        <p className="journal-eyebrow">{post.category}</p>
                        <h2>{post.title}</h2>
                        <p className="journal-card-excerpt">{post.excerpt}</p>
                        <div className="journal-meta"><span>{dateLabel(post.publishedAt)}</span><span>{readingMinutes(post.content)} min read</span></div>
                        <span className="journal-read-link">Read the note <ArrowRight size={16} aria-hidden="true" /></span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="journal-state">
                <h2>{posts.length ? "Nothing here just yet." : "The next chapter is on its way."}</h2>
                <p>{posts.length ? "Try a different phrase, or return to all the notes." : "New reading notes will appear here when published."}</p>
                {posts.length > 0 && <button className="journal-button" onClick={resetFilters}>Clear search and filters</button>}
              </div>
            )}
            {filtered.length > visibleCount && (
              <div className="journal-more">
                <p>Showing {displayed.length} of {filtered.length} articles</p>
                <button className="journal-button" onClick={() => setVisibleCount(count => count + POSTS_PER_PAGE)}>More notes ({filtered.length - visibleCount} remaining)</button>
              </div>
            )}
          </>
        )}
      </section>
      <div className="journal-narrow"><BlogContentUpgrade blogSlug="journal" /></div>
    </div>
  );
}
