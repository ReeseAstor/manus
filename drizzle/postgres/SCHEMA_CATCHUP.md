# Production Postgres schema catch-up

This file is a plan. Nothing in it has been run, and this PR does not change `DATABASE_URL` or any other environment variable.

The SQL is `schema-catchup.sql` in this directory. It was generated from `drizzle/schema.ts` on main (`a583f2a`) and then corrected so every camel-case enum type is quoted both when it is created and when a column uses it. An unquoted name is folded to lowercase (`aiRole` becomes `airole`) and does not match `"aiRole"`. The unquoted form failed 15 tables, including `products`.

The file is idempotent and additive. It contains no `DROP`, `DELETE`, `TRUNCATE`, or `UPDATE`.

`drizzle/meta/_journal.json` is still dialect `mysql`. `drizzle-kit migrate` will not apply this file. The checked-in `drizzle/*.sql` files use MySQL syntax and cannot be applied to this database as they are.

**This restores structure, not content.** After a clean run, `vip.getTiers`, `vip.getFeaturedStories`, `books.list`, `stripe.getProducts`, and `readerClub.getAllContent` can stop returning 500 while the pages stay empty. VIP checkout and the shop grid stay empty until data is restored. See `RESTORE_PLAN.md`. Do not take VIP payments against an empty library.

## What production is doing today

Checked against `https://www.reeseastor.com` on 2026-10-20. The HTTP 500 body includes the SQL text. The tRPC change in this PR stops that leak after it is deployed.

| Call | Result | What that shows |
|---|---|---|
| `blog.list` | 200, 15 posts | `blog_posts` exists. The returned keys match every column in the Drizzle `blog_posts` table. |
| `books.list` | 500 | Server log for this request contains Postgres `42P01`: `relation "books" does not exist`. |
| `vip.getTiers` | 500, query names `vip_tiers` | Same Drizzle "Failed query" wrapper. The handler does not log the Postgres cause, so this is not confirmed as a missing table versus a missing column. |
| `vip.getFeaturedStories` | 500, query names `steamy_stories` | Same limitation. The selected list includes `previewAudioUrl`. |
| `stripe.getProducts` | 500, query names `products` | Same limitation. |
| `readerClub.getAllContent` and `getFeaturedContent` | 500, query names `exclusive_content` | Same limitation. |

The other tables in `drizzle/schema.ts` were not probed. `CREATE TABLE IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` leave an existing table and an existing column alone.

## What the SQL does

1. Creates each Drizzle enum if the type name is absent, then adds any missing enum labels. Camel-case type names stay quoted.
2. Creates each of the 53 tables if it is absent, including primary keys and column defaults. Column types that are enums are quoted.
3. Adds any missing non-primary-key column, again with the enum type quoted. A new `NOT NULL` column is given `NOT NULL` only when the schema also has a default. A required column with no default is added nullable, because `NOT NULL` without a default fails on a table that already has rows.
4. Creates a unique index for each unique Drizzle column, if that index name is absent. That is 12 indexes, plus the play-history index below.
5. Creates `story_play_history_user_story_idx` on `("userId", "storyId")`. PR #55 also ships this statement as `drizzle/postgres/0029_story_play_history_unique.sql`, with its own duplicate stop. If the table already has two rows for the same member and story, this statement fails. This script does not delete those rows. Deploy #55 only after the index exists.

Foreign keys are not added. An orphan id would abort the script. Existing column types are not changed. If a table already has a Drizzle-named constraint (`*_unique`), this file adds a second `*_key` index. That second index is redundant and does not change rows.

`ai_rate_limits` is not in this file. It is `drizzle/postgres/0028_ai_rate_limits.sql` on PR #54. Run that file after this one.

## Privilege

Run it as the database owner. The runtime role does not need `CREATE` for this plan, and the application does not run this file.

Required privilege: `CREATE` and `USAGE` on schema `public`, and `ALTER` on every table that already exists.

## Backup, before anything else

Neon preview branches are already at the account limit, which is why Vercel previews fail with "Resource provisioning failed." Creating another branch can fail until a stale preview branch is deleted.

Do one of these, and confirm it finished, before the pre-check or the catch-up:

