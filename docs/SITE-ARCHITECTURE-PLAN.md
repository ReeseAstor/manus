# reeseastor.com — Architecture, SEO and GEO Plan

Last reviewed 10/21/2026. Scope: the `manus` repo (Vite + React SPA, Express/tRPC API, deployed on Vercel). Phase 1 ships in the PR that adds this file. Phases 2–4 are the plan for what follows.

## 1. Where the site stands

The site has the right raw pieces: a single catalog file (`client/src/data/books.ts`), a working blog, BookFunnel lead magnets, and a build guard that keeps admin code and retired copy out of the public bundle. Three problems held it back.

**Crawlers and AI engines saw nothing.** Every URL returned the same 1.3 KB HTML shell with an empty `<div id="root">`. GPTBot, ClaudeBot, PerplexityBot and social link previews don't run JavaScript, so to them every page was the home page with a generic title. Canonical tags were also malformed on six pages (`https://reeseastor.comhttps://…`), and JSON-LD never reached the page because Helmet drops `dangerouslySetInnerHTML`.

**The content contradicted the books and the pen name.**
- The footer, page titles and meta descriptions claimed "USA Today bestselling."
- The About, Press and blog author boxes described a former corporate finance VP.
- A published blog post said the pen name protected a corporate identity.
- The Hudson Dynasty pages paired the wrong couples and called Hostile Tender "Book 2."
- "Audit of the Heart," an old working title, was live.
- Golden Parachute was missing.
- The Manhattan Money Kings were numbered 1–5 with the prequel counted as Book 1.
- Seven fabricated reviews were in the seed data.
- The shop had a countdown timer that reset every month.

**Feature sprawl on a one-person site.** The site carries a VIP club, an audio library, SMS, two quizzes, an AI studio, a writing studio, a command center, affiliate and partner programs, and a direct shop. Several are half-finished:
- Paid VIP subscriptions never create a membership.
- Five AI generation endpoints were open to anyone.
- Twilio webhooks accepted unsigned requests.

## 2. Target information architecture

The site should do three jobs, in this order: (1) answer "who is Reese Astor and what should I read first?" for readers, search engines and AI assistants; (2) turn visitors into newsletter subscribers through the two free prequels; (3) send buyers to Amazon/KU. Everything else is optional.

```
/                         Home: who she is, two series, two free prequels, newsletter
/books                    Catalog in reading order (BookSeries schema)
/books/<slug>             One page per title (Book schema, prerendered)
/series/hudson-dynasty    (Phase 2) series hub: reading order, family tree, FAQ
/series/manhattan-money-kings
/free-book                Free prequel landing (BookFunnel)
/newsletter               "The Inner Circle" signup
/blog                     "The Fine Print" index
/blog/<slug>              Posts (BlogPosting schema, prerendered at build)
/about  /press  /contact  /privacy  /terms
/romance-quiz             Keep (no AI dependency)
— account / transactional pages: noindex
```

**Retire or freeze** (Phase 3, owner decision), in order of maintenance cost:
- The VIP club and audio library: broken membership grant, mock stats, 2,100 lines.
- SMS: TCPA exposure.
- `/quiz`: makes an AI call.
- AI Studio, Writing Studio, Command Center, Switchy admin.
- The partner program.

The direct shop can stay if it sells. Its bundle names should then match the Stripe products.

## 3. SEO and GEO strategy

GEO (generative engine optimization) is about being the source an AI assistant cites when a reader asks "best billionaire romance with a fake engagement" or "what order should I read the Hudson Dynasty books?" Assistants reward pages that are fetchable without JS, state facts plainly, use consistent entities, and agree with the other sources they check (Amazon, Goodreads, BookBub).

