import { NextRequest, NextResponse } from "next/server";
import { getVisitorStore } from "@/lib/visitors/store";
import { clientIp, hashIp } from "@/lib/visitors/gdpr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Count a given visitor at most once per this window. This caps counter
// inflation and, more importantly, stops a flood from burning the Redis
// command quota: an over-limit request does a single guard write and skips the
// two counter increments.
const VISIT_WINDOW_SEC = 30 * 60; // 30 minutes

/**
 * POST /api/visitors/visit - increments the anonymous page-visit counter.
 * No PII, no body. The client fires this once per session (see VisitBeacon),
 * and the server throttles per (hashed) IP as a backstop against abuse.
 */
export async function POST(req: NextRequest) {
  const store = await getVisitorStore();

  const ipHash = hashIp(clientIp(req));
  if (ipHash) {
    const allowed = await store.rateLimit(`visit:${ipHash}`, VISIT_WINDOW_SEC, 1);
    if (!allowed) return NextResponse.json({ ok: true, counted: false });
  }

  await store.incrementVisits();
  return NextResponse.json({ ok: true, counted: true });
}
