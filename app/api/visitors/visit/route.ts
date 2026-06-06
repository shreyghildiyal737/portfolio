import { NextResponse } from "next/server";
import { getVisitorStore } from "@/lib/visitors/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/visitors/visit - increments the anonymous page-visit counter.
 * No PII, no body. The client fires this once per session (see VisitBeacon).
 */
export async function POST() {
  const store = await getVisitorStore();
  await store.incrementVisits();
  return NextResponse.json({ ok: true });
}
