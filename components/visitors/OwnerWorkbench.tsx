"use client";

import { useState, useMemo, useCallback } from "react";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import type { VisitorEntry, VisitorStats } from "@/lib/visitors/types";

// ─── Owner workbench log (warm-paper port of Stitch). Token-gated. noindex. ──
// "A record of digital footfalls. Access restricted to principal architect."

type Sort = "date_desc" | "date_asc" | "name_asc";
type StatusFilter = "pending" | "approved" | "all";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="idw-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>
        {label}
      </span>
      <span className="idw-mono text-[18px]" style={{ color: accent ? "var(--idw-ember)" : "var(--idw-ink)" }}>
        {value}
      </span>
    </div>
  );
}

export function OwnerWorkbench() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [entries, setEntries] = useState<VisitorEntry[]>([]);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("date_desc");
  const [status, setStatus] = useState<StatusFilter>("pending");

  const headers = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/visitors", { headers: headers(), cache: "no-store" });
      if (res.status === 401) {
        setErr("Invalid owner token.");
        setLoading(false);
        return;
      }
      if (res.status === 503) {
        setErr("Owner access is not configured on the server (set OWNER_TOKEN).");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setErr("Failed to load the log.");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { entries: VisitorEntry[]; stats: VisitorStats };
      setEntries(data.entries);
      setStats(data.stats);
      setAuthed(true);
    } catch {
      setErr("Network error.");
    }
    setLoading(false);
  }, [headers]);

  const purge = useCallback(
    async (entry: VisitorEntry) => {
      const who = entry.name || entry.id.slice(0, 8);
      if (!window.confirm(`Execute purge protocol for record: ${who}?`)) return;
      const res = await fetch(`/api/visitors/${entry.id}`, { method: "DELETE", headers: headers() });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
        setStats((s) =>
          s
            ? {
                ...s,
                totalSignatures: s.totalSignatures - 1,
                withLinks: entry.link ? s.withLinks - 1 : s.withLinks,
              }
            : s
        );
      } else {
        window.alert("Delete failed.");
      }
    },
    [headers]
  );

  const setApprove = useCallback(
    async (entry: VisitorEntry, approved: boolean) => {
      const res = await fetch(`/api/visitors/${entry.id}`, {
        method: "PATCH",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, approved } : e)));
      } else {
        window.alert("Update failed.");
      }
    },
    [headers]
  );

  const pendingCount = useMemo(() => entries.filter((e) => e.approved === false).length, [entries]);

  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = entries;
    if (status === "pending") rows = rows.filter((e) => e.approved === false);
    else if (status === "approved") rows = rows.filter((e) => e.approved === true);
    if (q) {
      rows = rows.filter((e) =>
        [e.name, e.role, e.org, e.message].some((v) => v?.toLowerCase().includes(q))
      );
    }
    const sorted = [...rows];
    if (sort === "date_desc") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "date_asc") sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    else sorted.sort((a, b) => (a.name ?? "~").localeCompare(b.name ?? "~"));
    return sorted;
  }, [entries, query, sort, status]);

  function exportCsv() {
    const head = ["name", "role", "org", "link", "message", "country", "city", "createdAt", "approved"];
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [head.join(",")].concat(
      entries.map((e) =>
        [e.name, e.role, e.org, e.link, e.message, e.country, e.city, e.createdAt, e.approved]
          .map((v) => esc(String(v ?? "")))
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workbench-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Gate ──
  if (!authed) {
    return (
      <WorkshopShell>
        <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 pt-16 pb-20 w-full">
          <div className="max-w-md md:pl-6" style={{ borderLeft: "1px solid var(--idw-hairline)" }}>
            <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--idw-outline)" }}>
              01 WORKBENCH_LOG // restricted
            </p>
            <h1 className="idw-display font-bold tracking-[-0.02em] mb-3" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              Owner access
            </h1>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--idw-ink-2)" }}>
              A record of digital footfalls. Access restricted to the principal architect.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                load();
              }}
              className="space-y-4"
            >
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="owner token"
                autoComplete="off"
                className="w-full bg-transparent border-b px-0 py-2 outline-none focus:border-b-2 idw-mono text-[13px]"
                style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-ink)" }}
              />
              {err && (
                <p className="idw-mono text-[12px]" style={{ color: "var(--idw-ember)" }}>
                  ✕ {err}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !token}
                className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-5 py-2.5 border disabled:opacity-50"
                style={{ borderColor: "var(--idw-ink)" }}
              >
                {loading ? "Authenticating…" : "Unlock log"}
              </button>
            </form>
          </div>
        </main>
      </WorkshopShell>
    );
  }

  // ── Dashboard ──
  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 pt-10 md:pt-14 pb-20 w-full">
        {/* Header + stats */}
        <header className="mb-10 pb-6 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
          <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: "var(--idw-outline)" }}>
            01 WORKBENCH_LOG
          </p>
          <h1 className="idw-display font-bold tracking-[-0.02em] leading-[1.0] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
            Visitors
          </h1>
          <div className="flex flex-wrap gap-x-8 gap-y-4 p-4" style={{ border: "1px solid var(--idw-hairline)", background: "var(--idw-paper-2)" }}>
            <Stat label="Pending review" value={pendingCount} accent={pendingCount > 0} />
            <Stat label="Total signatures" value={stats?.totalSignatures ?? 0} />
            <Stat label="This week" value={stats?.thisWeek ?? 0} />
            <Stat label="With links" value={stats?.withLinks ?? 0} />
            <div className="border-l pl-8" style={{ borderColor: "var(--idw-hairline)" }}>
              <Stat label="Anonymous visits (month)" value={stats?.monthVisits ?? 0} />
            </div>
            <Stat label="Anonymous visits (all)" value={stats?.totalVisits ?? 0} />
          </div>
        </header>

        {/* Controls */}
        <section className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <label className="w-full sm:w-1/2">
            <span className="idw-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>
              Search registry
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name or note…"
              className="w-full bg-transparent border-b px-0 py-2 mt-1 outline-none focus:border-b-2 idw-mono text-[13px]"
              style={{ borderColor: "var(--idw-ink)", color: "var(--idw-ink)" }}
            />
          </label>
          <div className="flex items-end gap-4">
            <div>
              <span className="idw-mono text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: "var(--idw-outline)" }}>
                Show
              </span>
              <div className="flex border" style={{ borderColor: "var(--idw-ink)" }}>
                {(["pending", "approved", "all"] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="idw-mono text-[11px] uppercase tracking-widest px-3 py-2 border-r last:border-r-0"
                    style={{
                      borderColor: "var(--idw-hairline)",
                      background: status === s ? "var(--idw-ink)" : "transparent",
                      color: status === s ? "var(--idw-paper)" : "var(--idw-ink-2)",
                    }}
                  >
                    {s}
                    {s === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
                  </button>
                ))}
              </div>
            </div>
            <label>
              <span className="idw-mono text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: "var(--idw-outline)" }}>
                Sort by
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent border-b px-0 py-2 idw-mono text-[13px] cursor-pointer outline-none"
                style={{ borderColor: "var(--idw-ink)", color: "var(--idw-ink)" }}
              >
                <option value="date_desc">Date (Newest)</option>
                <option value="date_asc">Date (Oldest)</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </label>
            <button
              onClick={exportCsv}
              className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-4 py-2 border"
              style={{ borderColor: "var(--idw-ink)" }}
            >
              CSV
            </button>
          </div>
        </section>

        {/* Table */}
        <section className="border-t pt-4" style={{ borderColor: "var(--idw-hairline)" }}>
          <div className="hidden md:grid grid-cols-12 gap-4 pb-2 mb-3 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
            {["Identifier", "Origin", "Transmission", "When", "Actions"].map((h, i) => (
              <div
                key={h || i}
                className={`idw-mono text-[10px] font-bold uppercase tracking-widest ${i === 0 ? "col-span-3" : i === 1 ? "col-span-3" : i === 2 ? "col-span-3" : i === 3 ? "col-span-1 text-right" : "col-span-2 text-right"}`}
                style={{ color: "var(--idw-outline)" }}
              >
                {h}
              </div>
            ))}
          </div>

          {view.length === 0 ? (
            <p className="idw-mono text-[13px] py-10 text-center" style={{ color: "var(--idw-outline)" }}>
              No records found matching criteria.
            </p>
          ) : (
            <div className="flex flex-col">
              {view.map((e) => (
                <article
                  key={e.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b md:items-start group"
                  style={{ borderColor: "var(--idw-hairline)" }}
                >
                  {/* Identifier */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="idw-mono text-[13px] font-bold" style={{ color: "var(--idw-ink)" }}>
                        {e.name || "Anonymous"}
                      </span>
                      {e.link && (
                        <a href={e.link} target="_blank" rel="noopener noreferrer" className="idw-navlink idw-mono text-[11px]" style={{ color: "var(--idw-blue)" }} title={e.link}>
                          ↗
                        </a>
                      )}
                      {e.approved === false && (
                        <span
                          className="idw-mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5"
                          style={{ background: "var(--idw-ember)", color: "var(--idw-paper)" }}
                        >
                          Pending
                        </span>
                      )}
                    </div>
                    {e.role && (
                      <span className="idw-mono text-[11px]" style={{ color: "var(--idw-outline)" }}>{e.role}</span>
                    )}
                  </div>

                  {/* Origin (org + geo telemetry, owner-only) */}
                  <div className="md:col-span-3">
                    <span className="text-[14px]" style={{ color: "var(--idw-ink)" }}>{e.org || "-"}</span>
                    {(e.country || e.city) && (
                      <span className="idw-mono text-[11px] block" style={{ color: "var(--idw-outline)" }}>
                        ⌖ {[e.city, e.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>

                  {/* Transmission */}
                  <div className="md:col-span-3">
                    <p className="text-[14px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>{e.message}</p>
                  </div>

                  {/* When */}
                  <div className="md:col-span-1 md:text-right">
                    <span className="idw-mono text-[11px]" style={{ color: "var(--idw-outline)" }} title={new Date(e.createdAt).toLocaleString()}>
                      {relativeTime(e.createdAt)}
                    </span>
                  </div>

                  {/* Actions - approve/hide + purge */}
                  <div className="md:col-span-2 flex items-start gap-4 md:justify-end">
                    {e.approved === false ? (
                      <button
                        onClick={() => setApprove(e, true)}
                        className="idw-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{ color: "var(--idw-ember)" }}
                      >
                        ✓ approve
                      </button>
                    ) : (
                      <button
                        onClick={() => setApprove(e, false)}
                        className="idw-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                        style={{ color: "var(--idw-outline)" }}
                        onMouseEnter={(ev) => (ev.currentTarget.style.color = "var(--idw-ink)")}
                        onMouseLeave={(ev) => (ev.currentTarget.style.color = "var(--idw-outline)")}
                        title="Hide from the public log"
                      >
                        ⊘ hide
                      </button>
                    )}
                    <button
                      onClick={() => purge(e)}
                      className="idw-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                      style={{ color: "var(--idw-outline)" }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.color = "var(--idw-ember)")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.color = "var(--idw-outline)")}
                    >
                      ✕ purge
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </WorkshopShell>
  );
}
