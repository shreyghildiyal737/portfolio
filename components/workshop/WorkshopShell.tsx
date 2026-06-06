"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_LINKS } from "@/lib/site";

/**
 * Shared "Inventor's Workshop" page shell - warm-paper wrapper, header, footer.
 * Used by every ported route so they stay consistent. The global dark NavBar
 * is hidden on these routes (see NavBar), so this header is the only nav.
 */

const NAV = [
  { label: "work", href: "/projects" },
  { label: "record", href: "/timeline" },
  { label: "cv", href: "/recruiter" },
  { label: "ask", href: "/assistant" },
];

export function WorkshopShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="idw-home idw-grid">
      <header
        className="sticky top-0 z-50 flex justify-between items-center h-16 px-4 md:px-12 border-b print:hidden"
        style={{ background: "rgba(244,239,230,0.9)", backdropFilter: "blur(6px)", borderColor: "var(--idw-hairline)" }}
      >
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="idw-mono text-[13px]" style={{ color: "var(--idw-ember)" }}>⌁</span>
          <span className="idw-mono text-[13px] font-bold tracking-wide">SH ▚ Shrey Ghildiyal</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 idw-mono text-[12px] uppercase tracking-widest">
          <nav className="flex gap-6">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="idw-navlink"
                  style={{ color: active ? "var(--idw-ember)" : "var(--idw-ink-2)" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4 border-l pl-4" style={{ borderColor: "var(--idw-hairline)" }}>
            <span className="font-bold" style={{ color: "var(--idw-ember)" }}>v2026.06</span>
            <Link
              href="/projects"
              className="idw-cta px-4 py-2 border uppercase tracking-widest"
              style={{ borderColor: "var(--idw-ink)" }}
            >
              Vault
            </Link>
          </div>
        </div>

        <button
          className="md:hidden idw-mono text-sm"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {menuOpen && (
        <nav
          className="md:hidden flex flex-col idw-mono text-sm uppercase tracking-widest border-b"
          style={{ borderColor: "var(--idw-hairline)" }}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-4 border-b idw-row"
              style={{ borderColor: "var(--idw-hairline)", color: "var(--idw-ink-2)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      {children}

      <footer
        className="w-full border-t flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-6 mt-20 print:hidden"
        style={{ borderColor: "var(--idw-hairline)", background: "var(--idw-paper-2)" }}
      >
        <div className="idw-mono text-[11px] uppercase tracking-widest opacity-60 mb-4 md:mb-0">
          © 2026 Shrey Ghildiyal // built in Galway, roots in India
        </div>
        <nav className="flex gap-6 idw-mono text-[11px] uppercase tracking-widest">
          <a href={SITE_LINKS.github} target="_blank" rel="noreferrer" className="idw-navlink" style={{ color: "var(--idw-ink-2)" }}>source</a>
          <Link href="/timeline" className="idw-navlink" style={{ color: "var(--idw-ink-2)" }}>log</Link>
          <Link href="/guestbook" className="idw-navlink" style={{ color: "var(--idw-ink-2)" }}>guests</Link>
          <Link href="/leave-a-mark" className="idw-navlink" style={{ color: "var(--idw-ink-2)" }}>sign</Link>
          <a href={SITE_LINKS.email} className="idw-navlink" style={{ color: "var(--idw-ink-2)" }}>contact</a>
        </nav>
      </footer>
    </div>
  );
}
