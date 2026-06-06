import { WorkshopShell } from "@/components/workshop/WorkshopShell";

/**
 * Home - faithful warm-paper port of Stitch's "Inventor's Workshop" home.
 * Real data, real links. Density, icons, crosshair cursors and editorial
 * rhythm kept close to the Stitch design (that's where the soul lives).
 */

// - Inline line-icons (self-hosted, inherit currentColor) -
function Ic({ name }: { name: string }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    plus: <path d="M8 3v10M3 8h10" />,
    check: <path d="M3 8.5l3.2 3.2L13 4.5" />,
    sync: (
      <>
        <path d="M13 8a5 5 0 1 1-1.4-3.5" />
        <path d="M13 2.5V6H9.5" />
      </>
    ),
    history: (
      <>
        <circle cx="8" cy="8" r="5.5" />
        <path d="M8 5v3l2 1.2" />
      </>
    ),
    arrow: <path d="M3 8h9M8.5 4l4 4-4 4" />,
  };
  return (
    <svg {...common} aria-hidden="true" style={{ flexShrink: 0 }}>
      {paths[name]}
    </svg>
  );
}

type Row = {
  icon: string;
  label: string;
  color: string;
  body: React.ReactNode;
  version?: string;
  highlight?: boolean;
  dim?: boolean;
  bold?: boolean;
};

const CURRENTLY: Row[] = [
  {
    icon: "plus",
    label: "building",
    color: "var(--idw-ember)",
    body: <>Go <span className="opacity-40 mx-2">·</span> LangChain</>,
  },
  {
    icon: "plus",
    label: "studying",
    color: "var(--idw-blue)",
    body: <>MSc Economics &amp; Financial Technology <span className="opacity-40 mx-2">·</span> University of Galway</>,
  },
  {
    icon: "check",
    label: "shipped",
    color: "var(--idw-ink)",
    highlight: true,
    bold: true,
    version: "v1.0.4",
    body: <><span className="font-semibold">PC Trade Frames</span> <span className="opacity-40 mx-2 font-normal">·</span> live client</>,
  },
  {
    icon: "sync",
    label: "pitching",
    color: "var(--idw-ink-2)",
    body: (
      <>
        5 ventures to an incubator
        <span className="text-[11px] opacity-60 block md:inline md:ml-2 mt-1 md:mt-0">(health, property, construction, music, wellness)</span>
      </>
    ),
  },
  {
    icon: "history",
    label: "before this",
    color: "var(--idw-outline)",
    dim: true,
    body: <>forged at OneDirect (Bengaluru) <span className="opacity-40 mx-2">·</span> NGO recovery work</>,
  },
];

const DOMAIN_DOTS = ["#14B8A6", "#D946EF", "#3B82F6", "#F59E0B", "#64748B"];

export function WorkshopHome() {
  return (
    <WorkshopShell>
      <main className="px-4 md:px-12 pt-10 md:pt-20 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
          {/* Marginalia */}
          <aside className="md:col-span-3 hidden md:block pt-24">
            <div className="sticky top-32">
              <p className="idw-mono text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: "var(--idw-ink-2)" }}>
                01 [portfolio_home] // v2026.06
              </p>
              <div className="w-12 border-t mb-4" style={{ borderColor: "var(--idw-hairline)" }} />
              <p className="text-[14px] leading-relaxed max-w-[210px]" style={{ color: "var(--idw-blue)", opacity: 0.85 }}>
                Notes from the workbench. Status: active deployment. Subject exhibits a high correlation with building things across unrelated domains, and shipping them.
              </p>
            </div>
          </aside>

          {/* Content */}
          <div className="md:col-span-9 md:pt-24 pb-24">
            {/* Masthead */}
            <section className="mb-24">
              <p className="md:hidden idw-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: "var(--idw-ink-2)" }}>
                01 [portfolio_home] // v2026.06
              </p>
              <h1
                className="idw-mono font-bold mb-7"
                style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
              >
                Shrey Ghildiyal
              </h1>
              <div className="pl-6 border-l" style={{ borderColor: "rgba(26,23,20,0.2)" }}>
                <p className="idw-mono text-[15px] md:text-[18px] leading-relaxed mb-4" style={{ color: "var(--idw-ink-2)" }}>
                  Full-stack engineer &amp; restless builder, in active development
                  <span className="idw-caret" aria-hidden="true" />
                </p>
                <p className="idw-mono text-[13px] flex items-center gap-2" style={{ color: "var(--idw-ink-2)" }}>
                  <span style={{ color: "var(--idw-ember)" }}>●</span> open to work · Galway, Ireland · India-grown
                </p>
              </div>
            </section>

            <div className="w-full border-t my-12" style={{ borderColor: "var(--idw-hairline)" }} />

            {/* Currently */}
            <section className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <span className="idw-mono text-[11px] uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: "var(--idw-ink-2)" }}>
                  &gt;&gt; currently_executing
                </span>
                <div className="h-px flex-grow" style={{ background: "var(--idw-hairline)" }} />
              </div>

              <div className="idw-mono text-[13px]">
                {CURRENTLY.map((row) => (
                  <div
                    key={row.label}
                    className="idw-row group flex flex-col md:flex-row md:items-center py-4 border-b px-2 -mx-2 cursor-crosshair"
                    style={{ borderColor: "var(--idw-hairline)", background: row.highlight ? "rgba(236,232,223,0.55)" : undefined }}
                  >
                    <div className="w-32 flex-shrink-0 mb-1 md:mb-0 flex items-center gap-2" style={{ color: row.color }}>
                      <Ic name={row.icon} /> {row.label}
                    </div>
                    <div className="flex-grow" style={{ color: "var(--idw-ink)", opacity: row.dim ? 0.7 : 1 }}>
                      {row.body}
                    </div>
                    {row.version && (
                      <div className="hidden md:block text-[11px] uppercase opacity-40 text-right w-24">{row.version}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="w-full border-t my-16" style={{ borderColor: "var(--idw-hairline)" }} />

            {/* Thesis */}
            <section className="mb-24">
              <div className="relative p-8" style={{ border: "1px solid var(--idw-hairline)", background: "rgba(231,226,217,0.35)" }}>
                {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((pos) => (
                  <div key={pos} className={`absolute w-2.5 h-2.5 ${pos}`} style={{ borderColor: "var(--idw-ink)" }} />
                ))}
                <p className="idw-mono text-[11px] uppercase tracking-[0.18em] mb-6" style={{ color: "var(--idw-ink-2)" }}>
                  // core operating principle
                </p>
                <h2 className="idw-display max-w-3xl" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.5rem)", lineHeight: 1.18, fontWeight: 600 }}>
                  &ldquo;I see a buildable product in every corner of the world, and I ship them.&rdquo;
                </h2>
              </div>
            </section>

            {/* Teaser */}
            <section className="mb-8">
              <a href="/projects" className="idw-cta group block p-6 cursor-crosshair" style={{ border: "1px solid var(--idw-ink)" }}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <span className="idw-mono text-[15px] md:text-[17px]">10 systems across 8 domains</span>
                    <div className="hidden md:flex gap-2">
                      {DOMAIN_DOTS.map((c, i) => (
                        <span key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <span className="transition-transform group-hover:translate-x-2" style={{ color: "inherit" }} aria-hidden="true">
                    <Ic name="arrow" />
                  </span>
                </div>
              </a>
            </section>
          </div>
        </div>
      </main>
    </WorkshopShell>
  );
}
