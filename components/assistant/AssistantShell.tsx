"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import { projects } from "@/data/projects";
import { retrieveResponse, type KnowledgeEntry } from "@/data/chatKnowledge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AIResponse {
  status?: string;
  lede: string;
  bullets: string[];
  deepDive?: string;
}

interface Message {
  id: string;
  query: string;
  entry: KnowledgeEntry;
  aiMode?: Mode;
  aiResponse?: AIResponse;
}

type Mode = "recruiter" | "engineer";

// ─── Constants ───────────────────────────────────────────────────────────────

const PROMPT_CHIPS = [
  "Why should we hire Shrey?",
  "What are you building now?",
  "Tell me about Strandline Gaming.",
  "Why the career gap?",
];

const TOPICS: { label: string; query: string }[] = [
  { label: "Hire / fit", query: "Why should we hire Shrey?" },
  { label: "Building now", query: "What are you building now?" },
  { label: "Backend & real-time", query: "Show backend and real-time work." },
  { label: "AI integration", query: "Show AI workflow examples." },
  { label: "FinTech & quant", query: "Tell me about the quant finance work." },
  { label: "Architecture", query: "How do you architect systems?" },
  { label: "The timeline", query: "Walk me through the timeline and the gap." },
];

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Referenced dossier links ─────────────────────────────────────────────────

function ReferencedProjects({ entry }: { entry: KnowledgeEntry }) {
  const slugs = entry.context.projectSlugs?.length
    ? entry.context.projectSlugs
    : entry.context.architectureSlug
      ? [entry.context.architectureSlug]
      : entry.relatedProjects;
  if (!slugs || slugs.length === 0) return null;

  const refs = slugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3);
  if (refs.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {refs.map((p) => (
        <Link
          key={p!.slug}
          href={`/projects/${p!.slug}`}
          className="idw-navlink idw-mono text-[11px] uppercase tracking-wider px-2 py-1 border"
          style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-blue)" }}
        >
          {p!.systemId} {p!.title} →
        </Link>
      ))}
    </div>
  );
}

// ─── Deep-dive accordion (engineer mode) ──────────────────────────────────────

function DeepDive({ id, content, expanded, onToggle }: {
  id: string;
  content: string;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-4">
      <button
        onClick={() => onToggle(id)}
        className="idw-navlink idw-mono text-[11px] uppercase tracking-widest flex items-center gap-2"
        style={{ color: "var(--idw-ember)" }}
      >
        <span className="inline-block transition-transform duration-200" style={{ transform: expanded ? "rotate(90deg)" : "none" }}>›</span>
        {expanded ? "Collapse" : "Engineering depth"}
      </button>
      {expanded && (
        <p className="mt-3 pl-4 text-[15px] leading-relaxed" style={{ borderLeft: "2px solid var(--idw-hairline)", color: "var(--idw-ink-2)" }}>
          {content}
        </p>
      )}
    </div>
  );
}

// ─── Message block ────────────────────────────────────────────────────────────

