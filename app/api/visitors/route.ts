import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getVisitorStore } from "@/lib/visitors/store";
import {
  validateSubmission,
  clientIp,
  hashIp,
  geo,
  isOwner,
} from "@/lib/visitors/gdpr";
import { notifyNewSignature } from "@/lib/visitors/notify";
import type { VisitorEntry } from "@/lib/visitors/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rate limit: at most N signatures per window from one (hashed) IP.
const RATE_MAX = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** POST /api/visitors - public. Sign the workbench log. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validateSubmission(body as Record<string, unknown>);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  const store = await getVisitorStore();
  const ipHash = hashIp(clientIp(req));

  // Rate limit only when we can identify the source (ipHash requires a salt).
  if (ipHash) {
    const recent = await store.countRecentByIp(ipHash, RATE_WINDOW_MS);
    if (recent >= RATE_MAX) {
      return NextResponse.json(
        { error: "Too many signatures from here recently - try again later." },
        { status: 429 }
      );
    }
  }

  const { country, city } = geo(req);
  const entry: VisitorEntry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...result.data,
    approved: false, // pre-moderation: hidden from the public guestbook until the owner approves

    ipHash,
    country,
    city,
    userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? undefined,
  };

  await store.add(entry);

  // Best-effort owner ping (Discord). Awaited so it completes on serverless,
  // but it swallows its own errors and is time-bounded - never blocks success.
  await notifyNewSignature(entry);

  return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
}

/** GET /api/visitors - owner only. Full log + stats. */
export async function GET(req: NextRequest) {
  const auth = isOwner(req);
  if (!auth.configured) {
    return NextResponse.json(
      { error: "Owner access is not configured (set OWNER_TOKEN)." },
      { status: 503 }
    );
  }
  if (!auth.ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const store = await getVisitorStore();
  const [entries, stats] = await Promise.all([store.list(), store.stats()]);
  // Sensitive (full telemetry) - never cache anywhere.
  return NextResponse.json(
    { entries, stats },
    { headers: { "Cache-Control": "no-store" } }
  );
}
