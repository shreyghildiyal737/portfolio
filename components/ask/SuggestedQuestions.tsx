"use client";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
  disabled?: boolean;
  /** "chips" for the entry-state row, "list" for the numbered marginalia. */
  variant?: "chips" | "list";
}

export function SuggestedQuestions({
  questions,
  onSelect,
  disabled,
  variant = "chips",
}: SuggestedQuestionsProps) {
  if (variant === "list") {
    return (
      <ul className="flex flex-col">
        {questions.map((q, i) => (
          <li key={q}>
            <button
              onClick={() => onSelect(q)}
              disabled={disabled}
              className="idw-row group w-full text-left flex items-baseline gap-3 py-2 px-2 -mx-2 text-[14px] leading-snug disabled:opacity-50"
              style={{ color: "var(--idw-ink-2)" }}
            >
              <span
                className="idw-mono text-[10px] shrink-0 tabular-nums"
                style={{ color: "var(--idw-outline)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="group-hover:translate-x-0.5 transition-transform">{q}</span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="idw-cta idw-mono text-[12px] px-3 py-2 border text-left leading-snug max-w-full break-words disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-ink-2)" }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
