/**
 * Markdown -> static HTML for the no-JS blog prerender (scripts/prerender-static.mjs).
 *
 * QA CARD-v6 F3: the old hand-rolled converter flattened lists into one <p>, printed "---" as text and
 * left [text](url) raw, so crawlers saw " - Winter: …", "--- Disclosure" and unclickable affiliate links.
 * This uses the same parser stack as the SPA's <Streamdown> (react-markdown + remark-gfm, both runtime
 * dependencies), so the no-JS output has the SPA's semantic structure: <h2>/<h3>, <ul>/<ol><li>, <hr>,
 * <strong>/<em>, <a href>.
 *
 * Safety (the input is DB text):
 *  - all text and attribute values are escaped by React's static renderer;
 *  - raw HTML inside the markdown is dropped (skipHtml), so <script>, <img onerror> etc. never reach the page;
 *  - hrefs/srcs are allowlisted: http:, https:, mailto: and relative URLs only; anything else (javascript:,
 *    data:, vbscript:, protocol-relative //host, control-character tricks) loses the href and renders as text.
 * Links: hrefs are kept byte for byte (Amazon tag=reeseastor-20 is preserved, never added or changed).
 * External links open in a new tab like the SPA (target=_blank, rel noopener noreferrer); affiliate links
 * (Amazon, amzn.to, or a tag=/via= referral parameter) also get rel="nofollow sponsored".
 */
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SITE_HOSTS = /^(www\.)?reeseastor\.com$/i;

/** Allowlisted URL, or undefined. Strips ASCII whitespace/control characters first (browsers ignore them in schemes). */
export function safeUrl(url) {
  if (typeof url !== "string") return undefined;
  const u = url.replace(/[\u0000-\u0020\u007f-\u009f]/g, "");
  if (!u) return undefined;
  if (/^[\\/](?:[\\/]|%5c|%2f)/i.test(u)) return undefined; // protocol-relative ("//host", "/\host", and percent-encoded forms)
  const scheme = u.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme && !/^(https?|mailto)$/i.test(scheme[1])) return undefined;
  return u;
}

/** "affiliate" | "external" | "internal" */
export function linkKind(href) {
  if (!/^https?:/i.test(href)) return "internal";
  let url;
  try {
    url = new URL(href);
  } catch {
    return "external";
  }
  if (SITE_HOSTS.test(url.hostname)) return "internal";
  if (/(^|\.)amazon\.[a-z.]+$/i.test(url.hostname) || /^amzn\.to$/i.test(url.hostname)) return "affiliate";
  if (url.searchParams.has("tag") || url.searchParams.has("via")) return "affiliate";
  return "external";
}

function A({ href, children, title }) {
  if (!href) return h("span", null, children);
  const kind = linkKind(href);
  const props = { href, ...(title ? { title } : {}) };
  if (kind === "affiliate") Object.assign(props, { target: "_blank", rel: "nofollow sponsored noopener noreferrer" });
  else if (kind === "external") Object.assign(props, { target: "_blank", rel: "noopener noreferrer" });
  return h("a", props, children);
}

function Img({ src, alt, title }) {
  if (!src) return null;
  return h("img", { src, alt: alt ?? "", ...(title ? { title } : {}), loading: "lazy" });
}

export function mdToHtml(md = "") {
  return renderToStaticMarkup(
    h(
      Markdown,
      {
        remarkPlugins: [remarkGfm],
        skipHtml: true,
        urlTransform: (url) => safeUrl(url),
        components: { a: A, img: Img },
      },
      String(md ?? ""),
    ),
  );
}
