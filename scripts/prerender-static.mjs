#!/usr/bin/env node
/**
 * Build-time prerender for crawlers and AI answer engines.
 *
 * The site is a client-rendered SPA, so a non-JS fetch (GPTBot, ClaudeBot,
 * PerplexityBot, social link previews) used to receive an empty <div id="root">
 * and the same generic <head> on every URL. This script runs after `vite build`
 * and writes one static HTML file per public route with:
 *   - the page's own <title>, description, canonical, Open Graph and Twitter tags
 *   - JSON-LD (Person, WebSite, BookSeries, Book, BlogPosting, BreadcrumbList)
 *   - readable, linked body copy inside #root (React replaces it on load)
 * plus /llms.txt.
 *
 * Output layout (dist/public):
 *   index.html          → prerendered home page
 *   app-shell.html      → untouched SPA shell, used for every other route
 *   books.html, books/<slug>.html, about.html, … (served via cleanUrls)
 *
 * Blog posts are prerendered only when DATABASE_URL is available at build
 * time; otherwise /blog/<slug> falls back to the SPA shell as before.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = process.cwd();
const publicDir = path.join(root, "dist", "public");
const templatePath = path.join(publicDir, "index.html");

if (!fs.existsSync(templatePath)) {
  console.error("[prerender] dist/public/index.html not found. Run `vite build` first.");
  process.exit(1);
}

// ── Load the catalog + schema builders (TypeScript) via esbuild ───────────
const tmpDir = path.join(root, "dist", ".prerender");
fs.mkdirSync(tmpDir, { recursive: true });
const bundled = path.join(tmpDir, "structured-data.mjs");
await build({
  entryPoints: [path.join(root, "client/src/data/structured-data.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: bundled,
  logLevel: "silent",
});
const sd = await import(pathToFileURL(bundled).href);
// Same tagging helper the live store buttons use.
const tagBundled = path.join(tmpDir, "amazon-tag.mjs");
await build({
  entryPoints: [path.join(root, "client/src/lib/amazon-tag.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: tagBundled,
  logLevel: "silent",
});
const { withAmazonTag } = await import(pathToFileURL(tagBundled).href);
const { bookFallbackFactsHtml, bookFallbackBuyHtml, fallbackProblems } = await import(
  pathToFileURL(path.join(root, "scripts/lib/book-fallback.mjs")).href
);
const { BOOKS, LANE_META, ROMANCE_LANES } = sd;
const { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } = sd;

// ── Helpers ────────────────────────────────────────────────────────────────
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const jsonLd = (obj) =>
  `<script type="application/ld+json" data-pre="1">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

const template = fs.readFileSync(templatePath, "utf8");
// Keep an untouched copy of the SPA shell for every non-prerendered route.
fs.writeFileSync(path.join(publicDir, "app-shell.html"), template);
// Vercel serves 404.html with a real 404 status for any path no route matches;
// the SPA shell then renders the Not Found page.
fs.writeFileSync(path.join(publicDir, "404.html"), template);

const NAV = `<nav aria-label="Site"><a href="/">Reese Astor</a> · <a href="/books">Books</a> · <a href="/about">About</a> · <a href="/blog">Blog</a> · <a href="/newsletter">Newsletter</a> · <a href="/free-book">Free book</a></nav>`;

function renderPage({ route, title, description, ogType = "website", image, schemas = [], body, noindex = false }) {
  const canonical = absoluteUrl(route);
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const desc = clip(description, 160);
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" data-pre="1" />`,
    `<link rel="canonical" href="${esc(canonical)}" data-pre="1" />`,
    noindex ? `<meta name="robots" content="noindex,follow" data-pre="1" />` : "",
    `<meta property="og:type" content="${ogType}" data-pre="1" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" data-pre="1" />`,
    `<meta property="og:url" content="${esc(canonical)}" data-pre="1" />`,
    `<meta property="og:title" content="${esc(title)}" data-pre="1" />`,
    `<meta property="og:description" content="${esc(desc)}" data-pre="1" />`,
    `<meta property="og:image" content="${esc(ogImage)}" data-pre="1" />`,
    `<meta name="twitter:card" content="summary_large_image" data-pre="1" />`,
    `<meta name="twitter:title" content="${esc(title)}" data-pre="1" />`,
    `<meta name="twitter:description" content="${esc(desc)}" data-pre="1" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" data-pre="1" />`,
    ...schemas.map(jsonLd),
  ]
    .filter(Boolean)
    .join("\n    ");

  let html = template.replace(/<title>[\s\S]*?<\/title>/, "");
  html = html.replace(/<meta name="description"[^>]*>\s*/, "");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div class="prerender">${NAV}<main>${body}</main></div></div>`,
  );
  return html;
}

function write(route, html) {
  const file = route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
  const out = path.join(publicDir, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  written.push(route);
}

const written = [];
const romanceBooks = BOOKS.filter((b) => ROMANCE_LANES.includes(b.lane));

function bookList(lane) {
  const books = BOOKS.filter((b) => b.lane === lane).sort(
    (a, b) => (a.series_position ?? 999) - (b.series_position ?? 999),
  );
  return `<ol>${books
    .map(
      (b) =>
        `<li><a href="/books/${b.slug}">${esc(b.title)}</a>${b.position_label ? ` (${esc(b.position_label)})` : ""}: ${esc(b.tagline)}</li>`,
    )
    .join("")}</ol>`;
}

const FREE_PREQUELS = `<p>Both series start free: <a href="https://dl.bookfunnel.com/kw1yge3479">The First Acquisition</a> (Hudson Dynasty prequel) and <a href="https://dl.bookfunnel.com/xrodg0t77p">The Billionaire&rsquo;s One Night Stand</a> (Manhattan Money Kings prequel).</p>`;

// ── Home ───────────────────────────────────────────────────────────────────
write(
  "/",
  renderPage({
    route: "/",
    title: "Reese Astor | Steamy Billionaire Romance Set in Manhattan",
    description: sd.AUTHOR_DESCRIPTION,
    schemas: [sd.websiteSchema(), sd.personSchema(), ...sd.romanceSeriesSchemas()],
    body: `<h1>Reese Astor</h1><p>${esc(sd.AUTHOR_DESCRIPTION)}</p>${ROMANCE_LANES.map(
      (lane) => `<section><h2>${esc(LANE_META[lane].title)}</h2><p>${esc(LANE_META[lane].subtitle)}</p>${bookList(lane)}</section>`,
    ).join("")}${FREE_PREQUELS}<p><a href="/newsletter">Join the newsletter</a></p>`,
  }),
);

// ── Books catalog ──────────────────────────────────────────────────────────
write(
  "/books",
  renderPage({
    route: "/books",
    title: "Reese Astor Books in Reading Order",
    description:
      "Every Reese Astor book in reading order: the Hudson Dynasty and the Manhattan Money Kings. Steamy billionaire romance, each book a standalone with a happy ending.",
    schemas: [
      ...sd.romanceSeriesSchemas(),
      sd.breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Books", path: "/books" },
      ]),
    ],
    body: `<h1>Books by Reese Astor</h1>${Object.keys(LANE_META)
      .map((lane) => `<section id="${lane.replace(/_/g, "-")}"><h2>${esc(LANE_META[lane].title)}</h2><p>${esc(LANE_META[lane].subtitle)}</p>${bookList(lane)}</section>`)
      .join("")}${FREE_PREQUELS}`,
  }),
);

// ── Book pages ─────────────────────────────────────────────────────────────
for (const book of BOOKS) {
  const lane = LANE_META[book.lane];
  const siblings = BOOKS.filter((b) => b.lane === book.lane && b.slug !== book.slug);
  const facts = [
    `<li>Series: ${esc(lane.title)}${book.position_label ? `, ${esc(book.position_label)}` : ""}</li>`,
    book.tropes?.length ? `<li>Tropes: ${esc(book.tropes.join(", "))}</li>` : "",
    book.characters?.length ? `<li>Leads: ${esc(book.characters.join(" and "))}</li>` : "",
    book.publication_date ? `<li>Published: ${esc(book.publication_date)}</li>` : "",
    bookFallbackFactsHtml(book, { esc }),
  ].join("");
  const buy = bookFallbackBuyHtml(book, { esc, withAmazonTag });
  const bookBody = `<article><h1>${esc(book.title)}</h1><p><em>${esc(book.tagline)}</em></p><img src="${esc(book.cover_image)}" alt="${esc(book.title)} by Reese Astor, cover" width="400" height="600" /><p>${esc(book.blurb)}</p><ul>${facts}</ul><p>${buy}</p>${
    siblings.length
      ? `<h2>More in ${esc(lane.title)}</h2><ul>${siblings.map((b) => `<li><a href="/books/${b.slug}">${esc(b.title)}</a></li>`).join("")}</ul>`
      : ""
  }</article>`;
  // Fail the build rather than ship an untagged Amazon link or the retired subscription line.
  const problems = fallbackProblems(bookBody);
  if (problems.length) throw new Error(`[prerender] /books/${book.slug}: ${problems.join("; ")}`);
  write(
    `/books/${book.slug}`,
    renderPage({
      route: `/books/${book.slug}`,
      title: `${book.title} by Reese Astor | ${lane.title}${book.position_label ? ` ${book.position_label}` : ""}`,
      description: `${book.tagline} ${book.blurb}`,
      ogType: "book",
      image: book.cover_image_square ?? book.cover_image,
      schemas: [
        sd.bookSchema(book),
        sd.breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Books", path: "/books" },
          { name: book.title, path: `/books/${book.slug}` },
        ]),
      ],
      body: bookBody,
    }),
  );
}

// ── Static info pages ──────────────────────────────────────────────────────
const simple = [
  {
    route: "/about",
    title: "About Reese Astor | Billionaire Romance Author",
    description: sd.AUTHOR_DESCRIPTION,
    schemas: [sd.personSchema()],
    body: `<h1>About Reese Astor</h1><p>${esc(sd.AUTHOR_DESCRIPTION)}</p>${ROMANCE_LANES.map((l) => `<h2>${esc(LANE_META[l].title)}</h2>${bookList(l)}`).join("")}${FREE_PREQUELS}`,
  },
  {
    route: "/free-book",
    title: "Free Book: The First Acquisition | Reese Astor",
    description:
      "Start the Hudson Dynasty free. The First Acquisition: Sebastian Hudson, Arden Shaw, and one fake engagement.",
    schemas: [],
    body: `<h1>Start free</h1>${FREE_PREQUELS}`,
  },
  {
    route: "/newsletter",
    title: "The Reese Astor Newsletter",
    description:
      "New release alerts, reader-only extras, and a free prequel when you join. One email every other Sunday.",
    schemas: [],
    body: `<h1>The Reese Astor Newsletter</h1><p>New release alerts and reader-only extras, every other Sunday.</p>${FREE_PREQUELS}`,
  },
  {
    route: "/blog",
    title: "Blog | Reese Astor",
    description: "Notes from Reese Astor: the money terms behind the books, reading lists, and behind-the-scenes posts.",
    schemas: [],
    body: `<h1>Blog</h1><p>The money terms behind the books, reading lists, and behind-the-scenes posts.</p>`,
  },
  {
    route: "/press",
    title: "Press Kit | Reese Astor",
    description: "Bio, covers, and media contact for Reese Astor, author of steamy billionaire romance.",
    schemas: [sd.personSchema()],
    body: `<h1>Press kit</h1><p>${esc(sd.AUTHOR_DESCRIPTION)}</p>`,
  },
  {
    route: "/contact",
    title: "Contact | Reese Astor",
    description: "Contact Reese Astor for reader questions, media and rights inquiries, and ARC requests.",
    schemas: [],
    body: `<h1>Contact</h1><p>Reader questions, media and rights inquiries, and ARC requests.</p>`,
  },
];
for (const page of simple) write(page.route, renderPage(page));

// ── Blog posts (optional, needs DATABASE_URL at build) ─────────────────────
const RETIRED = new Set(
  (fs.readFileSync(path.join(root, "shared/const.ts"), "utf8").match(/RETIRED_BLOG_SLUGS = \[([\s\S]*?)\]/)?.[1] ?? "")
    .match(/"([^"]+)"/g)
    ?.map((s) => s.slice(1, -1)) ?? [],
);

function mdToHtml(md = "") {
  return md
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (!t) return "";
      const h = t.match(/^(#{1,4})\s+(.*)$/);
      if (h) return `<h${Math.min(h[1].length + 1, 4)}>${esc(h[2])}</h${Math.min(h[1].length + 1, 4)}>`;
      return `<p>${esc(t.replace(/[*_`]/g, "")).replace(/\n/g, " ")}</p>`;
    })
    .join("");
}

const blogPosts = [];
if (process.env.DATABASE_URL) {
  try {
    const { default: pg } = await import("pg");
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
    });
    await client.connect();
    const { rows } = await client.query(
      `select slug, title, excerpt, content, "featuredImage", "metaDescription", "publishedAt", "updatedAt"
         from blog_posts where published = 'published' order by "publishedAt" desc nulls last`,
    );
    await client.end();
    for (const p of rows) if (!RETIRED.has(p.slug)) blogPosts.push(p);
  } catch (err) {
    console.warn(`[prerender] Blog posts skipped: ${err.message}`);
  }
}
for (const p of blogPosts) {
  const route = `/blog/${p.slug}`;
  const published = p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined;
  const modified = p.updatedAt ? new Date(p.updatedAt).toISOString() : published;
  write(
    route,
    renderPage({
      route,
      title: `${p.title} | Reese Astor`,
      description: p.metaDescription || p.excerpt || p.title,
      ogType: "article",
      image: p.featuredImage || undefined,
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.metaDescription || p.excerpt,
          url: absoluteUrl(route),
          ...(p.featuredImage ? { image: absoluteUrl(p.featuredImage) } : {}),
          ...(published ? { datePublished: published } : {}),
          ...(modified ? { dateModified: modified } : {}),
          author: { "@id": `${SITE_URL}/#author`, "@type": "Person", name: SITE_NAME },
          publisher: { "@type": "Organization", name: "88Away LLC", url: SITE_URL },
          mainEntityOfPage: absoluteUrl(route),
        },
        sd.breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: p.title, path: route },
        ]),
      ],
      body: `<article><h1>${esc(p.title)}</h1><p><em>${esc(p.excerpt)}</em></p>${mdToHtml(p.content)}</article>`,
    }),
  );
}

