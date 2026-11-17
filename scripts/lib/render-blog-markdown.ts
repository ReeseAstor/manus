import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogArticleMarkdown } from "../../client/src/lib/blog-markdown";

/** Same markdown pipeline the client reader uses, as static HTML for prerender. */
export function renderBlogMarkdownToHtml(content: string): string {
  return renderToStaticMarkup(createElement(BlogArticleMarkdown, { content }));
}
