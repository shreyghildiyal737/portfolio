import Link from "next/link";
import { WorkshopShell } from "@/components/workshop/WorkshopShell";
import { PrintButton } from "@/components/recruiter/PrintButton";
import { person } from "@/data/person";
import { cv } from "@/data/cv";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Portfolio Doc - Shrey Ghildiyal",
  description:
    "Printable CV: experience, selected systems, skills, education, and verified certifications for Shrey Ghildiyal - full-stack engineer & builder.",
};

// Tech-stack matrix (left rail blueprint block) - real skills + what's being learned now.
const STACK_MATRIX = [
  ...cv.skills,
  { category: "Currently Learning", items: ["Go", "Advanced LangChain", "Multi-agent AI Systems"] },
];

const EDUCATION = [
  {
    degree: "M.Sc Economics & Financial Technology",
    institution: "University of Galway (NUI Galway)",
    period: "2025 - Present",
    note: "In Progress",
  },
  {
    degree: "B.E. Computer Science",
    institution: "Chandigarh University, India",
    period: "2018 - 2022",
    note: "CGPA 7.32",
  },
];

const CONTACT = [
  { label: "github.com/shreyghildiyal737", href: person.links.github, external: true },
  { label: "linkedin.com/in/shrey-ghildiyal", href: person.links.linkedin, external: true },
  { label: person.links.email.replace("mailto:", ""), href: person.links.email, external: false },
];

function Marker({ children }: { children: React.ReactNode }) {
  return (
    <p className="idw-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--idw-outline)" }}>
      {children}
    </p>
  );
}

