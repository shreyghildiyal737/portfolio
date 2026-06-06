import type { VisitorEntry, VisitorStats } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Storage seam. The rest of the app talks to VisitorStore and never knows where
// the data physically lives. Upstash Redis is the production target; a local
// file store is the zero-setup dev fallback. (Same mock-vs-live adapter pattern
// as SiteScribe - pick the implementation by environment, not by rewrite.)
// ─────────────────────────────────────────────────────────────────────────────

export interface VisitorStore {
  /** Persist a new signature. */
  add(entry: VisitorEntry): Promise<void>;
  /** All signatures, newest-first (owner view - includes telemetry). */
  list(): Promise<VisitorEntry[]>;
  /** Fetch one by id (or null). */
  get(id: string): Promise<VisitorEntry | null>;
  /** Delete one by id; returns true if something was removed. */
  remove(id: string): Promise<boolean>;
  /** Set an entry's moderation flag (approve / un-approve); returns true if found. */
  setApproved(id: string, approved: boolean): Promise<boolean>;
  /** Count recent signatures from this ipHash within windowMs (rate limit). */
  countRecentByIp(ipHash: string, windowMs: number): Promise<number>;
  /** Increment the anonymous page-visit counters (total + this month). */
  incrementVisits(): Promise<void>;
  /** Aggregate stats for the owner dashboard. */
  stats(): Promise<VisitorStats>;
}

let cached: VisitorStore | null = null;

/**
 * Returns the configured store. Uses Upstash Redis when UPSTASH_REDIS_REST_URL
 * + UPSTASH_REDIS_REST_TOKEN are set; otherwise falls back to a local file
 * store so the feature runs with zero external setup in development.
 */
export async function getVisitorStore(): Promise<VisitorStore> {
  if (cached) return cached;

  const hasUpstash =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (hasUpstash) {
    const { createRedisStore } = await import("./store.redis");
    cached = createRedisStore();
  } else {
    const { createLocalStore } = await import("./store.local");
    cached = createLocalStore();
  }
  return cached;
}