function MessageBlock({ message, mode, expanded, onToggleDeepDive }: {
  message: Message;
  mode: Mode;
  expanded: boolean;
  onToggleDeepDive: (id: string) => void;
}) {
  const fallback = mode === "recruiter" ? message.entry.recruiter : message.entry.engineer;
  const content = message.aiMode === mode && message.aiResponse ? message.aiResponse : fallback;

  return (
    <div className="flex flex-col gap-4 py-6 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
      {/* User query */}
      <div className="flex flex-col items-end self-end max-w-[85%]">
        <span className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1 pr-1" style={{ color: "var(--idw-outline)" }}>
          USER_QUERY
        </span>
        <div className="px-4 py-3 text-[15px]" style={{ background: "var(--idw-paper-2)", border: "1px solid var(--idw-hairline)", color: "var(--idw-ink)" }}>
          {message.query}
        </div>
      </div>

      {/* Record response */}
      <div className="flex flex-col items-start max-w-[88%]">
        <span className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1 pl-1" style={{ color: "var(--idw-outline)" }}>
          RECORD_SYSTEM
        </span>
        <div className="pl-4 py-1" style={{ borderLeft: "2px solid var(--idw-ink)" }}>
          <p className="idw-display leading-relaxed mb-4" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)", color: "var(--idw-ink)" }}>
            {content.lede}
          </p>
          <ul className="space-y-2.5">
            {content.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>
                <span className="shrink-0 mt-0.5" style={{ color: "var(--idw-ember)" }}>·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {mode === "engineer" && "deepDive" in content && content.deepDive && (
            <DeepDive id={message.id} content={content.deepDive} expanded={expanded} onToggle={onToggleDeepDive} />
          )}
          <ReferencedProjects entry={message.entry} />
        </div>
      </div>
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────

export function AssistantShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("recruiter");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedDeepDives, setExpandedDeepDives] = useState<Set<string>>(new Set());

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleSubmit = useCallback(
    async (query: string) => {
      if (!query.trim() || isTyping) return;
      const trimmed = query.trim();
      setInput("");
      setIsTyping(true);

      const entry = retrieveResponse(trimmed);
      const id = uid();

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const res = await fetch(`${apiBase}/api/assistant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed, mode }),
        });
        if (res.ok) {
          const aiResponse = (await res.json()) as AIResponse;
          setMessages((prev) => [...prev, { id, query: trimmed, entry, aiMode: mode, aiResponse }]);
        } else {
          setMessages((prev) => [...prev, { id, query: trimmed, entry }]);
        }
      } catch {
        setMessages((prev) => [...prev, { id, query: trimmed, entry }]);
      }

      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [isTyping, mode]
  );

  const toggleDeepDive = useCallback((id: string) => {
    setExpandedDeepDives((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-8 w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* ── Marginalia (left) ── */}
        <aside className="md:col-span-4 md:sticky md:top-28 md:pr-8 md:border-r" style={{ borderColor: "var(--idw-hairline)" }}>
          <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--idw-outline)" }}>
            01 [ASSISTANT] // v2026.06
          </p>
          <h1 className="idw-display font-bold tracking-[-0.02em] leading-[1.05] mb-3" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
            Ask the record
          </h1>
          <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--idw-ink-2)" }}>
            A conversational portal into the work, the logic, and the timeline - answered from a curated record of real builds.
          </p>

          {/* Mode toggle */}
          <div className="flex gap-0.5 p-0.5 w-fit mb-7" style={{ background: "var(--idw-paper-2)", border: "1px solid var(--idw-hairline)" }}>
            {(["recruiter", "engineer"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="idw-mono text-[11px] uppercase tracking-widest px-3 py-1.5 transition-colors"
                style={
                  mode === m
                    ? { background: "var(--idw-ink)", color: "var(--idw-paper)" }
                    : { color: "var(--idw-ink-2)" }
                }
              >
                {m}
              </button>
            ))}
          </div>

          {/* Topics */}
          <p className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--idw-outline)" }}>
            Topics
          </p>
          <div className="flex flex-col mb-7">
            {TOPICS.map((t) => (
              <button
                key={t.label}
                onClick={() => handleSubmit(t.query)}
                disabled={isTyping}
                className="idw-row group text-left flex items-center gap-2 py-1.5 text-[14px] disabled:opacity-50"
                style={{ color: "var(--idw-ink-2)" }}
              >
                <span className="idw-mono text-[11px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--idw-ember)" }}>›</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Operational note */}
          <div className="hidden md:block pt-4 border-t" style={{ borderColor: "var(--idw-hairline)" }}>
            <p className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--idw-outline)" }}>
              Operational note
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>
              Answers come from a curated record of real work - it won&apos;t pretend to know more than it does.
            </p>
          </div>
        </aside>

        {/* ── Chat canvas (right) ── */}
        <section className="md:col-span-8 flex flex-col w-full md:h-[calc(100vh-200px)] md:min-h-[520px]">
          {/* Prompt chips */}
          <div className="w-full overflow-x-auto pb-3 mb-3 border-b" style={{ borderColor: "var(--idw-hairline)" }}>
            <div className="flex flex-nowrap gap-2">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSubmit(chip)}
                  disabled={isTyping}
                  className="idw-row whitespace-nowrap idw-mono text-[12px] px-3 py-1.5 border transition-colors disabled:opacity-50"
                  style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-ink-2)" }}
                >
                  &ldquo;{chip}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="flex-grow md:overflow-y-auto pr-1" aria-live="polite" aria-label="Conversation">
            {/* Initial system message */}
            <div className="flex flex-col items-start max-w-[88%] pt-2">
              <span className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1 pl-1" style={{ color: "var(--idw-outline)" }}>
                RECORD_SYSTEM
              </span>
              <div className="pl-4 py-1" style={{ borderLeft: "2px solid var(--idw-ink)" }}>
                <p className="idw-display leading-relaxed" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)", color: "var(--idw-ink)" }}>
                  Initializing query context… Ready to parse the real record - projects, architecture, and the timeline. What are you investigating?
                </p>
              </div>
            </div>

            {messages.map((m) => (
              <MessageBlock
                key={m.id}
                message={m}
                mode={mode}
                expanded={expandedDeepDives.has(m.id)}
                onToggleDeepDive={toggleDeepDive}
              />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 py-5 pl-1">
                <span className="idw-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>RECORD_SYSTEM</span>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--idw-outline)", animation: `idwTyping 1.4s ${(i - 2) * 0.16}s infinite ease-in-out both` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--idw-hairline)" }}>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(input);
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Inject query string here…"
                disabled={isTyping}
                spellCheck={false}
                autoComplete="off"
                className="flex-grow bg-transparent border-0 border-b idw-mono text-[13px] px-0 py-2 resize-none outline-none focus:border-b-2"
                style={{ borderColor: "var(--idw-outline)", color: "var(--idw-ink)" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-4 py-2 border disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--idw-ink)" }}
              >
                Send
              </button>
            </form>
            <p className="idw-mono text-[10px] lowercase tracking-wide mt-2" style={{ color: "var(--idw-outline)" }}>
              * grounded local mode - {messages.length} {messages.length === 1 ? "exchange" : "exchanges"}
            </p>
          </div>
        </section>
      </main>
    </WorkshopShell>
  );
}
