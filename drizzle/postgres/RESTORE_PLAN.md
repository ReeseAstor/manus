# Data restore plan

Do not run this. The schema catch-up creates missing tables empty. This note is the plan for putting reader-facing rows back, after the owner decides to. No insert here is approved, and this PR does not connect to production.

Empty tables stop the 500s. They do not put tier cards, Join buttons, stories, or shop books on the page. Do not take VIP payments until the tiers, the Stripe prices, the stories, and working audio are all in place.

## vip_tiers

The old rows are not in the production Postgres database this app uses now. They are in the old TiDB/MySQL query logs committed under `.manus/db/`. Those logs name the TiDB Cloud host. They are historical statements, not a live connection, and this plan does not open one.

| What | Where |
|---|---|
| The insert of Bronze, Silver, and Gold | `.manus/db/db-query-1767511437460.json` |
| The three rows as they were stored, before Stripe ids | `.manus/db/db-query-1768254434229.json` |
| The later update that set the Stripe price ids | `.manus/db/db-query-1768273561543.json` |
| The read-back of those price ids | `.manus/db/db-query-1768273570035.json` |
| The same feature promises, written again for the products table | `scripts/add-vip-products.mjs` |

Prices in those logs, in cents: Bronze 999, Silver 1999, Gold 2999.

Stripe price ids to verify in the live Stripe account before any restore. Confirm each id exists, is live mode, is active, and bills that amount:

| Tier | Price id in the old log |
|---|---|
| Bronze | `price_1SoxraKiQaEeeJopaigc8GAX` |
| Silver | `price_1SoxsEkiQaEeeJopRtehIuaL` |
| Gold | `price_1SoxsoKiQaEeeJopovyT8VUh` |

Re-review the feature copy before it is shown again. The old JSON promises counts and a voice feature that the current library cannot support:

- Bronze: "Access to 10+ steamy audio stories", "New story added monthly"
- Silver: "Access to 25+ steamy audio stories", "2 new stories monthly"
- Gold: "Unlimited story access", "3 new stories monthly", "Custom story requests (2/month)", "Personalized voice messages", "Exclusive Gold-only stories", "Direct author Q&A access"

The logs only show five story rows, and their audio URLs return 403. Restoring this copy would advertise 10+, 25+, and a monthly cadence the site does not have. Leave the features text for the owner to rewrite. Do not insert it as-is.

`vip.subscribe` looks up `vip_tiers` by slug before it creates a Checkout session. With an empty table the Join buttons have nothing to render and the bottom call to action cannot find `bronze`.

## steamy_stories

A partial copy of the old rows is in `.manus/db/db-query-1768274626019.json` (`SELECT * FROM steamy_stories LIMIT 5`). The result set has four row objects plus story 3 in the raw stdout. `scripts/add-vip-stories.mjs` expected full text in `/home/ubuntu/story-boardroom-confession.md`, `/home/ubuntu/story-midnight-chen-tech.md`, and `/home/ubuntu/story-three-years-later.md`. Those files are not in this repo.

