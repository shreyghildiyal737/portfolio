// ─────────────────────────────────────────────────────────────────────────────
// ATS-friendly resume - PRINT ONLY.
// This is the document that comes out of Print / Save-as-PDF. It deliberately
// drops the warm-paper workshop design in favour of what applicant-tracking
// systems parse cleanly: one column, standard headings, real selectable text, a
// system sans-serif font, plain bullets, no icons / tints / columns / tables.
//
// The COPY here is resume-tuned (strong action verbs, achievement-first,
// results where honest) and lives LOCALLY in this component on purpose - the
// on-screen recruiter page keeps its narrative voice from data/cv.ts. Only the
// PDF changes. No invented metrics: the only numbers are real (Sharpe ~2.5-2.8,
// ~5% drawdown, CGPA 7.32).
// ─────────────────────────────────────────────────────────────────────────────

import { person } from "@/data/person";

const EMAIL = person.links.email.replace("mailto:", "");
const LINKEDIN = person.links.linkedin.replace(/^https?:\/\//, "");
const GITHUB = person.links.github.replace(/^https?:\/\//, "");
const PORTFOLIO = "shrey-ghildiyal-resume.vercel.app";
const PHONE = "+353 89 207 1390";

const SUMMARY =
  "Full-stack software engineer with Java and Spring Boot backend roots and production experience across React, Next.js, and Node.js. Proven delivery of live client products and production-grade systems spanning real-time services, applied AI, geospatial search, and security hardening. Currently building founder-stage ventures in Ireland while completing an M.Sc in Economics & Financial Technology, with quantitative finance work backtested to a Sharpe ratio of ~2.5-2.8.";

type Role = {
  title: string;
  org: string;
  location: string;
  period: string;
  bullets: string[];
};

const EXPERIENCE: Role[] = [
  {
    title: "Independent Engineer & Founder",
    org: "Self-directed",
    location: "Galway, Ireland",
    period: "March 2026 - Present",
    bullets: [
      "Designed and shipped full-stack products across property, health, construction, and music tech on Spring Boot, NestJS, and Next.js, with several advancing into an incubator pitch pipeline.",
      "Delivered a live client website (PC Trade Frames) on React, FastAPI, and MongoDB, replacing scattered phone enquiries with an automated quote-request and email workflow.",
      "Engineered a production-grade gaming-venue platform (Strandline Gaming) with geospatial nearest-venue search, rate limiting, async job queues, and security hardening, validated by a full Jest and Playwright test suite.",
      "Built a quantitative finance engine and systematic trading strategy backtested to a Sharpe ratio of ~2.5-2.8 at ~5% maximum drawdown.",
    ],
  },
  {
    title: "Software Engineer",
    org: "OneDirect (Gupshup Group)",
    location: "Bengaluru, India",
    period: "July 2022 - March 2023",
    bullets: [
      "Built and maintained Java Spring Boot microservices powering a production CRM platform serving live customer-engagement traffic.",
      "Implemented distributed event processing with Kafka and RabbitMQ, and added observability through Jaeger distributed tracing and Grafana dashboards.",
      "Owned feature development and bug resolution across the service layer, progressing from a backend hire to a full-stack contributor.",
    ],
  },
  {
    title: "Support Worker (Internship)",
    org: "NGO - Rehabilitation & Recovery",
    location: "India",
    period: "2023 - 2024",
    bullets: [
      "Supported individuals in recovery across direct-support, coordination, accounting, and administrative roles, strengthening communication and stakeholder-empathy skills carried into product work.",
    ],
  },
];

type Project = { name: string; year: string; blurb: string; tech: string };

const PROJECTS: Project[] = [
  {
    name: "PC Trade Frames",
    year: "2026",
    blurb:
      "Live client website for an Irish uPVC windows & doors business; automated quote-request and email workflow, shipped to production.",
    tech: "React, TypeScript, Tailwind CSS, FastAPI, MongoDB, Vercel",
  },
  {
    name: "Strandline Gaming",
    year: "2026",
    blurb:
      "Production-grade gaming-venue platform with geospatial search, rate limiting, async job queues, and full automated test coverage.",
    tech: "Next.js, TypeScript, Tailwind CSS, Supabase, Upstash Redis, Vercel",
  },
  {
    name: "Leaba Slan",
    year: "2026",
    blurb:
      "Real-time hospital-bed tracking and ambulance dispatch system targeting Ireland's hospital trolley crisis.",
    tech: "Node.js, TypeScript, WebSocket, BullMQ, PostgreSQL, Redis",
  },
  {
    name: "FixFlow Ireland",
    year: "2026",
    blurb:
      "Maintenance-operations platform that turns tenant messages into tracked, evidenced rental repair jobs with an audit trail.",
    tech: "Spring Boot, Java, Next.js, TypeScript, PostgreSQL",
  },
  {
    name: "SiteScribe AI",
    year: "2026",
    blurb:
      "AI tool that converts site workers' voice notes into structured construction reports for Irish site teams.",
    tech: "Java, Spring Boot, Next.js, Groq Whisper, Gemini",
  },
];

const SKILLS: { label: string; items: string }[] = [
  { label: "Languages", items: "Java, TypeScript, JavaScript, Python, SQL" },
  { label: "Frontend", items: "React, Next.js, Tailwind CSS, Framer Motion" },
  { label: "Backend", items: "Spring Boot, Node.js, NestJS, Express, FastAPI, REST APIs" },
  { label: "Data & Messaging", items: "PostgreSQL, MongoDB, Redis, Prisma, Kafka, RabbitMQ, BullMQ, Socket.IO, WebSocket" },
  { label: "AI & ML", items: "OpenAI, Claude API, Groq (Whisper), Gemini, LangChain, pgvector, Ollama" },
  { label: "Infrastructure", items: "Docker, AWS S3, Supabase, Vercel, Jaeger, Grafana" },
  { label: "Currently Learning", items: "Go, Advanced LangChain, Multi-agent AI Systems" },
];

const EDUCATION = [
  {
    degree: "M.Sc Economics & Financial Technology",
    institution: "University of Galway (NUI Galway), Ireland",
    period: "2025 - Present",
    note: "In progress",
  },
  {
    degree: "B.E. Computer Science",
    institution: "Chandigarh University, India",
    period: "2018 - 2022",
    note: "CGPA 7.32",
  },
];

const CERTS = [
  { name: "FinTech: Foundations, Payments, and Regulations", issuer: "Wharton, University of Pennsylvania (Coursera)", year: "2025" },
  { name: "Introduction to Data Analytics", issuer: "IBM (Coursera)", year: "2025" },
  { name: "Foundations: Data, Data, Everywhere", issuer: "Google (Coursera)", year: "2025" },
  { name: "Cybersecurity for Everyone", issuer: "University of Maryland (Coursera)", year: "2025" },
  { name: "Algorithms on Graphs", issuer: "UC San Diego (Coursera)", year: "2021" },
  { name: "R Programming", issuer: "Johns Hopkins University (Coursera)", year: "2021" },
  { name: "Data Structures in Java (Top Performer)", issuer: "Coding Ninjas", year: "2020" },
];

// ── Plain, ATS-safe primitives ──────────────────────────────────────────────
const ink = { color: "#000000" } as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "13px" }}>
      <h2
        style={{
          ...ink,
          fontSize: "11.5pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          margin: "0 0 6px",
          paddingBottom: "3px",
          borderBottom: "1.2px solid #000000",
          breakAfter: "avoid",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function EntryHead({ left, right }: { left: string; right: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
      <span style={{ ...ink, fontWeight: 700, fontSize: "10.5pt" }}>{left}</span>
      <span style={{ ...ink, fontSize: "9.5pt", whiteSpace: "nowrap" }}>{right}</span>
    </div>
  );
}

export function AtsResume() {
  return (
    <div
      aria-hidden="true"
      className="hidden print:block"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "10pt",
        lineHeight: 1.38,
        color: "#000000",
        background: "#ffffff",
        maxWidth: "7.5in",
        margin: "0 auto",
      }}
    >
      {/* Header - name + contact in the document body (not a print header region) */}
      <header style={{ textAlign: "center", paddingBottom: "8px", borderBottom: "1.5px solid #000000" }}>
        <h1 style={{ ...ink, fontSize: "21pt", fontWeight: 700, letterSpacing: "0.01em", margin: 0 }}>
          {person.name}
        </h1>
        <p style={{ ...ink, fontSize: "11pt", fontWeight: 600, margin: "2px 0 5px" }}>Full-stack Software Engineer</p>
        <p style={{ ...ink, fontSize: "9.5pt", margin: 0 }}>
          {EMAIL} &nbsp;|&nbsp; {PHONE} &nbsp;|&nbsp; Galway, Ireland
        </p>
        <p style={{ ...ink, fontSize: "9.5pt", margin: "2px 0 0" }}>
          {LINKEDIN} &nbsp;|&nbsp; {GITHUB} &nbsp;|&nbsp; {PORTFOLIO}
        </p>
      </header>

      <Section title="Professional Summary">
        <p style={{ ...ink, margin: 0 }}>{SUMMARY}</p>
      </Section>

      <Section title="Experience">
        {EXPERIENCE.map((r, i) => (
          <div key={r.title} style={{ marginTop: i === 0 ? 0 : "9px", breakInside: "avoid" }}>
            <EntryHead left={r.title} right={r.period} />
            <div style={{ ...ink, fontSize: "10pt", fontStyle: "italic", margin: "1px 0 0" }}>
              {r.org} | {r.location}
            </div>
            <ul style={{ margin: "3px 0 0", paddingLeft: "17px" }}>
              {r.bullets.map((b, bi) => (
                <li key={bi} style={{ ...ink, marginBottom: "2px" }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Key Projects">
        {PROJECTS.map((p, i) => (
          <div key={p.name} style={{ marginTop: i === 0 ? 0 : "6px", breakInside: "avoid" }}>
            <div style={{ ...ink }}>
              <span style={{ fontWeight: 700, fontSize: "10.5pt" }}>{p.name}</span>
              <span style={{ fontSize: "9.5pt" }}> ({p.year})</span>
            </div>
            <p style={{ ...ink, margin: "1px 0" }}>{p.blurb}</p>
            <p style={{ ...ink, fontSize: "9.5pt", margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Tech:</span> {p.tech}
            </p>
          </div>
        ))}
      </Section>

      <Section title="Technical Skills">
        <ul style={{ margin: 0, paddingLeft: "17px" }}>
          {SKILLS.map((s) => (
            <li key={s.label} style={{ ...ink, marginBottom: "2px" }}>
              <span style={{ fontWeight: 700 }}>{s.label}:</span> {s.items}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        {EDUCATION.map((e, i) => (
          <div key={e.degree} style={{ marginTop: i === 0 ? 0 : "5px", breakInside: "avoid" }}>
            <EntryHead left={e.degree} right={e.period} />
            <div style={{ ...ink, fontSize: "10pt" }}>
              {e.institution} ({e.note})
            </div>
          </div>
        ))}
      </Section>

      <Section title="Certifications">
        <ul style={{ margin: 0, paddingLeft: "17px" }}>
          {CERTS.map((c) => (
            <li key={c.name} style={{ ...ink, marginBottom: "2px" }}>
              {c.name} - {c.issuer} ({c.year})
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
