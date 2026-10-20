-- Postgres catch-up for shared rate-limit counters.
-- Do not apply this from the application, and do not run it as part of this PR.
-- drizzle/meta/_journal.json is still dialect "mysql", so `drizzle-kit migrate`
-- will not pick up this file. Apply it once, by hand, to the production database
-- that DATABASE_URL points at, before deploying the spend gate.
--
-- Privilege required to run this script: CREATE on schema public, plus USAGE
-- on that schema. That is what a runtime CREATE TABLE would also have needed.
-- After the table exists, the application role needs only SELECT, INSERT, and
-- DELETE on ai_rate_limits. It does not issue CREATE, ALTER, or DROP.
--
-- Rollback (drops only this new table; no other data is involved):
--   DROP TABLE IF EXISTS ai_rate_limits;
-- Data risk: additive. The table starts empty. Existing rows are not read or changed.

CREATE TABLE IF NOT EXISTS ai_rate_limits (
  id SERIAL PRIMARY KEY,
  "bucketId" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_rate_limits_bucket_created_idx
  ON ai_rate_limits ("bucketId", "createdAt");
