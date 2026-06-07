import type { TimelinePhase } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// The real arc - India → Ireland. No invented dates, no fabricated gap-fillers.
// The "gap" is the densest, most human part of the story.
// ─────────────────────────────────────────────────────────────────────────────

export const timeline: TimelinePhase[] = [
  {
    id: "phase-01",
    phase: "Phase 01",
    period: "2018 - 2022", // TODO: confirm exact B.E. years with Shrey
    title: "Foundations - B.E. Computer Science",
    description:
      "Computer Science at Chandigarh University, India. The fundamentals everything else runs on: data structures, algorithms, databases, how systems compose. The first real exposure to the idea that engineering is about managing complexity, not memorising syntax.",
    stack: ["Java", "Python", "SQL", "Data Structures", "Algorithms", "OOP"],
    metrics: [
      { label: "Qualification", value: "B.E. CS" },
      { label: "Place", value: "Chandigarh, India" },
    ],
    shift:
      "The habit that stuck: understand the failure modes before the happy path, and model the data before writing the queries.",
  },
  {
    id: "phase-02",
    phase: "Phase 02",
    period: "July 2022 - March 2023",
    title: "First Production Environment - OneDirect",
    description:
      "OneDirect (part of Gupshup Group), in Bengaluru. The first real production codebase with real consequences - Java Spring Boot microservices on a live CRM platform, Kafka and RabbitMQ for distributed events, Jaeger and Grafana for observability. Thrown in from day one; hard and monotonous. But that pressure is exactly what turned a backend hire into a full-stack engineer.",
    stack: ["Java", "Spring Boot", "Kafka", "RabbitMQ", "Jaeger", "Grafana", "Jenkins", "SQL"],
    metrics: [
      { label: "Environment", value: "Production" },
      { label: "Location", value: "Bengaluru, India" },
    ],
    shift:
      "Production systems are maintained, not just built. Instrumentation isn't optional - it's part of the design. This is where full-stack stopped being a label and became real.",
  },
  {
    id: "phase-03",
    phase: "Phase 03",
    period: "2023",
    title: "Stepping Back, Testing Myself",
    description:
      "After OneDirect, a deliberate step away from engineering to figure out direction - and to test myself against some of the hardest exams there are, including the CAT, one of the most competitive graduate entrance exams in the world. The exam route didn't become the path, but the discipline of that kind of preparation did.",
    stack: [],
    metrics: [
      { label: "Year", value: "2023" },
      { label: "Focus", value: "CAT · direction" },
    ],
    shift:
      "Stepping away made the eventual return to building a choice rather than a default. Engineers who know why they build tend to build better.",
  },
  {
    id: "phase-04",
    phase: "Phase 04",
    period: "2023 - 2024",
    title: "Showing Up for People - NGO Work",
    description:
      "Time with an NGO supporting people in recovery from illness and addiction - multiple flexible roles, from direct support to coordination to accounting and paperwork. The work had nothing to do with code, and everything to do with the skill that matters most in product: understanding what someone actually needs versus what they're asking for. A government exam (UKPCS) ran alongside in 2024.",
    stack: [],
    metrics: [
      { label: "Domain", value: "Service" },
      { label: "Skill", value: "People · coordination" },
    ],
    shift:
      "Trust is earned slowly and lost fast. That's true of people in recovery, and it's true of every interface a user has to believe in.",
  },
  {
    id: "phase-05",
    phase: "Phase 05",
    period: "2025",
    title: "New Country, New Lens",
    description:
      "Relocated from India to Galway, Ireland, and started the M.Sc in Economics & Financial Technology at the University of Galway. A second vocabulary for systems - markets, risk, financial models - that turns out to share a discipline with software: know where the model breaks before you trust it.",
    stack: ["Economics", "Financial Technology", "Python", "Quantitative Analysis"],
    metrics: [
      { label: "Move", value: "India → Ireland" },
      { label: "Study", value: "MSc Econ & FinTech" },
    ],
    shift:
      "A financial model is an engineered artifact with assumptions and failure modes, exactly like a software system. The critical lens transfers directly.",
  },
  {
    id: "phase-06",
    phase: "Phase 06",
    period: "2026 - Present",
    title: "Building Ventures - In Active Development",
    description:
      "Since March 2026, building founder-stage products across domains - Leaba Slán (hospital dispatch), FixFlow and SiteScribe (turning messy real-world inputs into clean paperwork for Irish SMEs), CypherLink, and more - several now in an incubation pitch pipeline. Alongside: a live client site, a production-grade full-stack build, and quantitative finance work. Currently going deeper on Go and LangChain.",
    stack: ["Next.js", "Spring Boot", "NestJS", "PostgreSQL", "Redis", "Claude API", "Groq", "Socket.IO", "Go"],
    metrics: [
      { label: "Status", value: "In active development" },
      { label: "Building", value: "Ventures · AI · product" },
    ],
    isCurrent: true,
    shift:
      "The throughline across every chapter: never stopped moving. Build, learn, show up - and let the range be the point.",
  },
];