export default function RecruiterPage() {
  // The strongest tier for a recruiter scan.
  const selected = projects.slice(0, 5);

  return (
    <WorkshopShell>
      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-12 py-10 md:py-16 w-full">
        {/* Doc sub-bar */}
        <div className="flex justify-between items-center pb-5 mb-12 border-b" style={{ borderColor: "var(--idw-ink)" }}>
          <span className="idw-mono text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--idw-ink-2)" }}>
            00 [PORTFOLIO_DOC] // v2026.06
          </span>
          <div className="flex items-center gap-3 print:hidden">
            <PrintButton className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-4 py-2 border" />
            <Link
              href={person.links.email}
              className="idw-cta idw-mono text-[12px] uppercase tracking-widest px-4 py-2 border"
              style={{ borderColor: "var(--idw-ink)" }}
            >
              Say hello →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* ── LEFT RAIL ── */}
          <aside className="md:col-span-4 md:pr-10 md:border-r flex flex-col gap-10" style={{ borderColor: "var(--idw-hairline)" }}>
            {/* Profile */}
            <section>
              <Marker>01 // PROFILE</Marker>
              <h1 className="idw-display font-bold tracking-[-0.02em] leading-[1.0] mb-3" style={{ fontSize: "clamp(2.4rem, 5vw, 3.5rem)" }}>
                Shrey<br />Ghildiyal
              </h1>
              <p className="idw-mono text-[12px] uppercase tracking-widest mb-4" style={{ color: "var(--idw-ember)" }}>
                Full-stack engineer &amp; builder
              </p>
              <p className="text-[15px]" style={{ color: "var(--idw-ink-2)" }}>◷ Galway, Ireland</p>
            </section>

            <div className="border-t" style={{ borderColor: "var(--idw-hairline)" }} />

            {/* Contact */}
            <section>
              <Marker>02 // CONTACT_VECTOR</Marker>
              <ul className="flex flex-col gap-2 idw-mono text-[13px]">
                {CONTACT.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="idw-navlink"
                      style={{ color: "var(--idw-ink-2)" }}
                    >
                      → {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tech-stack matrix (blueprint block) */}
            <section
              className="p-5"
              style={{ background: "rgba(43,91,217,0.04)", border: "1px solid var(--idw-hairline)" }}
            >
              <Marker>03 // TECH_STACK_MATRIX</Marker>
              <div className="space-y-4">
                {STACK_MATRIX.map((group) => (
                  <div key={group.category}>
                    <p className="idw-mono text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--idw-blue)" }}>
                      {group.category}
                    </p>
                    <p className="text-[14px] leading-relaxed" style={{ color: "var(--idw-ink)" }}>
                      {group.items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Academics */}
            <section>
              <Marker>04 // ACADEMICS</Marker>
              <div className="space-y-4">
                {EDUCATION.map((edu) => (
                  <div key={edu.degree} className="pl-4" style={{ borderLeft: "1px solid var(--idw-hairline)" }}>
                    <h3 className="text-[15px] font-bold" style={{ color: "var(--idw-ink)" }}>{edu.degree}</h3>
                    <p className="idw-mono text-[12px] mt-1" style={{ color: "var(--idw-ink-2)" }}>{edu.institution}</p>
                    <p className="idw-mono text-[11px] mt-1" style={{ color: "var(--idw-outline)" }}>
                      {edu.period} · {edu.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* ── RIGHT RAIL ── */}
          <div className="md:col-span-8 flex flex-col gap-12">
            {/* Experience */}
            <section>
              <Marker>05 // CHRONOLOGICAL_EXECUTION</Marker>
              <div className="space-y-8">
                {cv.experience.map((exp, i) => {
                  const current = i === 0;
                  return (
                    <article key={exp.id} className="relative pl-6 group" style={{ borderLeft: "1px solid var(--idw-hairline)" }}>
                      <span
                        aria-hidden="true"
                        className="absolute w-2 h-2 rounded-full -left-[4.5px] top-2 transition-colors"
                        style={{ background: current ? "var(--idw-ember)" : "var(--idw-ink)" }}
                      />
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
                        <h2 className="idw-display text-[22px] leading-tight" style={{ color: "var(--idw-ink)" }}>
                          {exp.role}
                        </h2>
                        <span
                          className="idw-mono text-[12px] uppercase tracking-wider shrink-0"
                          style={{ color: current ? "var(--idw-ember)" : "var(--idw-outline)" }}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <p className="idw-mono text-[12px] mb-3" style={{ color: "var(--idw-ink-2)" }}>
                        {exp.company} · {exp.location}
                      </p>
                      <ul className="space-y-2">
                        {exp.highlights.map((h, hi) => (
                          <li key={hi} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "var(--idw-ink-2)" }}>
                            <span className="shrink-0 mt-0.5" style={{ color: "var(--idw-ember)" }}>·</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Selected systems */}
            <section>
              <Marker>06 // SELECTED_SYSTEMS</Marker>
              <div>
                {selected.map((p) => (
                  <div key={p.slug} className="py-5 border-b last:border-0" style={{ borderColor: "var(--idw-hairline)" }}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="idw-mono text-[12px]" style={{ color: "var(--idw-outline)" }}>{p.systemId}</span>
                        <h3 className="idw-display text-[18px]" style={{ color: "var(--idw-ink)" }}>{p.title}</h3>
                        <span className="idw-mono text-[11px]" style={{ color: "var(--idw-outline)" }}>{p.year}</span>
                      </div>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="idw-navlink idw-mono text-[11px] uppercase tracking-wider shrink-0 print:hidden"
                        style={{ color: "var(--idw-blue)" }}
                      >
                        Dossier →
                      </Link>
                    </div>
                    <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--idw-ink-2)" }}>{p.tagline}</p>
                    <p className="idw-mono text-[11px]" style={{ color: "var(--idw-outline)" }}>
                      {p.stack.slice(0, 5).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certification registry */}
            <section>
              <Marker>07 // CERTIFICATION_REGISTRY</Marker>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cv.certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="group p-3 flex flex-col gap-1 transition-colors"
                    style={{ border: "1px solid var(--idw-hairline)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[14px] font-bold leading-snug" style={{ color: "var(--idw-ink)" }}>{cert.name}</span>
                      <span className="idw-mono text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" style={{ color: "var(--idw-ember)" }}>
                        Verified
                      </span>
                    </div>
                    <span className="idw-mono text-[11px]" style={{ color: "var(--idw-outline)" }}>{cert.issuer} · {cert.year}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="pt-8 border-t print:hidden" style={{ borderColor: "var(--idw-hairline)" }}>
              <p className="idw-display text-[20px] mb-4" style={{ color: "var(--idw-ink)" }}>
                Open to full-stack, AI-systems, and founding-engineer roles.
              </p>
              <div className="flex flex-wrap gap-3 idw-mono text-[12px] uppercase tracking-widest">
                <Link href={person.links.email} className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                  Get in touch →
                </Link>
                <Link href="/projects" className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                  Browse the vault
                </Link>
                <Link href="/assistant" className="idw-cta px-4 py-2 border" style={{ borderColor: "var(--idw-ink)" }}>
                  Ask about the work
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </WorkshopShell>
  );
}
