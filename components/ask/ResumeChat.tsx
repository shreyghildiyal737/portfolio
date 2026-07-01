"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { SourceCard } from "./SourceCard";
import type { ChatResponse, Confidence } from "@/lib/rag/types";

const SUGGESTED = [
  "Summarize Shrey for a recruiter",
  "What backend experience does Shrey have?",
  "Is Shrey suitable for a full-stack developer role?",
  "What AI projects has Shrey built?",
  "What evidence supports his Java/Spring Boot experience?",
  "What are his strongest projects?",
];

const TRUST = [
  { label: "Grounded in his real record", color: "var(--idw-ember)" },
  { label: "Cites its sources", color: "var(--idw-blue)" },
  { label: "Says when it doesn't know", color: "var(--idw-outline)" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

interface Turn {
  id: string;
  question: string;
  response?: ChatResponse;
  error?: boolean;
}

// ─── Inline icons (inherit currentColor, no extra deps) ───────────────────────

function Icon({ name }: { name: "copy" | "check" | "retry" | "arrow" }) {
  const common = {
    width: 13,
    height: 13,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { flexShrink: 0 },
  };
  const paths: Record<string, React.ReactNode> = {
    copy: (
      <>
        <rect x="5.5" y="5.5" width="8" height="8" rx="1" />
        <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
      </>
    ),
    check: <path d="M3 8.5l3.2 3.2L13 4.5" />,
    retry: (
      <>
        <path d="M13 8a5 5 0 1 1-1.4-3.5" />
        <path d="M13 2.5V6H9.5" />
      </>
    ),
    arrow: <path d="M3 8h9M8.5 4l4 4-4 4" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const CONFIDENCE: Record<Confidence, { color: string; label: string }> = {
  high: { color: "var(--idw-blue)", label: "High confidence" },
  medium: { color: "var(--idw-ember)", label: "Medium confidence" },
  low: { color: "var(--idw-outline)", label: "Low confidence" },
};

function ConfidenceBadge({ confidence, mode }: { confidence: Confidence; mode: string }) {
  const c = CONFIDENCE[confidence];
  return (
    <span className="inline-flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: c.color }}
        />
        <span
          className="idw-mono text-[9px] font-bold uppercase tracking-widest"
          style={{ color: c.color }}
        >
          {c.label}
        </span>
      </span>
      <span
        className="idw-mono text-[9px] uppercase tracking-widest"
        style={{ color: "var(--idw-outline)" }}
      >
        {mode === "rag" ? "vector retrieval" : "keyword fallback"}
      </span>
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button
      onClick={copy}
      className="idw-navlink idw-mono text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5"
      style={{ color: copied ? "var(--idw-ember)" : "var(--idw-ink-2)" }}
      aria-label="Copy answer"
    >
      <Icon name={copied ? "check" : "copy"} />
      {copied ? "copied" : "copy"}
    </button>
  );
}

// ─── A single exchange ────────────────────────────────────────────────────────

function AnswerBlock({
  turn,
  onFollowUp,
  onRetry,
}: {
  turn: Turn;
  onFollowUp: (q: string) => void;
  onRetry: (q: string) => void;
}) {
  const r = turn.response;

  return (
    <div className="flex flex-col gap-5 py-7 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
      {/* User query */}
      <div className="flex flex-col items-end self-end max-w-[90%] md:max-w-[80%]">
        <span
          className="idw-mono text-[9px] font-bold uppercase tracking-widest mb-1.5 pr-1"
          style={{ color: "var(--idw-outline)" }}
        >
          You asked
        </span>
        <div
          className="px-4 py-2.5 text-[15px] leading-snug"
          style={{ background: "var(--idw-paper-2)", border: "1px solid var(--idw-hairline)", color: "var(--idw-ink)" }}
        >
          {turn.question}
        </div>
      </div>

      {/* Assistant answer */}
      <div className="flex flex-col items-start w-full">
        <span
          className="idw-mono text-[9px] font-bold uppercase tracking-widest mb-1.5 pl-1"
          style={{ color: "var(--idw-outline)" }}
        >
          AI Resume
        </span>

        {turn.error ? (
          <div
            className="w-full pl-4 py-4 pr-4"
            style={{ borderLeft: "2px solid var(--idw-ember)", background: "var(--idw-paper-2)" }}
          >
            <p className="text-[14px] mb-3" style={{ color: "var(--idw-ink-2)" }}>
              Something interrupted the assistant. The connection may have timed out.
            </p>
            <button
              onClick={() => onRetry(turn.question)}
              className="idw-cta idw-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border inline-flex items-center gap-2"
              style={{ borderColor: "var(--idw-ink)" }}
            >
              <Icon name="retry" /> Retry
            </button>
          </div>
        ) : r ? (
          <div className="pl-4 md:pl-5 py-1 w-full" style={{ borderLeft: "2px solid var(--idw-ink)" }}>
            {/* The answer - the headline of the card */}
            <p
              className="idw-display leading-relaxed whitespace-pre-wrap mb-4"
              style={{ fontSize: "clamp(1.05rem, 1.55vw, 1.25rem)", color: "var(--idw-ink)" }}
            >
              {r.answer}
            </p>

            {/* Meta row: confidence + copy */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-5 pb-1">
              <ConfidenceBadge confidence={r.confidence} mode={r.mode} />
              <CopyButton text={r.answer} />
            </div>

            {/* Evidence */}
            {r.sources.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-2.5">
                  <span
                    className="idw-mono text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--idw-outline)" }}
                  >
                    Evidence
                  </span>
                  <div className="h-px flex-grow" style={{ background: "var(--idw-hairline)" }} />
                  <span
                    className="idw-mono text-[9px] tabular-nums tracking-widest"
                    style={{ color: "var(--idw-outline)" }}
                  >
                    {String(r.sources.length).padStart(2, "0")} sources
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {r.sources.map((s, i) => (
                    <SourceCard key={i} source={s} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Follow-ups */}
            {r.followUps.length > 0 && (
              <div>
                <span
                  className="idw-mono text-[9px] font-bold uppercase tracking-widest block mb-2"
                  style={{ color: "var(--idw-outline)" }}
                >
                  Ask next
                </span>
                <div className="flex flex-wrap gap-2">
                  {r.followUps.map((f) => (
                    <button
                      key={f}
                      onClick={() => onFollowUp(f)}
                      className="idw-row idw-mono text-[11px] px-2.5 py-1.5 border inline-flex items-center gap-1.5 transition-colors"
                      style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-blue)" }}
                    >
                      {f}
                      <Icon name="arrow" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export function ResumeChat({ sectionCount }: { sectionCount?: number }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, loading]);

  const submit = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || loading) return;
      setInput("");
      setLoading(true);
      const id = uid();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const response = (await res.json()) as ChatResponse;
        setTurns((prev) => [...prev, { id, question, response }]);
      } catch {
        setTurns((prev) => [...prev, { id, question, error: true }]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [loading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const isEmpty = turns.length === 0 && !loading;

  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-5 md:px-12 pt-8 md:pt-12 pb-10 w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
        {/* ── Marginalia (left) ── */}
        <aside
          className="md:col-span-4 min-w-0 md:sticky md:top-28 md:pr-8 md:border-r"
          style={{ borderColor: "var(--idw-hairline)" }}
        >
          <p
            className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-4"
            style={{ color: "var(--idw-outline)" }}
          >
            01 [AI RESUME] // RAG
          </p>
          <h1
            className="idw-display font-bold tracking-[-0.02em] leading-[1.05] mb-3"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
          >
            Ask my AI Resume
          </h1>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--idw-ink-2)" }}>
            A recruiter-focused assistant grounded in my verified resume, projects, and
            experience. Every answer cites the evidence behind it.
          </p>

          {/* Trust signals - what makes this not a generic chatbot */}
          <ul className="flex flex-col gap-1.5 mb-7">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.color }} />
                <span className="idw-mono text-[11px] tracking-wide" style={{ color: "var(--idw-ink-2)" }}>
                  {t.label}
                </span>
              </li>
            ))}
          </ul>

          <p
            className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--idw-outline)" }}
          >
            Try asking
          </p>
          <div className="mb-7">
            <SuggestedQuestions
              questions={SUGGESTED}
              onSelect={submit}
              disabled={loading}
              variant="list"
            />
          </div>

          <div className="pt-5 border-t" style={{ borderColor: "var(--idw-hairline)" }}>
            <p
              className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
              style={{ color: "var(--idw-outline)" }}
            >
              How it works
            </p>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--idw-ink-2)" }}>
              This assistant answers only from Shrey&apos;s resume and portfolio knowledge base
              {typeof sectionCount === "number" && sectionCount > 0
                ? ` (${sectionCount} verified sections)`
                : ""}
              . If the evidence is missing, it will say so.
            </p>
            <Link
              href="/"
              className="idw-cta idw-mono text-[11px] uppercase tracking-widest inline-flex items-center gap-2 px-3.5 py-2 border"
              style={{ borderColor: "var(--idw-ink)" }}
            >
              <span style={{ transform: "scaleX(-1)", display: "inline-flex" }}>
                <Icon name="arrow" />
              </span>
              Back to portfolio
            </Link>
          </div>
        </aside>

        {/* ── Chat canvas (right) ── */}
        <section className="md:col-span-8 min-w-0 flex flex-col w-full md:h-[calc(100vh-200px)] md:min-h-[560px]">
          {/* Status bar */}
          <div
            className="flex items-center justify-between gap-3 pb-3 mb-1 border-b"
            style={{ borderColor: "var(--idw-hairline)" }}
          >
            <span className="idw-mono text-[10px] uppercase tracking-widest inline-flex items-center gap-2" style={{ color: "var(--idw-ink-2)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--idw-ember)" }} />
              AI Resume Assistant
            </span>
            {turns.length > 0 && (
              <button
                onClick={() => setTurns([])}
                className="idw-navlink idw-mono text-[10px] uppercase tracking-widest shrink-0"
                style={{ color: "var(--idw-outline)" }}
              >
                clear
              </button>
            )}
          </div>

          <div className="flex-grow md:overflow-y-auto pr-0 md:pr-1" aria-live="polite" aria-label="Conversation">
            {isEmpty && (
              <div className="pt-6 md:pt-8">
                <span
                  className="idw-mono text-[9px] font-bold uppercase tracking-widest mb-2 block"
                  style={{ color: "var(--idw-outline)" }}
                >
                  AI Resume
                </span>
                <div className="pl-4 md:pl-5 py-1 mb-8" style={{ borderLeft: "2px solid var(--idw-ink)" }}>
                  <p
                    className="idw-display leading-relaxed"
                    style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.35rem)", color: "var(--idw-ink)" }}
                  >
                    Ask about Shrey&apos;s experience, projects, skills, or fit for a role. I
                    answer from his verified record and show the evidence behind every claim.
                  </p>
                </div>

                <p
                  className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--idw-outline)" }}
                >
                  Start with
                </p>
                <SuggestedQuestions
                  questions={SUGGESTED.slice(0, 4)}
                  onSelect={submit}
                  disabled={loading}
                  variant="chips"
                />
              </div>
            )}

            {turns.map((t) => (
              <AnswerBlock key={t.id} turn={t} onFollowUp={submit} onRetry={submit} />
            ))}

            {loading && (
              <div className="flex items-center gap-3 py-7 pl-1">
                <span
                  className="idw-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--idw-outline)" }}
                >
                  Searching the record
                </span>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--idw-outline)", animation: `idwTyping 1.4s ${(i - 2) * 0.16}s infinite ease-in-out both` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--idw-hairline)" }}>
            <form
              className="flex items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={1000}
                aria-label="Ask a question about Shrey's resume"
                placeholder="Ask about Shrey's experience, projects, or skills…"
                disabled={loading}
                spellCheck={false}
                autoComplete="off"
                className="flex-grow bg-transparent border-0 border-b idw-mono text-[13px] px-0 py-2 resize-none outline-none focus:border-b-2"
                style={{ borderColor: "var(--idw-outline)", color: "var(--idw-ink)" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-5 py-2 border disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--idw-ink)" }}
              >
                Send
              </button>
            </form>
            <p
              className="idw-mono text-[10px] lowercase tracking-wide mt-2.5"
              style={{ color: "var(--idw-outline)" }}
            >
              * answers only from Shrey&apos;s resume and portfolio - it will say when evidence is missing
            </p>
          </div>
        </section>
      </main>
    </WorkshopShell>
  );
}
