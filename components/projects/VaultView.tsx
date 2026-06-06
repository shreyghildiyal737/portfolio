"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import { projects } from "@/data/projects";

/**
 * The Vault - faithful warm-paper port of Stitch's vault, fed REAL project
 * data (not Stitch's invented card copy). Working filter tabs + a domain
 * legend that dims non-matching cards on hover.
 */

const DOMAINS = [
  { key: "health", label: "Health", color: "#14B8A6" },
  { key: "property", label: "Property", color: "#64748B" },
  { key: "construction", label: "Construction", color: "#F59E0B" },
  { key: "music", label: "Music", color: "#D946EF" },
  { key: "wellness", label: "Wellness", color: "#10B981" },
  { key: "gaming", label: "Gaming", color: "#3B82F6" },
  { key: "creator", label: "Creator", color: "#FB7185" },
  { key: "finance", label: "Finance", color: "#064E3B" },
];
const DOMAIN_COLOR = Object.fromEntries(DOMAINS.map((d) => [d.key, d.color]));

const META: Record<string, { domain: string; category: string; status: string }> = {
  "pc-trade-frames": { domain: "property", category: "shipped", status: "Live" },
  "coastline-gaming": { domain: "gaming", category: "shipped", status: "Deployed build" },
  "leaba-shlan": { domain: "health", category: "ventures", status: "Pitching" },
  fixflow: { domain: "property", category: "ventures", status: "Pitching" },
  sitescribe: { domain: "construction", category: "ventures", status: "Pitching" },
  cypherlink: { domain: "music", category: "ventures", status: "Backend built" },
  "temple-yoga": { domain: "wellness", category: "ventures", status: "Specced" },
  "finance-analytics": { domain: "finance", category: "experiments", status: "Research" },
  "cf-satellite": { domain: "creator", category: "experiments", status: "Experiment" },
  creatoros: { domain: "creator", category: "experiments", status: "MVP" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "shipped", label: "Shipped" },
  { key: "ventures", label: "Ventures" },
  { key: "experiments", label: "Experiments" },
];

export function VaultView() {
  const [filter, setFilter] = useState("all");
  const [hoverDomain, setHoverDomain] = useState<string | null>(null);

  return (
    <WorkshopShell>
      <main className="px-4 md:px-12 pt-10 md:pt-20 max-w-[1200px] mx-auto w-full pb-12">
        {/* Header */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <p className="idw-mono text-[13px] uppercase tracking-[0.12em]" style={{ color: "var(--idw-ink-2)" }}>
              02 the vault
            </p>
          </div>
          <div className="md:col-span-8 md:border-l md:pl-6" style={{ borderColor: "var(--idw-hairline)" }}>
            <h1 className="idw-display font-bold tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.04 }}>
              Ten systems.<br />Eight worlds.
            </h1>
            <p className="text-[18px] leading-relaxed max-w-2xl" style={{ color: "var(--idw-ink-2)" }}>
              An archive of shipped products, active ventures, and honest experiments - each one real, built by hand.
            </p>
          </div>
        </section>

        {/* Filter + legend */}
        <section className="mb-12 py-4 border-t border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-5" style={{ borderColor: "var(--idw-hairline)" }}>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="idw-mono text-[13px] border px-4 py-2 transition-colors cursor-pointer"
                  style={{
                    borderColor: "var(--idw-ink)",
                    background: active ? "var(--idw-ink)" : "transparent",
                    color: active ? "var(--idw-paper)" : "var(--idw-ink)",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="idw-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--idw-outline)" }}>
              Domains //
            </span>
            {DOMAINS.map((d) => (
              <button
                key={d.key}
                onMouseEnter={() => setHoverDomain(d.key)}
                onMouseLeave={() => setHoverDomain(null)}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <span
                  className="w-2 h-2 rounded-full transition-transform"
                  style={{ background: d.color, transform: hoverDomain === d.key ? "scale(1.6)" : undefined }}
                />
                <span className="idw-mono text-[11px] uppercase" style={{ color: "var(--idw-ink-2)" }}>{d.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
          {projects.map((p) => {
            const meta = META[p.slug];
            if (!meta) return null;
            const visible = filter === "all" || meta.category === filter;
            if (!visible) return null;
            const dim = hoverDomain !== null && meta.domain !== hoverDomain;
            const color = DOMAIN_COLOR[meta.domain];

            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group relative block border-l pl-4 md:pl-6 transition-opacity duration-200"
                style={{ borderColor: "var(--idw-hairline)", opacity: dim ? 0.3 : 1 }}
              >
                <span aria-hidden="true" className="absolute top-0 right-0 w-2 h-2" style={{ background: color }} />
                <header className="mb-4">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <span className="idw-mono text-[13px]" style={{ color: "var(--idw-outline)" }}>{p.systemId}</span>
                    <span className="idw-mono text-[11px] uppercase border px-2 py-0.5 whitespace-nowrap" style={{ borderColor: "var(--idw-outline)", color: "var(--idw-ink-2)" }}>
                      {meta.status}
                    </span>
                  </div>
                  <h2 className="idw-display text-[24px] leading-tight">
                    <span className="idw-card-title">{p.title}</span>
                  </h2>
                </header>
                <p className="text-[15px] leading-relaxed mb-4" style={{ color: "var(--idw-ink-2)" }}>
                  {p.tagline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="idw-mono text-[11px] uppercase px-2 py-1"
                      style={{ background: "var(--idw-paper-2)", color: "var(--idw-ink-2)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </WorkshopShell>
  );
}
