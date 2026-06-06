import { notFound } from "next/navigation";
import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import { projects } from "@/data/projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} - Shrey Ghildiyal`,
    description: project.tagline,
  };
}

// Per-slug dossier metadata (mirrors the Vault legend) - domain label + status chip.
const META: Record<string, { domain: string; status: string }> = {
  "pc-trade-frames": { domain: "PROPERTY", status: "Live" },
  "coastline-gaming": { domain: "GAMING", status: "Deployed build" },
  "leaba-shlan": { domain: "HEALTH-TECH", status: "Pitching" },
  fixflow: { domain: "PROPERTY", status: "Pitching" },
  sitescribe: { domain: "CONSTRUCTION", status: "Pitching" },
  cypherlink: { domain: "MUSIC", status: "Backend built" },
  "temple-yoga": { domain: "WELLNESS", status: "Specced" },
  "finance-analytics": { domain: "FINANCE", status: "Research" },
  "cf-satellite": { domain: "CREATOR", status: "Experiment" },
  creatoros: { domain: "CREATOR", status: "MVP" },
};

// section marker derived from the systemId (VAULT.03 → 03)
function sectionNo(systemId: string) {
  const m = systemId.match(/(\d+)/);
  return m ? m[1] : "00";
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-4"
      style={{ color: "var(--idw-outline)" }}
    >
      {children}
    </p>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();
  const project = projects[idx];
  const meta = META[slug] ?? { domain: "SYSTEM", status: project.status };
  const sec = sectionNo(project.systemId);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <WorkshopShell>
      <main className="flex-grow pt-10 md:pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 w-full">
          <Link
            href="/projects"
            className="idw-navlink idw-mono text-[12px] uppercase tracking-widest inline-flex items-center gap-2 mb-10"
            style={{ color: "var(--idw-ink-2)" }}
          >
            ← Vault
          </Link>

          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {/* ── Metadata column (left, sticky) ── */}
            <aside className="col-span-12 md:col-span-3 mb-8 md:mb-0">
              <div className="md:sticky md:top-28">
                <p
                  className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-4"
                  style={{ color: "var(--idw-outline)" }}
                >
                  {sec} [{project.systemId}] // {meta.domain} // {meta.status}
                </p>
                <div
                  className="md:border-l md:pl-4 space-y-6"
                  style={{ borderColor: "var(--idw-hairline)" }}
                >
                  <div>
                    <p className="idw-mono text-[11px] uppercase tracking-wider mb-1" style={{ color: "var(--idw-outline)" }}>
                      build
                    </p>
                    <p className="idw-mono text-[12px]" style={{ color: "var(--idw-ink-2)" }}>
                      {project.year} · {meta.status}
                    </p>
                  </div>
                  <div>
                    <p className="idw-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--idw-outline)" }}>
                      stack
                    </p>
                    <p className="idw-mono text-[12px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>
                      {project.stack.join(" · ")}
                    </p>
                  </div>

                  {project.metrics.length > 0 && (
                    <div>
                      <p className="idw-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--idw-outline)" }}>
                        signal
                      </p>
                      <div className="space-y-2">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <span className="idw-mono text-[13px] font-bold block" style={{ color: "var(--idw-ink)" }}>
                              {m.value}
                            </span>
                            <span className="idw-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--idw-outline)" }}>
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.links.length > 0 && (
                    <div>
                      <p className="idw-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--idw-outline)" }}>
                        links
                      </p>
                      <div className="flex flex-col gap-2">
                        {project.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="idw-navlink idw-mono text-[12px]"
                            style={{ color: "var(--idw-blue)" }}
                          >
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* ── Main content column (right) ── */}
            <div className="col-span-12 md:col-span-9 md:pl-6">
              {/* Header */}
              <section className="mb-14">
                <h1
                  className="idw-display font-bold leading-[1.03] mb-5"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
                >
                  {project.title}
                </h1>
                <p className="text-[20px] leading-relaxed max-w-2xl" style={{ color: "var(--idw-ink-2)" }}>
                  {project.tagline}
                </p>
              </section>

              {/* X.1 - Overview */}
              <section className="mb-14">
                <Label>{sec}.1 // OVERVIEW</Label>
                <p className="text-[17px] leading-relaxed max-w-2xl" style={{ color: "var(--idw-ink)" }}>
                  {project.description}
                </p>
              </section>

              {/* X.2 - The Problem */}
              {project.problem && (
                <section
                  className="relative pl-6 md:pl-8 mb-14"
                  style={{ borderLeft: "1px solid var(--idw-hairline)" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-px top-0 h-8 w-1"
                    style={{ background: "var(--idw-ember)" }}
                  />
                  <Label>{sec}.2 // THE PROBLEM</Label>
                  <p
                    className="idw-display leading-snug max-w-2xl"
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)", color: "var(--idw-ink)" }}
                  >
                    {project.problem}
                  </p>
                </section>
              )}

              {/* X.3 - Product Experience */}
              {project.productExperience && (
                <section className="mb-14">
                  <Label>{sec}.3 // PRODUCT EXPERIENCE</Label>
                  <p className="text-[17px] leading-relaxed max-w-2xl" style={{ color: "var(--idw-ink)" }}>
                    {project.productExperience}
                  </p>
                </section>
              )}

              {/* X.4 - Blueprint / Architecture */}
              {project.architectureLayers && project.architectureLayers.length > 0 && (
                <section className="mb-14">
                  <Label>{sec}.4 // THE BUILD</Label>
                  <div className="relative overflow-hidden" style={{ border: "1px solid var(--idw-ink)" }}>
                    {/* blueprint header */}
                    <div
                      className="relative z-10 flex justify-between items-center px-4 py-3 border-b"
                      style={{ borderColor: "var(--idw-hairline)", background: "var(--idw-paper-2)" }}
                    >
                      <span className="idw-mono text-[12px]" style={{ color: "var(--idw-ink-2)" }}>
                        SYS_ARCH // REV. A
                      </span>
                      <span className="idw-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--idw-outline)" }}>
                        {project.architectureLayers.length} layers
                      </span>
                    </div>
                    {/* blueprint body - data-driven schematic */}
                    <div
                      className="relative p-6 md:p-8"
                      style={{
                        backgroundColor: "rgba(43,91,217,0.03)",
                        backgroundImage:
                          "linear-gradient(rgba(43,91,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,91,217,0.08) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {project.architectureLayers.map((layer, i) => (
                          <div
                            key={layer.name}
                            className="pl-4"
                            style={{ borderLeft: "2px solid rgba(43,91,217,0.4)", background: "rgba(244,239,230,0.6)" }}
                          >
                            <div className="flex items-baseline gap-2 mb-1.5">
                              <span className="idw-mono text-[11px]" style={{ color: "var(--idw-blue)" }}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <h3 className="idw-mono text-[13px] font-bold" style={{ color: "var(--idw-ink)" }}>
                                {layer.name}
                              </h3>
                            </div>
                            <p className="text-[14px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>
                              {layer.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* blueprint caption */}
                    <div
                      className="relative z-10 px-4 py-2 border-t"
                      style={{ borderColor: "var(--idw-hairline)", background: "var(--idw-paper-2)" }}
                    >
                      <p className="idw-mono text-[10px] uppercase tracking-wider text-right" style={{ color: "var(--idw-outline)" }}>
                        FIG 1. CORE ARCHITECTURE SCHEMATIC
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* X.5 - Engineering Tradeoffs */}
              {project.tradeoffs && project.tradeoffs.length > 0 && (
                <section className="mb-14">
                  <Label>{sec}.5 // ENGINEERING TRADEOFFS</Label>
                  <div className="hidden md:grid gap-4 pb-3 border-b" style={{ gridTemplateColumns: "1fr 2fr 1.5fr", borderColor: "var(--idw-hairline)" }}>
                    <span className="idw-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>Decision</span>
                    <span className="idw-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>Reasoning</span>
                    <span className="idw-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>V2 Consideration</span>
                  </div>
                  {project.tradeoffs.map((t) => (
                    <div key={t.decision} className="py-5 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
                      <div className="md:hidden space-y-2">
                        <p className="text-[15px] font-semibold" style={{ color: "var(--idw-ink)" }}>{t.decision}</p>
                        <p className="text-[14px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>{t.reason}</p>
                        {t.v2 && (
                          <p className="text-[14px] leading-relaxed" style={{ color: "var(--idw-outline)" }}>
                            <span className="idw-mono mr-1" style={{ color: "var(--idw-ember)" }}>V2:</span>
                            {t.v2}
                          </p>
                        )}
                      </div>
                      <div className="hidden md:grid gap-4" style={{ gridTemplateColumns: "1fr 2fr 1.5fr" }}>
                        <span className="text-[14px] font-medium leading-relaxed" style={{ color: "var(--idw-ink)" }}>{t.decision}</span>
                        <span className="text-[14px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>{t.reason}</span>
                        <span className="text-[14px] leading-relaxed" style={{ color: "var(--idw-outline)" }}>{t.v2 || "-"}</span>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* X.6 - AI-Assisted Workflow */}
              {project.aiWorkflow && (
                <section className="mb-14">
                  <Label>{sec}.6 // AI-ASSISTED WORKFLOW</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--idw-hairline)", border: "1px solid var(--idw-hairline)" }}>
                    {[
                      { sign: "+", title: "AI Accelerated", items: project.aiWorkflow.helped, color: "var(--idw-blue)" },
                      { sign: "→", title: "Required Judgment", items: project.aiWorkflow.judgment, color: "var(--idw-ember)" },
                      { sign: "-", title: "AI Couldn't Solve", items: project.aiWorkflow.couldNotSolve, color: "var(--idw-outline)" },
                    ].map((col) => (
                      <div key={col.title} className="p-5" style={{ background: "var(--idw-paper)" }}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="idw-mono font-bold text-[16px]" style={{ color: col.color }}>{col.sign}</span>
                          <span className="idw-mono text-[12px] uppercase tracking-wide" style={{ color: "var(--idw-ink)" }}>{col.title}</span>
                        </div>
                        <ul className="space-y-2">
                          {col.items.map((item) => (
                            <li key={item} className="text-[14px] leading-relaxed flex gap-2" style={{ color: "var(--idw-ink-2)" }}>
                              <span className="shrink-0 mt-0.5" style={{ color: col.color }}>·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* X.7 - What This Built */}
              {project.lessons && project.lessons.length > 0 && (
                <section className="mb-14">
                  <Label>{sec}.7 // WHAT THIS BUILT</Label>
                  <ol className="space-y-4">
                    {project.lessons.map((lesson, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="idw-mono text-[12px] font-bold shrink-0 mt-1" style={{ color: "var(--idw-ember)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[16px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>{lesson}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* X.8 - Capability Proof / Status Report */}
              {project.capabilityProof && (
                <section className="mb-14">
                  <div className="relative p-6" style={{ border: "1px solid var(--idw-ink)", background: "var(--idw-paper-2)" }}>
                    <span aria-hidden="true" className="absolute top-0 left-0 w-1 h-full" style={{ background: "var(--idw-ember)" }} />
                    <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--idw-ember)" }}>
                      STATUS REPORT
                    </p>
                    <p className="idw-display leading-snug" style={{ fontSize: "clamp(1.05rem, 2vw, 1.3rem)", color: "var(--idw-ink)" }}>
                      {project.capabilityProof}
                    </p>
                  </div>
                </section>
              )}

              {project.status === "in-progress" && (
                <div
                  className="flex items-center gap-3 p-4 idw-mono text-[12px]"
                  style={{ border: "1px solid var(--idw-hairline)", color: "var(--idw-ink-2)" }}
                >
                  <span className="w-2 h-2" style={{ background: "var(--idw-ember)" }} />
                  This system is actively being developed - no fake metrics.
                </div>
              )}

              {/* Prev / Next */}
              <nav
                className="mt-16 pt-6 flex justify-between items-center gap-4 border-t"
                style={{ borderColor: "var(--idw-hairline)" }}
              >
                {prev ? (
                  <Link href={`/projects/${prev.slug}`} className="idw-navlink idw-mono text-[12px] uppercase tracking-widest" style={{ color: "var(--idw-ink-2)" }}>
                    ← {prev.title}
                  </Link>
                ) : <span />}
                {next ? (
                  <Link href={`/projects/${next.slug}`} className="idw-navlink idw-mono text-[12px] uppercase tracking-widest text-right" style={{ color: "var(--idw-ink-2)" }}>
                    {next.title} →
                  </Link>
                ) : <span />}
              </nav>
            </div>
          </div>
        </div>
      </main>
    </WorkshopShell>
  );
}
