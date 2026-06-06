"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";

// ─── "Leave a mark" - the public guestbook form (warm-paper port of Stitch). ──
// Honest copy: opt-in only, you choose what to share, delete anytime.

const LIMITS = { name: 80, role: 60, org: 80, link: 200, message: 600 };

type State = "idle" | "submitting" | "done" | "error";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="idw-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--idw-outline)" }}>
        {label}
        {hint && <span className="font-normal normal-case tracking-normal"> · {hint}</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputStyle = {
  borderColor: "var(--idw-hairline)",
  color: "var(--idw-ink)",
  background: "transparent",
};

export function LeaveAMark() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({ name: "", role: "", org: "", link: "", message: "" });
  const [consent, setConsent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setError("");
    if (!form.message.trim()) {
      setError("A message is required.");
      setState("error");
      return;
    }
    if (!consent) {
      setError("Please tick the consent box to store your signature.");
      setState("error");
      return;
    }
    setState("submitting");
    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent }),
      });
      if (res.ok) {
        setState("done");
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 pt-10 md:pt-16 pb-20 w-full">
        <div className="max-w-2xl md:pl-6" style={{ borderLeft: "1px solid var(--idw-hairline)" }}>
          <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--idw-outline)" }}>
            [Module_Logbook] // Guest
          </p>
          <h1 className="idw-display font-bold tracking-[-0.02em] leading-[1.05] mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)" }}>
            Passing through?<br />You don&apos;t have to be a stranger.
          </h1>
          <p className="text-[17px] leading-relaxed mb-10" style={{ color: "var(--idw-ink-2)" }}>
            Sign the workbench log - totally optional. Opt-in only, you choose what to share, and you can ask to have it deleted anytime.
          </p>

          {state === "done" ? (
            <div className="p-6" style={{ border: "1px solid var(--idw-ink)", background: "var(--idw-paper-2)" }}>
              <p className="idw-mono text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--idw-ember)" }}>
                ✓ Received
              </p>
              <p className="idw-display text-[20px] mb-2" style={{ color: "var(--idw-ink)" }}>
                Thanks - your note is in the queue.
              </p>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--idw-ink-2)" }}>
                It&apos;ll show up on the log once Shrey has had a look. (He reads every one.)
              </p>
              <div className="flex flex-wrap gap-3 idw-mono text-[12px] uppercase tracking-widest">
                <Link href="/guestbook" className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                  See the log →
                </Link>
                <Link href="/projects" className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                  Browse the vault →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Name" hint="optional">
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    maxLength={LIMITS.name}
                    placeholder="Ada Lovelace"
                    className="w-full bg-transparent border-b px-0 py-2 outline-none focus:border-b-2 text-[15px]"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Role" hint="optional">
                  <input
                    type="text"
                    value={form.role}
                    onChange={set("role")}
                    maxLength={LIMITS.role}
                    placeholder="Engineer"
                    className="w-full bg-transparent border-b px-0 py-2 outline-none focus:border-b-2 text-[15px]"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Where from" hint="optional">
                  <input
                    type="text"
                    value={form.org}
                    onChange={set("org")}
                    maxLength={LIMITS.org}
                    placeholder="Company, team, or city"
                    className="w-full bg-transparent border-b px-0 py-2 outline-none focus:border-b-2 text-[15px]"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Link" hint="optional">
                  <input
                    type="url"
                    value={form.link}
                    onChange={set("link")}
                    maxLength={LIMITS.link}
                    placeholder="https://…"
                    className="w-full bg-transparent border-b px-0 py-2 outline-none focus:border-b-2 text-[15px]"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="Message" hint="required">
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  maxLength={LIMITS.message}
                  rows={4}
                  required
                  placeholder="Leave a note on the workbench…"
                  className="w-full bg-transparent border px-3 py-2.5 outline-none focus:border-2 resize-none text-[15px] leading-relaxed"
                  style={inputStyle}
                />
                <span className="idw-mono text-[10px] block text-right mt-1" style={{ color: "var(--idw-outline)" }}>
                  {form.message.length}/{LIMITS.message}
                </span>
              </Field>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 shrink-0 accent-[var(--idw-ember)]"
                  style={{ width: 16, height: 16 }}
                />
                <span className="text-[14px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>
                  I&apos;m okay with Shrey storing this signature so he can read it. No marketing, no sharing -
                  and I can ask to have it removed at any time.
                </span>
              </label>

              {state === "error" && error && (
                <p className="idw-mono text-[12px]" style={{ color: "var(--idw-ember)" }}>
                  ✕ {error}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-6 py-3 border disabled:opacity-50"
                  style={{ borderColor: "var(--idw-ink)", background: "var(--idw-ember)", color: "var(--idw-paper)" }}
                >
                  {state === "submitting" ? "Signing…" : "Sign it"}
                </button>
                <Link href="/" className="idw-navlink idw-mono text-[12px] uppercase tracking-widest" style={{ color: "var(--idw-ink-2)" }}>
                  Maybe later
                </Link>
              </div>

              <p className="idw-mono text-[10px] uppercase tracking-wider pt-4 border-t" style={{ color: "var(--idw-outline)", borderColor: "var(--idw-hairline)" }}>
                Opt-in only · you choose what to share · delete anytime
              </p>
            </form>
          )}
        </div>
      </main>
    </WorkshopShell>
  );
}
