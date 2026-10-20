/**
 * AI usage tracking and rate limits.
 *
 * Production stores the sliding windows in Postgres (`ai_rate_limits`) so
 * serverless instances share one counter. The table is created on first use.
 * If production has no DATABASE_URL, or the write fails, the request is denied.
 *
 * Tests and local dev (NODE_ENV other than production) keep an in-memory
 * window so they do not need a database.
 *
 * `pnpm start` outside Vercel must sit behind a proxy that overwrites
 * X-Forwarded-For. On Vercel, getClientKey prefers x-vercel-forwarded-for,
 * which the platform sets and clients cannot spoof.
 */
import { sql } from "drizzle-orm";
import { getDb } from "./db";

export type AiFeature =
  | "chat"
  | "workflow"
  | "image"
  | "video"
  | "prompt-enhance"
  | "quiz"
  | "voice-preview"
  | "signup"
  | "other";

export type AiStatus = "ok" | "rate-limited" | "error";

export interface AiUsageEntry {
  id: number;
  timestamp: number;
  feature: AiFeature;
  model: string;
  inputChars: number;
  outputChars: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  status: AiStatus;
  key: string;
}

interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  "gemini-1.5-flash": { inputPerMillion: 0.075, outputPerMillion: 0.30 },
  "gemini-2.0-flash": { inputPerMillion: 0.10, outputPerMillion: 0.40 },
  "gemini-2.5-flash": { inputPerMillion: 0.30, outputPerMillion: 2.50 },
  "gemini-2.5-pro": { inputPerMillion: 1.25, outputPerMillion: 10.00 },
  "gemini-3-flash": { inputPerMillion: 0.30, outputPerMillion: 2.50 },
  "gemini-3-pro": { inputPerMillion: 1.25, outputPerMillion: 10.00 },
};

const DEFAULT_PRICING: ModelPricing = { inputPerMillion: 0.30, outputPerMillion: 2.50 };

const DEFAULT_LIMITS: Record<AiFeature, { limit: number; windowMs: number }> = {
  chat: { limit: 15, windowMs: 5 * 60 * 1000 },
  workflow: { limit: 10, windowMs: 5 * 60 * 1000 },
  image: { limit: 8, windowMs: 60 * 60 * 1000 },
  video: { limit: 4, windowMs: 60 * 60 * 1000 },
  "prompt-enhance": { limit: 20, windowMs: 5 * 60 * 1000 },
  quiz: { limit: 6, windowMs: 60 * 60 * 1000 },
  "voice-preview": { limit: 10, windowMs: 60 * 60 * 1000 },
  signup: { limit: 5, windowMs: 60 * 60 * 1000 },
  other: { limit: 30, windowMs: 5 * 60 * 1000 },
};

/** Shared daily ceilings for public spend, across every caller. */
export const GLOBAL_DAILY_CAPS: Partial<Record<AiFeature, number>> = {
  quiz: 300,
  "voice-preview": 200,
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Sliding-window buckets: key -> recent timestamps */
const rateBuckets = new Map<string, number[]>();
/** Ring buffer of recent interactions for the admin panel */
const recentInteractions: AiUsageEntry[] = [];
const MAX_RECENT = 500;
/** Daily aggregates: YYYY-MM-DD -> stats */
const dailyStats = new Map<
  string,
  {
    requests: number;
    costUsd: number;
    rateLimited: number;
    errors: number;
    perFeature: Record<string, number>;
    perModel: Record<string, { requests: number; costUsd: number }>;
  }
>();
let nextId = 1;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function headerValue(headers: Record<string, unknown>, name: string): string | undefined {
  const value = headers[name];
  if (typeof value === "string" && value.length > 0) return value.split(",")[0].trim();
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) {
    return value[0].split(",")[0].trim();
  }
  return undefined;
}

export function getClientKey(req: { headers: Record<string, unknown> }): string {
  return (
    headerValue(req.headers, "x-vercel-forwarded-for") ??
    headerValue(req.headers, "x-real-ip") ??
    headerValue(req.headers, "x-forwarded-for") ??
    "unknown"
  );
}

/** Heuristic token estimate: ~4 chars per token (English text). */
export function estimateTokens(chars: number): number {
  return Math.max(1, Math.ceil(chars / 4));
}

/** Estimate USD cost for a Gemini call based on model pricing. */
export function estimateCostUsd(model: string, inputChars: number, outputChars: number): number {
  const pricing = MODEL_PRICING[model] ?? DEFAULT_PRICING;
  const inputTokens = estimateTokens(inputChars);
  const outputTokens = estimateTokens(outputChars);
  return (
    (inputTokens / 1_000_000) * pricing.inputPerMillion +
    (outputTokens / 1_000_000) * pricing.outputPerMillion
  );
}

function memoryAllow(
  bucketId: string,
  windowMs: number,
  limit: number,
  globalId?: string,
  globalCap?: number,
): boolean {
  const now = Date.now();
  if (globalId && globalCap) {
    const globalBucket = (rateBuckets.get(globalId) ?? []).filter((t) => now - t < DAY_MS);
    if (globalBucket.length >= globalCap) {
      rateBuckets.set(globalId, globalBucket);
      return false;
    }
    globalBucket.push(now);
    rateBuckets.set(globalId, globalBucket);
  }
  const bucket = (rateBuckets.get(bucketId) ?? []).filter((t) => now - t < windowMs);
  if (bucket.length >= limit) {
    rateBuckets.set(bucketId, bucket);
    return false;
  }
  bucket.push(now);
  rateBuckets.set(bucketId, bucket);
  return true;
}

let rateTableReady: Promise<void> | null = null;

