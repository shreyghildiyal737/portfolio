"use client";

import type { AnswerSource } from "@/lib/rag/types";

/** Evidence card shown under an assistant answer. */
export function SourceCard({ source, index }: { source: AnswerSource; index: number }) {
  const pct =
    typeof source.similarity === "number"
      ? Math.round(source.similarity * 100)
      : null;

  return (
    <div
      className="idw-row group flex flex-col p-3.5 border"
      style={{ borderColor: "var(--idw-hairline)", background: "var(--idw-paper-2)" }}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="idw-mono text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          <span className="tabular-nums" style={{ color: "var(--idw-outline)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ color: "var(--idw-blue)" }}>{source.source_type}</span>
        </span>
        {pct !== null && (
          <span
            className="idw-mono text-[9px] tabular-nums tracking-widest shrink-0"
            style={{ color: "var(--idw-outline)" }}
          >
            {pct}%
          </span>
        )}
      </div>

      <p className="text-[13px] font-bold leading-snug mb-1" style={{ color: "var(--idw-ink)" }}>
        {source.title}
      </p>
      <p className="text-[12px] leading-relaxed flex-grow" style={{ color: "var(--idw-ink-2)" }}>
        {source.snippet}
      </p>

      {pct !== null && (
        // Static similarity track - no animation, just a quick visual read.
        <div className="h-[2px] mt-2.5 w-full" style={{ background: "var(--idw-hairline)" }}>
          <div className="h-full" style={{ width: `${pct}%`, background: "var(--idw-blue)" }} />
        </div>
      )}
      <p
        className="idw-mono text-[9px] uppercase tracking-widest mt-2"
        style={{ color: "var(--idw-outline)" }}
      >
        source · {source.source}
      </p>
    </div>
  );
}
