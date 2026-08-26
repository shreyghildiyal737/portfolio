// ─────────────────────────────────────────────────────────────────────────────
// Honest CV data - rewritten from the real story, June 2026.
// Bachelor: B.E. CS, Chandigarh University (India). Master: M.Sc Economics &
// Financial Technology, University of Galway (2025-). Career roots in India,
// now building in Ireland.
// ─────────────────────────────────────────────────────────────────────────────

export const cv = {
  experience: [
    {
      id: "exp-01",
      role: "Independent Engineer & Founder",
      company: "Self-directed · Galway, Ireland",
      period: "March 2026 - Present",
      location: "Galway, Ireland",
      highlights: [
        "Building founder-stage products across property, health, construction, and music tech - several now in an incubation pitch pipeline - on Spring Boot, NestJS, and Next.js with real-time and AI integrations",
        "Shipped a live client site (PC Trade Frames) and a production-grade full-stack build (Strandline Gaming) with geospatial search, security hardening, async job processing, and a full Jest + Playwright test suite",
        "Modelled SettleTrust, a cross-border trade-settlement platform, as a twenty-state invoice lifecycle with a role-by-action permission matrix - domain and authorisation rules written before the interface",
      ],
    },
    {
      id: "exp-02",
      role: "Software Engineer",
      company: "OneDirect (Gupshup Group)",
      period: "July 2022 - March 2023",
      location: "Bengaluru, India",
      highlights: [
        "Built and maintained Java Spring Boot microservices for a production CRM platform; owned feature development and bug fixes across the customer-engagement service layer",
        "Worked with Kafka and RabbitMQ for distributed event processing; implemented observability with Jaeger distributed tracing and Grafana dashboards in a live production environment",
        "Thrown into the deep end from day one - the demanding, unglamorous grind that turned a backend hire into a full-stack engineer",
      ],
    },
    {
      id: "exp-03",
      role: "Support Worker (Internship)",
      company: "NGO - Rehabilitation & Recovery",
      period: "2023 - 2024",
      location: "India",
      highlights: [
        "Supported people in recovery from illness and addiction across multiple flexible roles - direct support, coordination, accounting, and administration",
        "Learned to read what someone actually needs versus what they ask for - the same instinct that matters in product engineering",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend & UI",
      items: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      category: "Backend & Data",
      items: ["Java", "Spring Boot", "Node.js", "NestJS", "Express", "PostgreSQL", "Redis", "Prisma"],
    },
    {
      category: "Messaging & Real-time",
      items: ["Kafka", "RabbitMQ", "BullMQ", "Socket.IO", "WebSocket"],
    },
    {
      category: "AI & ML",
      items: ["OpenAI", "Claude API", "Groq (Whisper)", "Gemini", "LangChain", "pgvector", "Ollama"],
    },
    {
      category: "Infrastructure & Ops",
      items: ["Python", "Docker", "Supabase", "Vercel", "AWS S3", "Cloudflare Turnstile", "Jaeger", "Grafana"],
    },
  ],
  // Single highest/current degree - used by the compact home preview card.
  education: {
    degree: "M.Sc Economics & Financial Technology",
    institution: "University of Galway",
    year: "2025 - Present",
    note: "In Progress",
  },
  // Real, verifiable certs (Coursera + Coding Ninjas). Curated to the strongest.
  certifications: [
    {
      name: "FinTech: Foundations, Payments, and Regulations",
      issuer: "Wharton, University of Pennsylvania (Coursera)",
      year: "2025",
    },
    {
      name: "Introduction to Data Analytics",
      issuer: "IBM (Coursera)",
      year: "2025",
    },
    {
      name: "Foundations: Data, Data, Everywhere",
      issuer: "Google (Coursera)",
      year: "2025",
    },
    {
      name: "Cybersecurity for Everyone",
      issuer: "University of Maryland (Coursera)",
      year: "2025",
    },
    {
      name: "Algorithms on Graphs",
      issuer: "UC San Diego (Coursera)",
      year: "2021",
    },
    {
      name: "R Programming",
      issuer: "Johns Hopkins University (Coursera)",
      year: "2021",
    },
    {
      name: "Data Structures in Java - Top Performer",
      issuer: "Coding Ninjas",
      year: "2020",
    },
  ],
};
