import { Redis } from "@upstash/redis";
import type { VisitorEntry, VisitorStats } from "./types";
import type { VisitorStore } from "./store";
import { getRedisConfig } from "./redisEnv";

// ─────────────────────────────────────────────────────────────────────────────
// Upstash Redis store (production). Keys:
//   visitor:{id}            → JSON entry
//   visitors:index          → sorted set, score = createdAt epoch ms, member = id
//   visitors:withlinks      → set of ids that include a link (for stats)
//   visitor:ip:{ipHash}     → sorted set of {ts → id}, TTL'd, for rate limiting
//   visits:total            → counter (anonymous page visits)
//   visits:month:{YYYY-MM}  → counter
// ─────────────────────────────────────────────────────────────────────────────

const INDEX = "visitors:index";
const WITH_LINKS = "visitors:withlinks";
const ipKey = (h: string) => `visitor:ip:${h}`;
const entryKey = (id: string) => `visitor:${id}`;

function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function createRedisStore(): VisitorStore {
  const config = getRedisConfig();
  if (!config) {
    throw new Error("createRedisStore called without Upstash Redis credentials");
  }
  const redis = new Redis(config);

  return {
    async add(entry) {
      const ts = new Date(entry.createdAt).getTime();
      const tx = redis.multi();
      tx.set(entryKey(entry.id), entry);
      tx.zadd(INDEX, { score: ts, member: entry.id });
      if (entry.link) tx.sadd(WITH_LINKS, entry.id);
      if (entry.ipHash) {
        tx.zadd(ipKey(entry.ipHash), { score: ts, member: entry.id });
        tx.expire(ipKey(entry.ipHash), 60 * 60 * 24); // 24h is plenty for rate limiting
      }
      await tx.exec();
    },

    async list() {
      const ids = await redis.zrange<string[]>(INDEX, 0, -1, { rev: true });
      if (!ids.length) return [];
      const entries = await redis.mget<VisitorEntry[]>(...ids.map(entryKey));
      return entries.filter((e): e is VisitorEntry => !!e);
    },

    async get(id) {
      return (await redis.get<VisitorEntry>(entryKey(id))) ?? null;
    },

    async remove(id) {
      const existing = await redis.get<VisitorEntry>(entryKey(id));
      if (!existing) return false;
      const tx = redis.multi();
      tx.del(entryKey(id));
      tx.zrem(INDEX, id);
      tx.srem(WITH_LINKS, id);
      if (existing.ipHash) tx.zrem(ipKey(existing.ipHash), id);
      await tx.exec();
      return true;
    },

    async setApproved(id, approved) {
      const existing = await redis.get<VisitorEntry>(entryKey(id));
      if (!existing) return false;
      existing.approved = approved;
      await redis.set(entryKey(id), existing);
      return true;
    },

    async countRecentByIp(ipHash, windowMs) {
      const cutoff = Date.now() - windowMs;
      return await redis.zcount(ipKey(ipHash), cutoff, "+inf");
    },

    async rateLimit(key, windowSec, max) {
      const k = `rl:${key}`;
      const n = await redis.incr(k);
      if (n === 1) await redis.expire(k, windowSec); // start the window on first hit
      return n <= max;
    },

    async incrementVisits() {
      const tx = redis.multi();
      tx.incr("visits:total");
      tx.incr(`visits:month:${monthKey()}`);
      await tx.exec();
    },

    async stats(): Promise<VisitorStats> {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const [totalSignatures, thisWeek, withLinks, totalVisits, monthVisits] =
        await Promise.all([
          redis.zcard(INDEX),
          redis.zcount(INDEX, weekAgo, "+inf"),
          redis.scard(WITH_LINKS),
          redis.get<number>("visits:total"),
          redis.get<number>(`visits:month:${monthKey()}`),
        ]);
      return {
        totalSignatures: totalSignatures ?? 0,
        thisWeek: thisWeek ?? 0,
        withLinks: withLinks ?? 0,
        totalVisits: totalVisits ?? 0,
        monthVisits: monthVisits ?? 0,
      };
    },
  };
}
