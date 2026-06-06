import { NextRequest, NextResponse } from "next/server";
import { getVisitorStore } from "@/lib/visitors/store";
import { isOwner } from "@/lib/visitors/gdpr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Owner gate shared by the moderation endpoints. Returns a 503/401 response, or null when authorised. */
function guard(req: NextRequest): NextResponse | null {
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
  return null;
}

/** DELETE /api/visitors/:id - owner only. GDPR erasure / reject a record. */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = guard(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const store = await getVisitorStore();
  const removed = await store.remove(id);
  if (!removed) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, removed: true });
}

/** PATCH /api/visitors/:id - owner only. Approve / un-approve (pre-moderation). */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = guard(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const approved = (body as { approved?: unknown })?.approved;
  if (typeof approved !== "boolean") {
    return NextResponse.json({ error: "approved must be a boolean" }, { status: 422 });
  }

  const { id } = await ctx.params;
  const store = await getVisitorStore();
  const updated = await store.setApproved(id, approved);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id, approved });
}