1. Free a Neon branch slot, then `neon branches create --name pre-catchup-20261020`.
2. Or, from a machine that already has the owner URL in the environment and does not print it: `pg_dump -Fc "$OWNER_URL" -f pre-catchup.dump`, then `ls -lh pre-catchup.dump` and confirm the file is non-empty.

Neon point-in-time recovery is the fallback if both of those fail. Do not start the catch-up without one of them.

## Pre-check (read-only)

Run this as the owner before the catch-up. Stop if the duplicate block warns. It does not change rows.

```sql
-- 1. Inventory: what exists today, and how many rows
SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY relname;
SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
 WHERE n.nspname = 'public' AND t.typtype = 'e' ORDER BY 1;

-- 2. Duplicates that would block each unique index (only for tables that exist)
DO $$ DECLARE r record; n int; BEGIN
 FOR r IN SELECT * FROM (VALUES
  ('blog_posts','"slug"'),('books','"slug"'),('exclusive_content','"slug"'),
  ('newsletter_subscribers','"email"'),('reader_club_members','"email"'),('sms_templates','"slug"'),
  ('steamy_stories','"slug"'),('user_preferences','"userId"'),('user_sms_preferences','"userId"'),
  ('users','"openId"'),('vip_members','"userId"'),('vip_tiers','"slug"'),
  ('story_play_history','"userId","storyId"')) v(tbl, cols)
 LOOP
  IF to_regclass('public.'||r.tbl) IS NOT NULL THEN
   EXECUTE format('SELECT count(*) FROM (SELECT 1 FROM %I GROUP BY %s HAVING count(*) > 1) d', r.tbl, r.cols) INTO n;
   IF n > 0 THEN RAISE WARNING 'DUPLICATES in %(%): % groups', r.tbl, r.cols, n; END IF;
  END IF;
 END LOOP; END $$;
```

`n_live_tup` is an estimate. A warning means that unique index will stop the file. Collapse those groups by hand. This plan does not delete them.

## Run command

Autocommit is required. Do not wrap the file in `BEGIN`, and do not pass `--single-transaction`. `ALTER TYPE ... ADD VALUE` cannot be used in the same transaction as later statements on older Postgres, and a single batch fails with `unsafe use of new value` when an existing enum is missing a label.

```sh
psql "$OWNER_URL" -v ON_ERROR_STOP=1 -f drizzle/postgres/schema-catchup.sql
psql "$OWNER_URL" -v ON_ERROR_STOP=1 -f drizzle/postgres/0028_ai_rate_limits.sql
```

`0028_ai_rate_limits.sql` is on PR #54. Apply it after the catch-up. Until it exists, signup limits stay in memory and the spend features stay denied.

If #55's `0029_story_play_history_unique.sql` is applied on its own, the `story_play_history` table must already exist and the duplicate pre-check inside that file must pass. The catch-up's last statement creates the same index. Running both is safe because of `IF NOT EXISTS`. Deploy PR #55 only after that index exists.

`ADD COLUMN ... DEFAULT now() NOT NULL` rewrites a table that already has the column missing and rows present. `blog_posts` has 15 rows. Run off-peak anyway.

If a statement fails, the earlier statements are already committed. Fix the reported statement and run the file again. `IF NOT EXISTS` makes the earlier statements no-ops.

## Data risk

- Rows that already exist are not modified.
- A table that is missing, including `books`, is created empty. The 500 can stop while the page shows no books, no tiers, no stories, no products, or no reader-club entries. Content that lived in the old MySQL/TiDB database is not copied by this script.
- `blog_posts` already has the live posts. The script does not rewrite that table.
- New enum labels do not change existing values.
- Adding a nullable column does not backfill it.

## Rollback

Do not drop `blog_posts` or any other table that already has rows.

- A table this script created empty, such as `books` if it was absent, can be removed with `DROP TABLE` of that one table. That deletes only the empty table.
- A column this script added, and that is still empty, can be removed with `DROP COLUMN` of that column. That is destructive if anything has since written the column. Those statements are not in the SQL file.
- The play-history unique index can be removed with `DROP INDEX IF EXISTS "story_play_history_user_story_idx"`.
- An enum type can be dropped only when nothing uses it.

Restore from the `pg_dump` file or the Neon branch if a statement did more than you intended. Point-in-time recovery is the fallback.