1. **Fetchable HTML.** Every public route is prerendered at build time with its own head, JSON-LD and readable body copy (`scripts/prerender-static.mjs`). React replaces that body on load. Blog posts are prerendered when `DATABASE_URL` is available to the Vercel build.
2. **One entity graph.** One `Person` (`https://reeseastor.com/#author`) with `sameAs` to Amazon, Goodreads and BookBub. Under it sit a `WebSite`, two `BookSeries` with `hasPart`, and one `Book` per title. Each `Book` carries `isPartOf`, `position`, characters, tropes as keywords, an Amazon `sameAs`, and an offer. All of it is built from `books.ts` in `client/src/data/structured-data.ts`, so the client and the prerender can't drift apart.
3. **Facts that match Amazon.** Titles, series positions, leads, heat, KU status and prices come from the catalog record. Unverifiable claims are blocked at build time (`scripts/seal-admin-chunks.mjs` fails the build on "USA Today," "finance VP" and similar).
4. **llms.txt.** `/llms.txt` gives assistants the author summary, both reading orders with canonical URLs, the free prequels and recent posts.
5. **Crawl policy.** `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended and Applebot-Extended on public pages. Account and transactional paths are disallowed. The sitemap is generated from the catalog plus published posts, with real `lastmod` values.
6. **One host.** `reeseastor.com` is canonical. `www` 301s to it.
7. **Content that answers reader questions** (Phase 2, via the existing Sunday-letter autopilot):
   - reading-order pages;
   - "if you liked X" trope pages (fake engagement, enemies to lovers, secret baby, single dad, class divide);
   - the "Deal Terms, Translated" posts that explain each title's finance term.

   Each post links to one book, and each book links back to its posts.
8. **Off-site consistency** (owner):
   - Fix the BookBub series name ("Manhattan Billionaires" vs "Manhattan Money Kings").
   - Make the Goodreads series pages match the reading order.
   - Use the same one-line bio everywhere.

## 4. Roadmap

### Phase 1 (this PR): truth, crawlability, safety

- [x] Catalog rebuilt from canon:
  - correct couples and numbering;
  - Golden Parachute added;
  - ASINs added;
  - self-hosted covers;
  - Amazon/Manus hot-links removed from Home and the book pages.
- [x] Wrong-canon pages removed (bespoke Hostile Tender, Audit of the Heart), with 301s to the right titles.
- [x] Unverifiable claims and identity leaks removed:
  - USA Today claims;
  - finance-VP bio;
  - coaching copy;
  - inflated reader counts;
  - fake reviews;
  - the countdown timer.
- [x] Eight off-brand or leaking blog posts retired, with 301s to `/blog`.
- [x] SEO plumbing:
  - canonical/OG fix;
  - JSON-LD fix;
  - shared `SITE_URL`;
  - `name=` Twitter tags;
  - noindex on soft 404s;
  - catalog-driven sitemap;
  - AI-crawler robots;
  - `llms.txt`;
  - immutable cache headers for hashed assets;
  - analytics placeholder no longer ships;
  - zoom no longer blocked.
- [x] Build-time prerender for all public routes, plus `app-shell.html` for everything else.
- [x] Security:
  - Twilio webhooks fail closed without a signature;
  - AI generation endpoints and affiliate analytics are admin-only;
  - the login redirect rejects `//host`.
- [x] Build guard extended to block these claims and leaks from coming back.

### Phase 2: brand and content (2–3 weeks, async)

- Reskin the public pages to the 10/2026 brand: dusty rose / pearl / cocoa, Bodoni Moda, Cormorant Garamond, IBM Plex Mono, no black. Replace `author-kit/tokens.ts` and `colors_and_type.css` first, then sweep the hard-coded `#d4af37` / `#0a0e1a` / `bg-black` values (43 and 13 files). Fonts drop from 15 weights to 6.
- Build the Inner Circle signup page and The Fine Print blog index from the brand-kit boards.
- Add `/series/*` hubs with reading-order FAQ schema.
- Move the remaining `files.manuscdn.com` / CloudFront images into `client/public`.
- Return a real 404 status for unknown URLs: an edge middleware with the known-route list.
- Make the blog prerender run on Vercel by exposing `DATABASE_URL` to the build.

### Phase 3: simplify (owner decisions)

- Decide on the VIP club. If it stays, the Stripe webhook must create, update and cancel memberships, and return 500 on failure so Stripe retries. If it goes, remove the pages, routers and tables.
- Decide on SMS. If it stays, reuse the full `/sms` disclosure next to every opt-in checkbox.
- Remove the AI Studio, Writing Studio, Command Center and Switchy admin if they're unused.
- Move every admin endpoint to `adminProcedure`.
- Remove the Manus OAuth and forge dependencies: the contact form should send through Resend, and storage should move to Supabase Storage.
- Remove `railway.json` once Railway is confirmed off.

### Phase 4: repo hygiene

- Archive the MySQL-era `drizzle/*.sql` and introspect a fresh Postgres baseline.
- Move root notes to `/docs` and seed scripts to `/scripts`.
- Take manuscript material (`series-bible/`, `audio-scripts/`, `steamy-audio-scenes*.md`) out of the repo.
- Split tests that hit live services into `pnpm test:live`.

## 5. Owner checklist after merge

1. In Vercel → Domains, confirm `reeseastor.com` is primary. `vercel.json` now 301s `www` to it, so don't set the opposite redirect there.
2. In Vercel → Settings → Environment Variables, make `DATABASE_URL` available to Build so blog posts are prerendered.
3. The two free prequels link to BookFunnel only (no Amazon button), so the free download feeds the newsletter rather than a $0.99 sale. KU status is set from the owner's confirmation (10/2026): every romance title is in Kindle Unlimited except the two free prequels, The First Acquisition and The Billionaire's One Night Stand. Update `kindle_unlimited` in `books.ts` if enrollment changes.
4. Add Golden Parachute's and Poison Pill's ASINs to `books.ts`. Golden Parachute links to an Amazon search until then.
5. Confirm whether *The Need for Permission* is a Reese Astor title. It is left unchanged in this PR.
6. Purge old rows in the live database: seeded fake reviews (`book_reviews`), and the "Audit of the Heart" row in `books` if present.
7. The About page photo shows a woman in front of a Christmas tree, presented as the author. Decide whether the pen name should have a face at all; the seal monogram is the safer default.
8. Submit `https://reeseastor.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Bing feeds several AI assistants.
