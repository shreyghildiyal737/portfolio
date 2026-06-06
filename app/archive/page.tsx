import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";

export const metadata = {
  title: "Archive - Shrey Ghildiyal",
  description: "Engineering notes. Not meant to be indexed.",
  robots: { index: false, follow: false },
};

function Entry({
  id,
  label,
  title,
  children,
}: {
  id?: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="py-10 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
      <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--idw-outline)" }}>
        {label}
      </p>
      <h2
        className="idw-display mb-5"
        style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)", letterSpacing: "-0.01em", lineHeight: 1.25, color: "var(--idw-ink)" }}
      >
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--idw-ink-2)", maxWidth: "62ch" }}>
        {children}
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="pl-4 italic text-[14px] leading-relaxed" style={{ borderLeft: "2px solid var(--idw-hairline)", color: "var(--idw-outline)" }}>
      {children}
    </p>
  );
}

export default function ArchivePage() {
  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 pt-10 pb-20 w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-14">
          <Link
            href="/"
            className="idw-navlink idw-mono text-[12px] uppercase tracking-widest"
            style={{ color: "var(--idw-ink-2)" }}
          >
            ← Back
          </Link>
          <span className="idw-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: "var(--idw-outline)" }}>
            ◈ Developer Archive
          </span>
        </div>

        <div className="max-w-2xl">
          {/* Header */}
          <div className="pb-10 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
            <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--idw-outline)" }}>
              Engineering Notes
            </p>
            <h1
              className="idw-display font-bold mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--idw-ink)" }}
            >
              Developer Archive
            </h1>
            <p className="text-[16px] leading-relaxed" style={{ color: "var(--idw-ink-2)", maxWidth: "56ch" }}>
              Notes that don&apos;t belong in a case study - the things I&apos;d tell a collaborator on day two.
              Decisions and why I made them, honest retrospectives, and ideas still in progress. No invented war stories.
            </p>
          </div>

          {/* ── DECISIONS ── */}
          <Entry label="DECISION.NOTES" title="PostgreSQL is the source of truth">
            <p>
              The pattern that repeats across Leaba Slán, Coastline Gaming, and CypherLink: PostgreSQL holds
              the authoritative state, Redis is strictly cache and pub/sub, and anything slow goes onto a queue.
              One durable store to reason about under failure, not three.
            </p>
            <p>
              Every time I&apos;ve been tempted to reach for a specialist database first, the tradeoff went the other
              way once the data was modelled carefully. The rule I&apos;ve settled on: add a specialist store when the
              general-purpose one is genuinely the bottleneck - and that threshold is higher than it looks.
            </p>
            <Note>
              The corollary: push slow work (HSE sync, alerting, email, GDPR acknowledgements) onto BullMQ or a
              cron-drained job table so the request path stays fast. Correctness first, then latency.
            </Note>
          </Entry>

          <Entry label="DECISION.NOTES" title="Shipping AI features honestly">
            <p>
              In SiteScribe the model sits behind an interface with two implementations: a mock path that runs the
              whole capture → draft → approve → export flow with zero paid APIs, and a live path (Groq Whisper +
              Gemini) selected by an env var. The model is a swappable dependency, so the workflow is testable and
              going live is a configuration switch, not a rewrite.
            </p>
            <p>
              The other half is restraint: AI drafts, humans approve. CreatorOS keeps inference local-first via
              Ollama so the core loop has no cloud dependency. LLMs for structure extraction and drafts;
              deterministic code and human sign-off for anything that has to be correct.
            </p>
            <Note>
              The failure mode I watch for is a model that&apos;s confident about things it shouldn&apos;t be. Persisting the
              raw transcript, the structured extraction, and the final approved text separately keeps that legible.
            </Note>
          </Entry>

          <Entry label="DECISION.NOTES" title="Why Coastline&apos;s public auth is left unwired">
            <p>
              Coastline Gaming is a production-grade build, not a live operator - so public sign-up is intentionally
              not wired. I won&apos;t stand up real player accounts for a business without permission. The admin surface
              still sits behind a real session + role check; it&apos;s the public account system that&apos;s deliberately absent.
            </p>
            <Note>
              Stating the constraint is the point. A portfolio piece that pretends to be a running business is a
              small lie; one that shows the full engineering surface and names what it deliberately didn&apos;t do is honest.
            </Note>
          </Entry>

          {/* ── RETROSPECTIVE ── */}
          <Entry label="RETROSPECTIVE" title="The boring middle is the product">
            <p>
              FixFlow and SiteScribe are the same thesis twice: take an unstructured real-world input - a forwarded
              tenant WhatsApp, a spoken site note - and turn it into clean, auditable paperwork an Irish SME can rely on.
            </p>
            <p>
              The temptation is to chase a flashy feature. The actual value is owning the unglamorous middle: intake,
              triage, structured storage, approval, export, and an audit trail that holds up when a dispute lands.
              That&apos;s where the moat is, and it&apos;s the part most demos skip.
            </p>
          </Entry>

          <Entry label="RETROSPECTIVE" title="On building this portfolio in the open">
            <p>
              The first version of this site was AI slop: violet-on-black, ambient glow, glassmorphism, a fake
              &ldquo;available&rdquo; pulse, and copy that overclaimed. It read like every other generated portfolio.
            </p>
            <p>
              The rebuild treats the portfolio as a changelog of a builder in active development - warm paper,
              hand-built, dated, honest about what&apos;s shipped versus what&apos;s in build. The discipline is a single rule:
              no invented metrics, and the whole metaphor has to be true.
            </p>
            <Note>
              This page is part of that. If you&apos;re reading it, you wanted more than the surface layer - which is the
              kind of curiosity I want to work with.
            </Note>
          </Entry>

          {/* ── EXPERIMENTS ── */}
          <div id="experiments" className="pt-4">
            <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--idw-outline)" }}>
              Experiments
            </p>
            <h2 className="idw-display mb-2" style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)", letterSpacing: "-0.02em", color: "var(--idw-ink)" }}>
              Ideas in Progress
            </h2>
            <p className="text-[14px] mb-10" style={{ color: "var(--idw-outline)" }}>
              Unshipped. Some are prototypes, some are still scoped. Stated as such.
            </p>
          </div>

          <Entry label="EXPERIMENT.01" title="Quantitative portfolio tool">
            <p>
              An extension of the Quant Finance Engine (VAULT.08): take the systematic strategy that backtested to a
              Sharpe of roughly 2.5-2.8 at ~5% drawdown and move it toward live portfolios - market data, rebalancing
              suggestions from mean-variance optimisation, user-defined risk tolerance.
            </p>
            <Note>
              Status: the models work on historical data; the live-data and broker integration is the gap, and the
              constraint there is regulatory more than technical.
            </Note>
          </Entry>

          <Entry label="EXPERIMENT.02" title="Finishing the CF Satellite suite">
            <p>
              CF Satellite (VAULT.09) is a toolkit for print-on-demand creators - five of sixteen planned tools are
              functional today (the Fabric.js mockup editor, collage maker, bulk-ZIP export, and a couple of
              generators); the rest are scaffolded.
            </p>
            <Note>
              Status: proving the canvas/export pattern on the live tools before building the remaining eleven against it.
            </Note>
          </Entry>

          <Entry label="EXPERIMENT.03" title="Going deeper on Go and agentic AI">
            <p>
              Currently learning Go and LangChain, with an interest in multi-agent setups where the disagreement
              between agents is the signal - flagging where a decision isn&apos;t obvious rather than merging outputs into
              false consensus. The assistant on this site is the small, honest version: a grounded local retriever over
              a curated record that won&apos;t pretend to know more than it does.
            </p>
            <Note>Status: reading and prototyping. Nothing shipped here yet, and it&apos;s labelled that way.</Note>
          </Entry>

          {/* Footer */}
          <div className="pt-12 border-t" style={{ borderColor: "var(--idw-hairline)" }}>
            <div className="flex flex-wrap gap-3 idw-mono text-[12px] uppercase tracking-widest">
              <Link href="/projects" className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                Back to the vault →
              </Link>
              <Link href="/assistant" className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                Ask about any of this →
              </Link>
            </div>
            <p className="mt-6 idw-mono text-[11px]" style={{ color: "var(--idw-outline)" }}>
              ◈ This page is not linked from the main navigation.
            </p>
          </div>
        </div>
      </main>
    </WorkshopShell>
  );
}
