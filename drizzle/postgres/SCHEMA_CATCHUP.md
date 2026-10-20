# Production Postgres schema catch-up

This file is a plan. Nothing in it has been run, and this PR does not change `DATABASE_URL` or any other environment variable.

The SQL is `schema-catchup.sql` in this directory. It was generated from `drizzle/schema.ts` on main (`a583f2a`) and is idempotent and additive. It contains no `DROP`, `DELETE`, `TRUNCATE`, or `UPDATE`.

`drizzle/meta/_journal.json` is still dialect `mysql`. `drizzle-kit migrate` will not apply this file. The checked-in `drizzle/*.sql` files use MySQL syntax (`AUTO_INCREMENT`, backticks) and cannot be applied to this database as they are.

## What production is doing today

Checked against `https://www.reeseastor.com` on 2026-10-20. The HTTP 500 body includes the SQL text. That leak is what the tRPC change in this PR stops, after deploy.

| Call | Result | What that shows |
|---|---|---|
| `blog.list` | 200, 15 posts | `blog_posts` exists. The returned keys match every column in the Drizzle `blog_posts` table. |
| `books.list` | 500 | Server log for this request contains Postgres `42P01`: `relation "books" does not exist`. |
| `vip.getTiers` | 500, query names `vip_tiers` | Same Drizzle "Failed query" wrapper. The handler does not log the Postgres cause, so this is not confirmed as a missing table versus a missing column. |
| `vip.getFeaturedStories` | 500, query names `steamy_stories` | Same limitation. The selected list includes `previewAudioUrl`. |
| `stripe.getProducts` | 500, query names `products` | Same limitation. |
| `readerClub.getAllContent` and `getFeaturedContent` | 500, query names `exclusive_content` | Same limitation. |

The other 48 tables in `drizzle/schema.ts` were not probed. The script uses `CREATE TABLE IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS`, so a table that is already present is not recreated and a column that is already present is not altered.

## What the SQL does

1. Creates each Drizzle enum if the type name is absent, then adds any missing enum labels.
2. Creates each of the 53 tables if it is absent, including primary keys and column defaults.
3. Adds any missing non-primary-key column. A new `NOT NULL` column is given `NOT NULL` only when the schema also has a default. A required column with no default is added nullable, because `NOT NULL` without a default fails on a table that already has rows.
4. Creates a unique index for each unique Drizzle column, if that index name is absent.
5. Creates `story_play_history_user_story_idx` on `("userId", "storyId")`. That index is not in the main schema. PR #55 uses it for `ON CONFLICT` when saving listening progress. If that table already has two rows for the same member and story, this one statement fails. This script does not delete those rows.

Foreign keys are not added. An orphan id would abort the script. Existing column types are not changed. If `featured` is an integer and the app compares it to a boolean, this script will not fix that.

## Privilege

Run it as the database owner, with autocommit (do not wrap the file in `BEGIN`, because `ALTER TYPE ... ADD VALUE` cannot run inside a transaction on older Postgres).

Required privilege: `CREATE` and `USAGE` on schema `public`, and `ALTER` on every table that already exists. The Vercel runtime role does not need `CREATE` for this plan. The application does not run this file.

## Data risk

- Rows that already exist are not modified.
- A table that is missing, including `books`, is created empty. The 500 can stop while the page shows no books, no tiers, no stories, no products, or no reader-club entries. Content that lived in the old MySQL/TiDB database is not copied by this script.
- `blog_posts` already has the live posts. The script does not rewrite that table.
- New enum labels do not change existing values.
- Adding a nullable column does not backfill it.

## Rollback

Do not drop `blog_posts` or any other table that already has rows.

- A table this script created empty, such as `books` if it was absent, can be removed with `DROP TABLE` of that one table. That deletes only the empty table.
- A column this script added, and that is still empty, can be removed with `DROP COLUMN` of that column. That is destructive if anything has since written the column. It is not in the SQL file.
- The play-history unique index can be removed with `DROP INDEX IF EXISTS "story_play_history_user_story_idx"`.
- An enum type can be dropped only when nothing uses it.

Take a database backup before running the file. If a statement fails, the earlier statements are already committed. Fix the reported statement and run the file again. `IF NOT EXISTS` makes the earlier statements no-ops.
