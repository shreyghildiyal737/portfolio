"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { timeline } from "@/data/timeline";
import { person } from "@/data/person";

type CommandGroup = "navigate" | "projects" | "timeline" | "access";

type CommandItem = {
  id: string;
  label: string;
  description: string;
  prefix: string;
  group: CommandGroup;
  href: string;
};

const NAV_DESCRIPTIONS: Record<string, string> = {
  Narrative: "Home - the changelog of a builder in active development",
  Vault: `Project vault - ${projects.length} systems across health, property, finance, and more`,
  Timeline: `The record - ${timeline.length} phases, foundations in India to building in Ireland`,
  Transmission: "Ask the record - query the work in recruiter or engineer mode",
};

function buildCommands(): CommandItem[] {
  const navItems: CommandItem[] = person.nav.map((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    description: NAV_DESCRIPTIONS[item.label] ?? "",
    prefix: "→",
    group: "navigate",
    href: item.href,
  }));

  navItems.push({
    id: "nav-recruiter",
    label: "Recruiter Mode",
    description: "Printable CV - experience, selected systems, certifications",
    prefix: "→",
    group: "navigate",
    href: "/recruiter",
  });

  const projectItems: CommandItem[] = projects.map((p) => ({
    id: `project-${p.slug}`,
    label: p.title,
    description: p.tagline,
    prefix: p.systemId,
    group: "projects",
    href: `/projects/${p.slug}`,
  }));

  const timelineItems: CommandItem[] = timeline.map((phase) => ({
    id: `timeline-${phase.id}`,
    label: phase.title,
    description: `${phase.phase} · ${phase.period}`,
    prefix: phase.phase,
    group: "timeline",
    href: "/timeline",
  }));

  const accessItems: CommandItem[] = [
    {
      id: "archive",
      label: "Developer Archive",
      description: "Hidden route - engineering notes not meant to be indexed.",
      prefix: "◇",
      group: "access",
      href: "/archive",
    },
  ];

  return [...navItems, ...projectItems, ...timelineItems, ...accessItems];
}

const GROUP_LABELS: Record<CommandGroup, string> = {
  navigate: "Navigate",
  projects: "Projects",
  timeline: "Timeline",
  access: "Access",
};

const ALL_COMMANDS = buildCommands();

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const router = useRouter();

  // Sync open to ref after each render so event handlers read the current value
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const openPalette = useCallback(() => {
    setQuery("");
    setSelected(0);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 16);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (openRef.current) {
          setOpen(false);
        } else {
          openPalette();
        }
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, [openPalette]);

  const results = query.trim()
    ? ALL_COMMANDS.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q) ||
          cmd.prefix.toLowerCase().includes(q)
        );
      })
    : ALL_COMMANDS.filter((cmd) => cmd.group === "navigate");

  const groups = (["navigate", "projects", "timeline", "access"] as CommandGroup[])
    .map((g) => ({ group: g, items: results.filter((r) => r.group === g) }))
    .filter((g) => g.items.length > 0);

  const flatResults = groups.flatMap((g) => g.items);

  const execute = useCallback(
    (item: CommandItem) => {
      router.push(item.href);
      setOpen(false);
    },
    [router]
  );

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      const item = flatResults[selected];
      if (item) execute(item);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200]"
        style={{ background: "rgba(26,23,20,0.45)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div
        className="fixed inset-x-0 top-[18vh] mx-auto z-[201] w-full max-w-[560px] px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div
          className="overflow-hidden"
          style={{
            background: "var(--idw-paper)",
            border: "1px solid var(--idw-ink)",
            boxShadow: "0 24px 60px rgba(26,23,20,0.35)",
          }}
        >
          {/* Search row */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "var(--idw-hairline)" }}
          >
            <span className="idw-mono shrink-0 text-[14px]" style={{ color: "var(--idw-ember)" }}>
              ⌘
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(0);
              }}
              onKeyDown={handleInputKey}
              placeholder="Search commands, projects, the record…"
              className="flex-1 bg-transparent outline-none text-[15px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--idw-ink)" }}
              autoComplete="off"
              spellCheck={false}
            />
            <kbd
              className="idw-mono px-1.5 py-0.5 border shrink-0 text-[10px] tracking-wider"
              style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-outline)" }}
            >
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
            {flatResults.length === 0 ? (
              <p className="px-4 py-8 text-center text-[13px]" style={{ color: "var(--idw-outline)" }}>
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              groups.map(({ group, items }) => (
                <div key={group}>
                  <p
                    className="idw-mono px-4 pt-3 pb-1 uppercase tracking-widest text-[10px]"
                    style={{ color: "var(--idw-outline)" }}
                  >
                    {GROUP_LABELS[group]}
                  </p>
                  {items.map((item) => {
                    const idx = flatResults.indexOf(item);
                    const isSel = idx === selected;
                    return (
                      <button
                        key={item.id}
                        onClick={() => execute(item)}
                        onMouseEnter={() => setSelected(idx)}
                        className="w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors duration-75"
                        style={{
                          background: isSel ? "var(--idw-paper-2)" : "transparent",
                          borderLeft: isSel ? "2px solid var(--idw-ember)" : "2px solid transparent",
                          marginLeft: "2px",
                        }}
                      >
                        <span
                          className="idw-mono shrink-0 text-right text-[10px]"
                          style={{
                            color: "var(--idw-outline)",
                            width: "4.5rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.prefix}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[13px]" style={{ color: "var(--idw-ink)" }}>
                            {item.label}
                          </p>
                          <p className="truncate text-[11px]" style={{ color: "var(--idw-ink-2)" }}>
                            {item.description}
                          </p>
                        </div>
                        {isSel && (
                          <span className="idw-mono shrink-0 text-[11px]" style={{ color: "var(--idw-ember)" }}>
                            ↵
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            className="border-t px-4 py-2 flex items-center gap-5 idw-mono text-[10px]"
            style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-outline)" }}
          >
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span className="ml-auto">⌘K to toggle</span>
          </div>
        </div>
      </div>
    </>
  );
}
