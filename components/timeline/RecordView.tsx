"use client";

import { useEffect, useRef } from "react";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import { timeline } from "@/data/timeline";

/**
 * The Record - faithful warm-paper port of Stitch's "Changelog" timeline,
 * fed the REAL six-phase arc (India → Ireland). Rendered newest-first like a
 * changelog: the active chapter sits on top in a blueprint-inset, foundations
 * at the bottom, terminated by [END OF RECORD]. Entries fade in on scroll.
 */

// Optional org/place tag shown under the section marker on the left rail.
const ORG: Record<string, string> = {
  "phase-01": "[Chandigarh Univ]",
  "phase-02": "[OneDirect / Gupshup]",
  "phase-05": "[University of Galway]",
};

// Short section number from "Phase 0X"
function secNo(phase: string) {
  const m = phase.match(/(\d+)/);
  return m ? m[1] : "00";
}

export function RecordView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>(".idw-entry");
    if (!nodes) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            o.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  // Changelog order: current first.
  const entries = [...timeline].reverse();

  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 pt-10 md:pt-16 pb-12 w-full relative">
        {/* Header */}
        <header className="mb-20 relative">
          <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--idw-outline)" }}>
            LOG [Record_Timeline] // v2026.06
          </p>
          <h1
            className="idw-display font-bold tracking-[-0.02em] mt-4 mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.04 }}
          >
            Changelog
          </h1>
          <p className="text-[18px] leading-relaxed max-w-2xl" style={{ color: "var(--idw-ink-2)" }}>
            A sequential record of how the engineer was shaped - foundational builds, a deliberate step away,
            service, a country change, and the ventures in active development now. No invented dates.
          </p>
          <div className="w-24 border-t mt-6" style={{ borderColor: "var(--idw-ink)" }} />
        </header>

        {/* Timeline */}
        <div ref={rootRef} className="relative w-full">
          {/* Central hairline rule (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px -ml-px"
            style={{ background: "var(--idw-hairline)" }}
          />

          <div className="space-y-12">
            {entries.map((phase) => {
              const sec = secNo(phase.phase);
              const org = ORG[phase.id];
              const current = !!phase.isCurrent;

              return (
                <article
                  key={phase.id}
                  className={`idw-entry flex flex-col md:flex-row relative group ${current ? "p-4 md:p-6 -ml-4 md:ml-0" : ""}`}
                  style={
                    current
                      ? { background: "rgba(43,91,217,0.04)", borderLeft: "1px solid var(--idw-ink)" }
                      : undefined
                  }
                >
                  {/* Left: metadata rail */}
                  <div className="md:w-1/3 md:pr-6 mb-4 md:mb-0">
                    {current ? (
                      <>
                        <div className="idw-mono text-[13px] flex items-center gap-2 mb-2" style={{ color: "var(--idw-ember)" }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: "var(--idw-ember)" }} />
                          {sec} · {phase.period}
                        </div>
                        <div
                          className="idw-mono text-[11px] font-bold uppercase tracking-widest inline-block px-2 py-1"
                          style={{ background: "var(--idw-ember)", color: "var(--idw-paper)" }}
                        >
                          ● Active development
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="idw-mono text-[13px] mb-2" style={{ color: "var(--idw-outline)" }}>
                          {sec} · {phase.period}
                        </div>
                        {org && (
                          <div className="idw-mono text-[11px] uppercase tracking-widest hidden md:block" style={{ color: "var(--idw-outline)" }}>
                            {org}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right: content */}
                  <div className="md:w-2/3 md:pl-6 md:border-l md:border-transparent group-hover:md:[border-color:var(--idw-hairline)] transition-colors">
                    <h2
                      className={`idw-display mb-3 transition-colors ${current ? "font-bold" : ""}`}
                      style={{
                        fontSize: current ? "clamp(1.8rem, 3.4vw, 2.5rem)" : "clamp(1.4rem, 2.4vw, 1.75rem)",
                        lineHeight: 1.12,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {phase.title}
                    </h2>
                    <p className="text-[16px] leading-relaxed max-w-xl" style={{ color: "var(--idw-ink-2)" }}>
                      {phase.description}
                    </p>

                    {/* Stack rail */}
                    {phase.stack.length > 0 && (
                      <p className="idw-mono text-[12px] mt-4 leading-relaxed" style={{ color: "var(--idw-outline)" }}>
                        stack: {phase.stack.join(" · ")}
                      </p>
                    )}

                    {/* Mindset shift */}
                    {phase.shift && (
                      <div className="mt-4 pl-4" style={{ borderLeft: "2px solid var(--idw-hairline)" }}>
                        <p className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--idw-ember)" }}>
                          shift
                        </p>
                        <p className="text-[15px] leading-relaxed" style={{ color: "var(--idw-ink)" }}>
                          {phase.shift}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mobile divider */}
                  <div className="w-full border-t md:hidden mt-4" style={{ borderColor: "var(--idw-hairline)" }} />
                </article>
              );
            })}
          </div>
        </div>

        {/* Terminator */}
        <div className="mt-20 flex justify-center w-full">
          <div
            className="idw-mono text-[13px] uppercase tracking-widest px-4 py-2"
            style={{ border: "1px solid var(--idw-hairline)", color: "var(--idw-outline)" }}
          >
            [END OF RECORD]
          </div>
        </div>
      </main>
    </WorkshopShell>
  );
}
