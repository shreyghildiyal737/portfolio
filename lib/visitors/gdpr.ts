import { createHash, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Privacy + validation helpers for the visitor log.
//   • Raw IPs are never stored - only a salted SHA-256 hash, used solely for
//     rate-limiting and dedupe. With VISITOR_IP_SALT unset, no hash is kept.
//   • Owner endpoints require a bearer token (OWNER_TOKEN). If unset, owner
//     access is treated as not-configured (locked), never wide open.
// ─────────────────────────────────────────────────────────────────────────────

export const LIMITS = {
  name: 80,
  role: 60,
  org: 80,
  link: 200,
  message: 600,
} as const;

/** Best-effort client IP from common proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip");
}

/** Salted hash of the IP. Returns undefined if no salt configured (privacy-safe default). */
export function hashIp(ip: string | null): string | undefined {
  const salt = process.env.VISITOR_IP_SALT;
  if (!ip || !salt) return undefined;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Geo from Vercel's edge headers (present in production; absent locally). */
export function geo(req: NextRequest): { country?: string; city?: string } {
  const country = req.headers.get("x-vercel-ip-country") ?? undefined;
  const cityRaw = req.headers.get("x-vercel-ip-city") ?? undefined;
  const city = cityRaw ? decodeURIComponent(cityRaw) : undefined;
  return { country, city };
}

/** Constant-time bearer-token check against OWNER_TOKEN. */
export function isOwner(req: NextRequest): { ok: boolean; configured: boolean } {
  const expected = process.env.OWNER_TOKEN;
  if (!expected) return { ok: false, configured: false };

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return { ok: false, configured: true };

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  return { ok, configured: true };
}

type RawInput = {
  name?: unknown;
  role?: unknown;
  org?: unknown;
  link?: unknown;
  message?: unknown;
  consent?: unknown;
};

export interface CleanInput {
  name?: string;
  role?: string;
  org?: string;
  link?: string;
  message: string;
  consent: boolean;
}

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t) return undefined;
  return t.slice(0, max);
}

/** Validate + normalise the public submission. Returns an error string or clean data. */
export function validateSubmission(body: RawInput): { error: string } | { data: CleanInput } {
  const message = str(body.message, LIMITS.message);
  if (!message) return { error: "A message is required." };
  if (message.length < 2) return { error: "Message is too short." };

  if (body.consent !== true) {
    return { error: "Consent is required to store your signature." };
  }

  let link = str(body.link, LIMITS.link);
  if (link) {
    // Only allow http(s) links; reject anything else (e.g. javascript:)
    try {
      const u = new URL(link);
      if (u.protocol !== "http:" && u.protocol !== "https:") link = undefined;
    } catch {
      link = undefined;
    }
  }

  return {
    data: {
      name: str(body.name, LIMITS.name),
      role: str(body.role, LIMITS.role),
      org: str(body.org, LIMITS.org),
      link,
      message,
      consent: true,
    },
  };
}