| id | Title | Slug | minTier | Full audio | Preview |
|---|---|---|---|---|---|
| 1 | The Penthouse Reunion | `the-penthouse-reunion` | 1 | `.../audio/vip-stories/story-1-1767643415899-0gno1.mp3` | `.../audio/vip-previews/story-1-preview-1767654006819-tdnzg.mp3` |
| 2 | Late Night at Chen Technologies | `late-night-chen-technologies` | 1 | `.../audio/vip-stories/story-2-1767643432416-o5k77e.mp3` | `.../audio/vip-previews/story-2-preview-1767654010955-odlqto.mp3` |
| 3 | Three Years Later | (in the same log's stdout) | 1 | `.../audio/vip-stories/story-3-1767643453419-exh0g.mp3` | `.../audio/vip-previews/story-3-preview-1767654014754-1m4kw.mp3` |
| 4 | The Charity Gala | `the-charity-gala` | 2 | `.../audio/vip-stories/story-4-1767643476471-upnc0q.mp3` | `.../audio/vip-previews/story-4-preview-1767654019056-qgodv8.mp3` |
| 5 | The Private Jet | `the-private-jet` | 3 | `.../audio/vip-stories/story-5-1767643498291-ua9lel.mp3` | `.../audio/vip-previews/story-5-preview-1767654022485-rbb5lf.mp3` |

Every audio and preview URL is on `d2xsxph8kpxj0f.cloudfront.net` under the Manus path `310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/`. Those objects return 403. `audioDuration` is null on the rows in that log. Restoring the URL does not restore playback.

Re-host or replace all ten files (five full, five preview) before the library is offered. That is a hosting and voice-policy decision, not a SQL decision. The story text in the log for several rows is a placeholder (`Full story content here...`), so the log is an inventory, not a publishable archive.

## products

`stripe.getProducts` reads the `products` table. After the catch-up that table is empty, so checkout product data is an empty list rather than a 500.

Do not load `seed-products.mjs` as-is. It includes off-catalog items, including "Write Your Own Billionaire Romance Masterclass" at 29700 cents. `scripts/add-vip-products.mjs` repeats the tier promises above and leaves `stripePriceId` null.

Use the Stripe dashboard as the source. Restore a product row only for something that is actually for sale, with a live-mode price id the owner has confirmed. The three VIP price ids in the table above are the ones to check first. They are not confirmed from this PR.

## books, and the shop

`books.list` is what `/shop` used for "Start with any book in the series." The static catalog at `client/src/data/books.ts` is what `/books` already renders, and it does not need the `books` table. A separate PR points the shop grid at that catalog.

`seed-books.ts` inserts only three titles: The Billionaire's Executive Assistant, The Billionaire's Fake Wife, and The Billionaire's Baby Secret. The static catalog has eight romance titles plus The Need for Permission. It does not include Golden Parachute, which the owner’s canon list names with the Hudson Dynasty books (The First Acquisition, Hostile Tender, Poison Pill, Golden Parachute) alongside the five Manhattan Money Kings titles (Executive Assistant, Fake Wife, Baby Secret, Forbidden Nanny, One Night Stand). Seeding from `seed-books.ts` would publish three of those nine and would not fill the shop.

`/books/audit-of-the-heart` is a separate page (`client/src/pages/AuditOfTheHeart.tsx`, also linked from `Books.tsx` and `HostileTender.tsx`). It is not in `client/src/data/books.ts` and it is not one of those nine titles. The cover and the video poster are the Manus CloudFront object `audit-of-the-heart-cover-v2-CiyiXxZuMB4J9rT8axkMQv.webp`, which returns 403. An old TiDB insert for that title is in `.manus/db/db-query-1774119901444.json`, marked Coming Soon, and it is not evidence that the book is a live KDP title. Whether that URL stays public is the owner's call. This plan does not unpublish it.

## exclusive_content

`/reader-club` can show its empty state ("New exclusive content coming soon!") once the table exists. Filling it is optional. `seed-exclusive-content.ts` has three items, and further copies are in the `.manus/db` logs. Review them before inserting.

## Order, once the owner says yes

1. Backup and the duplicate pre-check in `SCHEMA_CATCHUP.md`.
2. `psql "$OWNER_URL" -v ON_ERROR_STOP=1 -f drizzle/postgres/schema-catchup.sql`
3. `psql "$OWNER_URL" -v ON_ERROR_STOP=1 -f drizzle/postgres/0028_ai_rate_limits.sql`
4. Confirm `story_play_history_user_story_idx` exists before deploying PR #55. The catch-up creates it. `0029_story_play_history_unique.sql` is the same index with a duplicate stop, for a run that only adds the index.
5. Rewrite tier copy, verify the three live Stripe prices, re-host the ten audio files, then insert tiers and stories. Products come from Stripe, not from `seed-products.mjs`. Books on `/shop` come from the static catalog, not from `seed-books.ts`.
