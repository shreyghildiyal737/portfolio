import { promises as fs } from "fs";
import path from "path";
import type { VisitorEntry, VisitorStats } from "./types";
import type { VisitorStore } from "./store";

// ─────────────────────────────────────────────────────────────────────────────
// Local file store - the zero-setup dev fallback used when Upstash env is unset.
// Persists to .data/visitors.json (git-ignored). NOTE: this is for local dev
// only; serverless filesystems are ephemeral/read-only, so production must set
// the Upstash env vars to use the Redis store instead.
// ─────────────────────────────────────────────────────────────────────────────

interface FileShape {
  entries: VisitorEntry[];
  visits: { total: number; months: Record<string, number> };
}

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "visitors.json");

function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function read(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<FileShape>;
    return {
      entries: parsed.entries ?? [],
      visits: parsed.visits ?? { total: 0, months: {} },
    };
  } catch {
    return { entries: [], visits: { total: 0, months: {} } };
  }
}

async function write(data: FileShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export function createLocalStore(): VisitorStore {
  return {
    async add(entry) {
      const data = await read();
      data.entries.push(entry);
      await write(data);
    },

    async list() {
      const data = await read();
      return [...data.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async get(id) {
      const data = await read();
      return data.entries.find((e) => e.id === id) ?? null;
    },

    async remove(id) {
      const data = await read();
      const before = data.entries.length;
      data.entries = data.entries.filter((e) => e.id !== id);
      const removed = data.entries.length < before;
      if (removed) await write(data);
      return removed;
    },

    async setApproved(id, approved) {
      const data = await read();
      const entry = data.entries.find((e) => e.id === id);
      if (!entry) return false;
      entry.approved = approved;
      await write(data);
      return true;
    },

    async countRecentByIp(ipHash, windowMs) {
      const cutoff = Date.now() - windowMs;
      const data = await read();
      return data.entries.filter(
        (e) => e.ipHash === ipHash && new Date(e.createdAt).getTime() >= cutoff
      ).length;
    },

    async incrementVisits() {
      const data = await read();
      data.visits.total += 1;
      const k = monthKey();
      data.visits.months[k] = (data.visits.months[k] ?? 0) + 1;
      await write(data);
    },

    async stats(): Promise<VisitorStats> {
      const data = await read();
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return {
        totalSignatures: data.entries.length,
        thisWeek: data.entries.filter((e) => new Date(e.createdAt).getTime() >= weekAgo).length,
        withLinks: data.entries.filter((e) => !!e.link).length,
        totalVisits: data.visits.total,
        monthVisits: data.visits.months[monthKey()] ?? 0,
      };
    },
  };
}
