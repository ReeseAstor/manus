/**
 * AI Usage Tracking — rate limiting, cost estimation, and interaction logging.
 *
 * In-memory (per-process) implementation. Safe to deploy without DB migrations;
 * on multi-instance deployments each instance enforces its own limits.
 */

export type AiFeature =
  | "chat"
  | "workflow"
  | "image"
  | "video"
  | "prompt-enhance"
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
  other: { limit: 30, windowMs: 5 * 60 * 1000 },
};

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

export function getClientKey(req: { headers: Record<string, unknown> }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  const ip = req.headers["x-real-ip"];
  if (typeof ip === "string" && ip.length > 0) {
    return ip;
  }
  return "unknown";
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

/**
 * Check whether a request is within the rate limit for the feature.
 * Returns true when allowed (and consumes one slot), false when blocked.
 */
export function checkRateLimit(key: string, feature: AiFeature): boolean {
  const { limit, windowMs } = DEFAULT_LIMITS[feature];
  const now = Date.now();
  const bucket = (rateBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (bucket.length >= limit) {
    rateBuckets.set(key, bucket);
    return false;
  }
  bucket.push(now);
  rateBuckets.set(key, bucket);
  return true;
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
