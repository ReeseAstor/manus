import { memo, useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingId, parseSavedProgress, readingProgress } from "@/lib/blog-reading";
import { AFFILIATE_LINK_REL, isAmazonAffiliateDestination } from "@/lib/blog-recommendations";
import { withAmazonTag } from "@/lib/amazon-tag";

type Section = { id: string; title: string };
const markdownComponents: Components = {
  a: ({ href, children }) => {
    const affiliate = !!href && isAmazonAffiliateDestination(href);
    const external = !!href && /^https?:\/\//i.test(href);
    return <a href={affiliate ? withAmazonTag(href) : href} target={external ? "_blank" : undefined}
      rel={affiliate ? AFFILIATE_LINK_REL : external ? "noopener noreferrer" : undefined}>
      {children}{external && <span className="sr-only"> (opens in a new tab{affiliate ? ", affiliate link" : ""})</span>}
    </a>;
  },
  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />,
};
const ArticleMarkdown = memo(function ArticleMarkdown({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>;
});

export function BlogReader({ slug, content }: { slug: string; content: string }) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [largeType, setLargeType] = useState(false);
  const [remember, setRemember] = useState(false);
  const rememberRef = useRef(false);
  const [resume, setResume] = useState<number | null>(null);
  const storageKey = `reese:reading:${slug}`;

  useEffect(() => {
    try {
      setLargeType(localStorage.getItem("reese:large-type") === "true");
      const enabled = localStorage.getItem("reese:remember-reading") === "true";
      rememberRef.current = enabled;
      setRemember(enabled);
      setResume(enabled ? parseSavedProgress(localStorage.getItem(storageKey)) : null);
    } catch { /* Reading works even when browser storage is unavailable. */ }
  }, [storageKey]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    setSections(Array.from(article.querySelectorAll("h2, h3")).map((heading, index) => {
      heading.id = headingId(heading.textContent ?? "", index);
      return { id: heading.id, title: heading.textContent ?? "" };
    }));
    let frame = 0;
    const measure = () => {
      const rect = article.getBoundingClientRect();
      const value = readingProgress(rect.top, rect.height, window.innerHeight);
      progressRef.current = value;
      setProgress(value);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    observer?.observe(article);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [content, largeType]);

  useEffect(() => {
    if (!remember) return;
    const save = () => {
      if (!rememberRef.current) return;
      try {
        const value = progressRef.current;
        if (value >= 0.98) localStorage.removeItem(storageKey);
        else if (value > 0.02) localStorage.setItem(storageKey, String(value));
      } catch { /* Storage is optional. */ }
    };
    const onVisibility = () => { if (document.visibilityState === "hidden") save(); };
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [remember, storageKey]);

  const toggleRemember = () => {
    const enabled = !remember;
    rememberRef.current = enabled;
    setRemember(enabled);
    if (!enabled) setResume(null);
    try {
      localStorage.setItem("reese:remember-reading", String(enabled));
      if (!enabled) localStorage.removeItem(storageKey);
    } catch { /* Storage is optional. */ }
  };

  const resumeReading = () => {
    const rect = articleRef.current?.getBoundingClientRect();
    if (rect && resume !== null) {
      window.scrollTo({ top: Math.max(0, window.scrollY + rect.top + resume * Math.max(0, rect.height - window.innerHeight)), behavior: "instant" });
      setResume(null);
    }
  };

  return (
    <>
      <div className="reading-tools" aria-label="Reading preferences">
        <button type="button" className="journal-button" aria-pressed={largeType} onClick={() => {
          setLargeType(!largeType);
          try { localStorage.setItem("reese:large-type", String(!largeType)); } catch { /* Optional. */ }
        }}>Aa · {largeType ? "Standard text" : "Larger text"}</button>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={remember} onChange={toggleRemember} />
          Remember my place on this device
        </label>
        <span className="tabular-nums" aria-hidden="true">{Math.round(progress * 100)}% read</span>
      </div>
      {resume !== null && (
        <div className="reading-resume">
          <p>You left off about {Math.round(resume * 100)}% through this article.</p>
          <button className="journal-button" onClick={resumeReading}>Continue where I left off</button>
          <button className="journal-link" onClick={() => setResume(null)}>Start from the beginning</button>
        </div>
      )}
      {sections.length > 0 && (
        <details className="article-contents">
          <summary>In this article · {sections.length} sections</summary>
          <nav aria-label="Article sections">
            <ol>{sections.map(section => (
              <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
            ))}</ol>
          </nav>
        </details>
      )}
      <div ref={articleRef} className={`journal-prose ${largeType ? "journal-prose-large" : ""}`}>
        <ArticleMarkdown content={content} />
      </div>
      <div className="reading-progress-track" aria-hidden="true"><div style={{ width: `${progress * 100}%` }} /></div>
    </>
  );
}
