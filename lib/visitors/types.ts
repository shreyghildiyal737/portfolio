// ─────────────────────────────────────────────────────────────────────────────
// Visitor / "workbench log" data model.
// A signature is what a visitor leaves via the "leave a mark" guestbook form.
// Server-captured telemetry (ipHash, geo, userAgent) is owner-only and never
// exposed to the public. Raw IPs are never stored - only a salted hash.
// ─────────────────────────────────────────────────────────────────────────────

export interface VisitorEntry {
  id: string;
  createdAt: string; // ISO 8601

  // Visitor-provided (all optional except message; "you choose what to share")
  name?: string;
  role?: string; // e.g. "Engineer"
  org?: string; // e.g. "Babbage Corp."
  link?: string; // external URL the visitor chose to share
  message: string;

  // Consent + moderation
  consent: boolean; // explicit opt-in to store the signature
  approved: boolean; // owner moderation flag (default true)

  // Server-captured telemetry - OWNER ONLY, stripped from any public view
  ipHash?: string; // salted hash of IP; for rate-limit/dedupe, not identification
  country?: string;
  city?: string;
  userAgent?: string;
}

/** The subset safe to expose publicly (no telemetry, no ipHash). */
export type PublicVisitorEntry = Pick<
  VisitorEntry,
  "id" | "createdAt" | "name" | "role" | "org" | "link" | "message"
>;

export interface VisitorStats {
  totalSignatures: number;
  thisWeek: number;
  withLinks: number;
  totalVisits: number; // anonymous page visits (counter)
  monthVisits: number;
}

export function toPublic(e: VisitorEntry): PublicVisitorEntry {
  return {
    id: e.id,
    createdAt: e.createdAt,
    name: e.name,
    role: e.role,
    org: e.org,
    link: e.link,
    message: e.message,
  };
}