async function ensureRateTable(): Promise<void> {
  if (!rateTableReady) {
    rateTableReady = (async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS ai_rate_limits (
          id SERIAL PRIMARY KEY,
          "bucketId" VARCHAR(255) NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS ai_rate_limits_bucket_created_idx
        ON ai_rate_limits ("bucketId", "createdAt")
      `);
    })().catch((error) => {
      rateTableReady = null;
      throw error;
    });
  }
  return rateTableReady;
}

async function postgresAllow(
  bucketId: string,
  windowMs: number,
  limit: number,
  globalId?: string,
  globalCap?: number,
): Promise<boolean> {
  await ensureRateTable();
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const countSince = async (id: string, since: Date) => {
    const result = await db.execute(sql`
      SELECT COUNT(*)::int AS n
      FROM ai_rate_limits
      WHERE "bucketId" = ${id} AND "createdAt" >= ${since}
    `);
    const row = (result as unknown as { rows?: Array<{ n: number }> }).rows?.[0];
    return Number(row?.n ?? 0);
  };

  if (globalId && globalCap) {
    const globalCount = await countSince(globalId, new Date(Date.now() - DAY_MS));
    if (globalCount >= globalCap) return false;
  }
  const callerCount = await countSince(bucketId, new Date(Date.now() - windowMs));
  if (callerCount >= limit) return false;

  await db.execute(sql`INSERT INTO ai_rate_limits ("bucketId") VALUES (${bucketId})`);
  if (globalId && globalCap) {
    await db.execute(sql`INSERT INTO ai_rate_limits ("bucketId") VALUES (${globalId})`);
  }
  await db.execute(sql`
    DELETE FROM ai_rate_limits WHERE "createdAt" < NOW() - INTERVAL '2 days'
  `);
  return true;
}

/**
 * Check whether a request is within the rate limit for the feature.
 * Returns true when allowed (and consumes one slot), false when blocked.
 * Buckets are `${feature}:${key}`, so features do not share a window.
 */
export async function checkRateLimit(key: string, feature: AiFeature): Promise<boolean> {
  const { limit, windowMs } = DEFAULT_LIMITS[feature];
  const bucketId = `${feature}:${key}`;
  const globalCap = GLOBAL_DAILY_CAPS[feature];
  const globalId = globalCap ? `global:${feature}` : undefined;
  const production = process.env.NODE_ENV === "production";

  if (production && process.env.DATABASE_URL) {
    try {
      return await postgresAllow(bucketId, windowMs, limit, globalId, globalCap);
    } catch (error) {
      console.error("[RateLimit] Shared store failed; denying the request.", error);
      return false;
    }
  }
  if (production) {
    console.error("[RateLimit] DATABASE_URL is unset; denying the request.");
    return false;
  }
  return memoryAllow(bucketId, windowMs, limit, globalId, globalCap);
}

/** Record a completed (or failed) AI interaction. Never throws. */
export function trackAiUsage(input: {
  feature: AiFeature;
  model: string;
  inputChars: number;
  outputChars: number;
  status?: AiStatus;
  key?: string;
}): void {
  try {
    const { feature, model, inputChars, outputChars, status = "ok", key = "unknown" } = input;
    const entry: AiUsageEntry = {
      id: nextId++,
      timestamp: Date.now(),
      feature,
      model,
      inputChars,
      outputChars,
      inputTokens: estimateTokens(inputChars),
      outputTokens: estimateTokens(outputChars),
      costUsd: estimateCostUsd(model, inputChars, outputChars),
      status,
      key,
    };
    recentInteractions.unshift(entry);
    if (recentInteractions.length > MAX_RECENT) {
      recentInteractions.length = MAX_RECENT;
    }
    const day = todayKey();
    const stats = dailyStats.get(day) ?? {
      requests: 0,
      costUsd: 0,
      rateLimited: 0,
      errors: 0,
      perFeature: {},
      perModel: {},
    };
    stats.requests += 1;
    stats.costUsd += entry.costUsd;
    if (status === "rate-limited") stats.rateLimited += 1;
    if (status === "error") stats.errors += 1;
    stats.perFeature[feature] = (stats.perFeature[feature] ?? 0) + 1;
    const modelStats = stats.perModel[model] ?? { requests: 0, costUsd: 0 };
    modelStats.requests += 1;
    modelStats.costUsd += entry.costUsd;
    stats.perModel[model] = modelStats;
    dailyStats.set(day, stats);
    // Only keep the last 30 days of aggregates
    const days = Array.from(dailyStats.keys()).sort();
    while (days.length > 30) {
      dailyStats.delete(days.shift() as string);
    }
  } catch {
    // Tracking must never break the main flow.
  }
}

export interface AiUsageStats {
  today: {
    requests: number;
    costUsd: number;
    rateLimited: number;
    errors: number;
    perFeature: Record<string, number>;
    perModel: Record<string, { requests: number; costUsd: number }>;
  };
  last7Days: {
    requests: number;
    costUsd: number;
    rateLimited: number;
  };
  recent: AiUsageEntry[];
}

export function getAiUsageStats(): AiUsageStats {
  const today = dailyStats.get(todayKey()) ?? {
    requests: 0,
    costUsd: 0,
    rateLimited: 0,
    errors: 0,
    perFeature: {},
    perModel: {},
  };
  const last7Days = { requests: 0, costUsd: 0, rateLimited: 0 };
  const now = Date.now();
  const daysToAggregate = Array.from(dailyStats.entries()).filter(([day]) =>
    now - Date.parse(day + "T00:00:00Z") <= 7 * 24 * 60 * 60 * 1000
  );
  for (const [, stats] of daysToAggregate) {
    last7Days.requests += stats.requests;
    last7Days.costUsd += stats.costUsd;
    last7Days.rateLimited += stats.rateLimited;
  }
  return { today, last7Days, recent: recentInteractions.slice(0, 100) };
}
