import { GuestbookView } from "@/components/visitors/GuestbookView";
import { getVisitorStore } from "@/lib/visitors/store";
import { toPublic } from "@/lib/visitors/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Guestbook - Shrey Ghildiyal",
  description:
    "The workbench log - notes left by people who passed through Shrey Ghildiyal's portfolio. Opt-in only.",
};

export default async function GuestbookPage() {
  const store = await getVisitorStore();
  const all = await store.list(); // newest-first
  // Public view: only owner-approved entries (pre-moderation), telemetry
  // stripped (no ipHash/geo/UA). Pending signatures stay hidden until approved.
  const entries = all.filter((e) => e.approved === true).map(toPublic);

  return <GuestbookView entries={entries} />;
}
