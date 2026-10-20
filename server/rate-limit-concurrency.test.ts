/**
 * Concurrency proof for the Postgres rate limiter.
 *
 * Skipped unless RATE_LIMIT_TEST_DATABASE_URL is set to a disposable Postgres
 * database (not production). Example:
 *   RATE_LIMIT_TEST_DATABASE_URL=postgres://ratelimit:ratelimit@127.0.0.1:5432/ratelimit
 * The suite opens 20 connections and creates ai_rate_limits if it is missing.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { consumeRateLimitSlot } from "./ai-usage";

const databaseUrl = process.env.RATE_LIMIT_TEST_DATABASE_URL;

describe.skipIf(!databaseUrl)("postgres rate limit concurrency", () => {
  let pool: pg.Pool;
  let db: ReturnType<typeof drizzle>;

  beforeAll(async () => {
    pool = new pg.Pool({
      connectionString: databaseUrl,
      max: 20,
      options: "-c TimeZone=Pacific/Kiritimati",
    });
    db = drizzle(pool);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_rate_limits (
        "bucketId" VARCHAR(255) PRIMARY KEY,
        count INTEGER NOT NULL,
        "windowStart" TIMESTAMP NOT NULL
      )
    `);
    await pool.query(`TRUNCATE ai_rate_limits`);
  });

  afterAll(async () => {
    await pool?.end();
  });

  it("lets at most 6 of 20 parallel requests through a limit of 6", async () => {
    const zone = await pool.query("SHOW TIME ZONE");
    expect(zone.rows[0].TimeZone).toBe("Pacific/Kiritimati");

    const results = await Promise.all(
      Array.from({ length: 20 }, () =>
        consumeRateLimitSlot((statement) => db.execute(statement), "quiz:race", 60 * 60 * 1000, 6),
      ),
    );
    const allowed = results.filter(Boolean).length;
    expect(allowed).toBeLessThanOrEqual(6);
    expect(allowed).toBe(6);

    const aligned = await pool.query(`
      SELECT abs(extract(epoch FROM ("windowStart" - (now() AT TIME ZONE 'UTC')))) < 5 AS utc_aligned
      FROM ai_rate_limits
      WHERE "bucketId" = 'quiz:race'
    `);
    expect(aligned.rows[0]?.utc_aligned).toBe(true);
  });

  it("resets the counter when the UTC window has elapsed", async () => {
    await pool.query(
      `INSERT INTO ai_rate_limits ("bucketId", count, "windowStart")
       VALUES ('quiz:expired', 6, (now() AT TIME ZONE 'UTC') - interval '2 hours')
       ON CONFLICT ("bucketId") DO UPDATE SET count = 6, "windowStart" = EXCLUDED."windowStart"`,
    );
    const allowed = await consumeRateLimitSlot(
      (statement) => db.execute(statement),
      "quiz:expired",
      60 * 60 * 1000,
      6,
    );
    expect(allowed).toBe(true);
    const row = await pool.query(
      `SELECT count FROM ai_rate_limits WHERE "bucketId" = 'quiz:expired'`,
    );
    expect(Number(row.rows[0].count)).toBe(1);
  });
});