// ── llms.txt (https://llmstxt.org) ─────────────────────────────────────────
const llms = [
  `# ${SITE_NAME}`,
  "",
  `> ${sd.AUTHOR_DESCRIPTION}`,
  "",
  "Reese Astor is a pen name. Books are published by 88Away LLC. Each book is a standalone romance with a happy ending; series are best read in the order below.",
  "",
  ...ROMANCE_LANES.flatMap((lane) => [
    `## ${LANE_META[lane].title}`,
    "",
    LANE_META[lane].subtitle,
    "",
    ...BOOKS.filter((b) => b.lane === lane)
      .sort((a, b) => (a.series_position ?? 999) - (b.series_position ?? 999))
      .map(
        (b) =>
          `- [${b.title}](${SITE_URL}/books/${b.slug}): ${b.position_label ?? ""}${b.position_label ? ". " : ""}${b.tropes?.length ? `Tropes: ${b.tropes.join(", ")}. ` : ""}${b.characters?.length ? `Leads: ${b.characters.join(" and ")}. ` : ""}${b.kindle_unlimited ? "In Kindle Unlimited." : ""}`.trim(),
      ),
    "",
  ]),
  "## Start free",
  "",
  "- [The First Acquisition](https://dl.bookfunnel.com/kw1yge3479): free Hudson Dynasty prequel",
  "- [The Billionaire's One Night Stand](https://dl.bookfunnel.com/xrodg0t77p): free Manhattan Money Kings prequel",
  "",
  "## Pages",
  "",
  `- [All books](${SITE_URL}/books)`,
  `- [About Reese Astor](${SITE_URL}/about)`,
  `- [Newsletter](${SITE_URL}/newsletter)`,
  `- [Blog](${SITE_URL}/blog)`,
  ...blogPosts.slice(0, 30).map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})`),
  "",
].join("\n");
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(
  `[prerender] Wrote ${written.length} page(s) (${romanceBooks.length} romance titles, ${blogPosts.length} blog posts) + llms.txt`,
);
