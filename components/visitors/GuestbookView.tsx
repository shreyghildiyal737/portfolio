import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import type { PublicVisitorEntry } from "@/lib/visitors/types";

// ─── Public guestbook ("the workbench log"). Server-rendered, indexable. ─────
// Shows only the public subset (PublicVisitorEntry - no ipHash/geo/userAgent).
// Designed in the warm-paper workshop language; no Stitch source for this list,
// so it mirrors RecordView's log treatment (section markers, hairlines, terminator).

function signedOn(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}

function initials(name?: string): string {
  if (!name) return "··";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "··";
}

export function GuestbookView({ entries }: { entries: PublicVisitorEntry[] }) {
  const count = entries.length;

  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1100px] mx-auto px-4 md:px-12 pt-10 md:pt-16 pb-20 w-full">
        {/* Header */}
        <header className="md:pl-6 mb-12" style={{ borderLeft: "1px solid var(--idw-hairline)" }}>
          <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "var(--idw-outline)" }}>
            LOG [Guest_Book] // visitors
          </p>
          <h1 className="idw-display font-bold tracking-[-0.02em] leading-[1.04] mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}>
            Marks left on the workbench
          </h1>
          <p className="text-[17px] leading-relaxed max-w-xl mb-6" style={{ color: "var(--idw-ink-2)" }}>
            People who passed through and left a note. No accounts, no metrics -
            just whoever felt like signing the log.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="idw-mono text-[12px] uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>
              {count} {count === 1 ? "signature" : "signatures"}
            </span>
            <Link
              href="/leave-a-mark"
              className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-5 py-2.5 border"
              style={{ borderColor: "var(--idw-ink)", background: "var(--idw-ember)", color: "var(--idw-paper)" }}
            >
              Sign the log →
            </Link>
          </div>
        </header>

        {/* Entries */}
        {count === 0 ? (
          <div className="p-10 text-center" style={{ border: "1px solid var(--idw-hairline)", background: "var(--idw-paper-2)" }}>
            <p className="idw-mono text-[12px] uppercase tracking-widest mb-3" style={{ color: "var(--idw-outline)" }}>
              [ log is empty ]
            </p>
            <p className="idw-display text-[20px] mb-5" style={{ color: "var(--idw-ink)" }}>
              No one&apos;s signed yet.
            </p>
            <Link href="/leave-a-mark" className="idw-navlink idw-mono text-[12px] uppercase tracking-widest" style={{ color: "var(--idw-ember)" }}>
              Be the first →
            </Link>
          </div>
        ) : (
          <section className="border-t" style={{ borderColor: "var(--idw-hairline)" }}>
            {entries.map((e, i) => {
              const sec = String(count - i).padStart(2, "0");
              const meta = [e.role, e.org].filter(Boolean).join(" · ");
              return (
                <article
                  key={e.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-b group idw-row"
                  style={{ borderColor: "var(--idw-hairline)" }}
                >
                  {/* Left rail - section marker + signer */}
                  <div className="md:col-span-4">
                    <div className="idw-mono text-[12px] mb-3" style={{ color: "var(--idw-outline)" }}>
                      {sec} · {signedOn(e.createdAt)}
                    </div>
                    <div className="flex items-start gap-3">
                      <span
                        className="idw-mono text-[11px] font-bold flex items-center justify-center shrink-0"
                        aria-hidden="true"
                        style={{ width: 34, height: 34, border: "1px solid var(--idw-hairline)", color: "var(--idw-outline)" }}
                      >
                        {initials(e.name)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="idw-display text-[18px] font-bold" style={{ color: "var(--idw-ink)" }}>
                            {e.name || "Anonymous"}
                          </span>
                          {e.link && (
                            <a
                              href={e.link}
                              target="_blank"
                              rel="noopener noreferrer nofollow ugc"
                              className="idw-navlink idw-mono text-[12px]"
                              style={{ color: "var(--idw-blue)" }}
                              title={e.link}
                            >
                              ↗
                            </a>
                          )}
                        </div>
                        {meta && (
                          <div className="idw-mono text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--idw-outline)" }}>
                            {meta}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message - the mark itself */}
                  <div className="md:col-span-8 md:pl-6" style={{ borderLeft: "1px solid var(--idw-hairline)" }}>
                    <p className="idw-display text-[19px] md:text-[21px] leading-[1.5]" style={{ color: "var(--idw-ink)" }}>
                      {e.message}
                    </p>
                  </div>
                </article>
              );
            })}

            <div className="pt-8">
              <span className="idw-mono text-[12px] uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>
                [END OF LOG]
              </span>
            </div>
          </section>
        )}
      </main>
    </WorkshopShell>
  );
}
