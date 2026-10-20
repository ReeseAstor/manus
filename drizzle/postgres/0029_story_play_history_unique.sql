-- Play-progress unique index for PR #55.
-- Not applied. The app does not run this file.
-- Deploy PR #55 only after this index exists. Without it, updatePlayProgress
-- fails: there is no unique constraint matching the ON CONFLICT target.
-- The schema catch-up in PR #56 creates the same index as its last statement.
-- Running both is safe because of IF NOT EXISTS.
--
-- Requires story_play_history to already exist.
-- Stops when duplicate (userId, storyId) groups exist. Does not delete rows.
-- Collapse those groups by hand, keeping the greatest progress, then rerun.
--
-- psql "$OWNER_URL" -v ON_ERROR_STOP=1 -f drizzle/postgres/0029_story_play_history_unique.sql

DO $$
DECLARE n int;
BEGIN
  IF to_regclass('public.story_play_history') IS NULL THEN
    RAISE EXCEPTION 'story_play_history does not exist. Run drizzle/postgres/schema-catchup.sql first.';
  END IF;

  EXECUTE $q$
    SELECT count(*) FROM (
      SELECT 1 FROM story_play_history
      GROUP BY "userId", "storyId"
      HAVING count(*) > 1
    ) d
  $q$ INTO n;

  IF n > 0 THEN
    RAISE EXCEPTION 'DUPLICATES in story_play_history ("userId", "storyId"): % groups. Collapse them by hand, keeping the greatest progress, then rerun. This file does not delete rows.', n;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "story_play_history_user_story_idx"
  ON "story_play_history" ("userId", "storyId");
