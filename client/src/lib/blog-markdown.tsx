import React, { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { PRODUCT_LINK_REL } from "../data/affiliateProducts";
import { isAmazonAffiliateDestination, withAmazonTag } from "./amazon-tag";

export const blogMarkdownRemarkPlugins = [remarkGfm];
export const blogMarkdownRehypePlugins = [rehypeRaw, rehypeSanitize];

export const blogMarkdownComponents: Components = {
  a: ({ href, children }) => {
    const affiliate = !!href && isAmazonAffiliateDestination(href);
    const external = !!href && /^https?:\/\//i.test(href);
    return (
      <a
        href={affiliate ? withAmazonTag(href) : href}
        target={external ? "_blank" : undefined}
        rel={
          affiliate
            ? PRODUCT_LINK_REL
            : external
              ? "noopener noreferrer"
              : undefined
        }
      >
        {children as ReactNode}
        {external && (
          <span className="sr-only">
            {" "}
            (opens in a new tab{affiliate ? ", affiliate link" : ""})
          </span>
        )}
      </a>
    );
  },
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
  ),
};

export function BlogArticleMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={blogMarkdownRemarkPlugins}
      rehypePlugins={blogMarkdownRehypePlugins}
      components={blogMarkdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}

/** Same markdown pipeline the client reader uses, as static HTML for prerender. */
export function renderBlogMarkdownToHtml(content: string): string {
  return renderToStaticMarkup(createElement(BlogArticleMarkdown, { content }));
}
