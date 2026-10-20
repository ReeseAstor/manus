-- Postgres catch-up for shared rate-limit counters.
-- Do not apply this from the application, and do not run it as part of this PR.
-- drizzle/meta/_journal.json is still dialect "mysql", so `drizzle-kit migrate`
-- will not pick up this file. Apply it once, by hand, to the production database
-- that DATABASE_URL points at, before deploying the spend gate.
--
-- Privilege required to run this script: CREATE on schema public, plus USAGE
-- on that schema. That is what a runtime CREATE TABLE would also have needed.
-- After the table exists, the application role needs SELECT, INSERT, and UPDATE
-- on ai_rate_limits. The limiter is one INSERT ... ON CONFLICT DO UPDATE per
-- bucket. It does not issue CREATE, ALTER, DROP, or DELETE.
--
-- This replaces the earlier append-only draft of this file (one row per hit).
-- That draft was not applied. If it was, drop it before running this version:
--   DROP TABLE IF EXISTS ai_rate_limits;
--
-- Rollback (drops only this new table; no other data is involved):
--   DROP TABLE IF EXISTS ai_rate_limits;
-- Data risk: additive. The table starts empty. Existing rows are not read or changed.
--
-- Each bucket is a single counter row. "windowStart" is a timestamp without
-- time zone holding the UTC wall clock from `now() AT TIME ZONE 'UTC'`.
-- The session TimeZone does not decide the window.

CREATE TABLE IF NOT EXISTS ai_rate_limits (
  "bucketId" VARCHAR(255) PRIMARY KEY,
  count INTEGER NOT NULL,
  "windowStart" TIMESTAMP NOT NULL
);
