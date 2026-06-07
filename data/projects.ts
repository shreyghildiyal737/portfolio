import type { Project } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// THE REAL VAULT - rewritten from the actual repositories, June 2026.
// Honest status, honest stacks, no invented metrics or architecture.
// Tier order: Shipped → Ventures (pitching) → Experiments.
// The on-hold client project (Bricks & Mortar) is intentionally omitted.
// ─────────────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  // ─── SHIPPED ───────────────────────────────────────────────────────────────
  {
    id: "pc-trade-frames",
    slug: "pc-trade-frames",
    title: "PC Trade Frames",
    systemId: "VAULT.01",
    tagline: "Live business site for an Irish uPVC windows & doors company - real client, in production.",
    description:
      "A product-catalogue and quote-request site built for PC Trade Frames, a uPVC windows and doors business in Ireland. Built to the client's exact requirements and shipped to production - customers browse the range and request quotes; the business stops losing enquiries to scattered phone calls.",
    status: "shipped",
    year: "2026",
    stack: ["Full-stack web", "Quote workflow", "Email automation"], // TODO: confirm exact framework/db with Shrey
    metrics: [
      { label: "Stage", value: "Live · in production" },
      { label: "Type", value: "Paying client" },
    ],
    philosophy:
      "Client work has one success metric: the business can rely on it. Not the prettiest build - the right one for what they needed.",
    links: [{ label: "View live site", href: "https://www.pctradeframes.ie/" }],
    tags: ["Client work", "Web", "Shipped"],
    problem:
      "The business was handling product enquiries ad hoc, with no single place for customers to see the range or request a quote. Enquiries fell through the cracks.",
    productExperience:
      "Customers browse the windows and doors range and submit a quote request online; the business receives it as a structured enquiry rather than a missed call.",
    architectureLayers: [
      {
        name: "Product catalogue",
        detail: "A structured catalogue of the windows and doors range, organised so customers can browse by type and find what fits without a phone call.",
      },
      {
        name: "Quote-request workflow",
        detail: "An online quote form captures each enquiry as structured data - product, customer, and requirements - so the business receives a complete brief instead of a vague voicemail.",
      },
      {
        name: "Email automation",
        detail: "Submitted enquiries are routed to the business automatically by email, turning a website visit into an actionable lead in the inbox.",
      },
    ],
    capabilityProof:
      "Took a real client from brief to a live production website - the genuine, un-glamorous proof that I can ship for someone who is paying and depending on it.",
  },
  {
    id: "coastline-gaming",
    slug: "coastline-gaming",
    title: "Coastline Gaming",
    systemId: "VAULT.02",
    tagline: "A production-grade build of a gaming-venue + online-casino platform - deployed, the most complete system in the vault.",
    description:
      "A full Next.js 16 build of a gaming-venue network and online-casino platform: geospatial venue search, security hardening, a live admin layer, and a real test suite. It is a build/showcase - not a live operator - and full public auth is intentionally left unwired (I won't stand up real accounts for a business without permission). The point is the engineering surface area: this is the most complete production-grade system I've built.",
    status: "shipped",
    year: "2026",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Supabase", "Upstash Redis", "Cloudflare Turnstile", "Vercel"],
    metrics: [
      { label: "Stage", value: "Deployed build" },
      { label: "Tested", value: "Jest + Playwright" },
    ],
    philosophy:
      "A casino site is a useful forcing function: geospatial search, bot defence, rate limiting, feature flags, async jobs, and a real test suite - all the things a serious production app actually needs.",
    links: [{ label: "View deployment", href: "https://coastline-gaming.vercel.app/" }],
    tags: ["Production-grade", "Full-stack", "Security"],
    problem:
      "I wanted one project that exercised the full production surface - not a toy demo, but the security, geospatial, async-work, and testing concerns a real consumer app carries.",
    productExperience:
      "A polished marketing + venues experience with a geospatial 'nearest venue' search, an auth-gated admin dashboard, and forms protected by bot and rate-limit defences.",
    architectureLayers: [
      {
        name: "Geospatial search",
        detail: "A Postgres function (nearest_venues) on Supabase returns venues by proximity, granted to anon/authenticated roles - real spatial querying, not a hardcoded list.",
      },
      {
        name: "Security & abuse defence",
        detail: "Cloudflare Turnstile on public forms, a heuristic spam scorer, and Upstash Redis rate limiting enforced in edge middleware. The admin surface sits behind a secret path plus a Supabase session + role check.",
      },
      {
        name: "Async work",
        detail: "A job_queue table drained by a Vercel cron every few minutes handles email notifications and GDPR acknowledgements - keeping request paths fast.",
      },
      {
        name: "Feature flags",
        detail: "A feature_flags table with a short Redis cache toggles heavy features (3D, casino module) without a redeploy.",
      },
      {
        name: "Quality gate",
        detail: "Unit + integration tests in Jest and end-to-end flows in Playwright, runnable against local or production.",
      },
    ],
    capabilityProof:
      "A deployed Next.js 16 application carrying real production concerns - geospatial search, layered security, async job processing, feature flags, and a full test suite.",
  },

  // ─── VENTURES - pitching to incubation ──────────────────────────────────────
  {
    id: "leaba-shlan",
    slug: "leaba-shlan",
    title: "Leaba Slán",
    systemId: "VAULT.03",
    tagline: "Irish for 'Safe Bed' - real-time hospital-bed tracking and ambulance dispatch for Ireland's trolley crisis.",
    description:
      "A system that closes the loop on Ireland's trolley crisis: ambulances routinely arrive at saturated hospitals while a bed sits free eight kilometres away. Leaba Slán gives dispatchers live ward-level bed inventory, acuity-aware reservation tied to inbound ambulance ETAs, and HSE-region diversion controls when a site goes on bypass.",
    status: "in-progress",
    year: "2026",
    stack: ["Node.js", "TypeScript", "WebSocket", "BullMQ", "PostgreSQL", "Redis", "Twilio", "Mapbox"],
    metrics: [
      { label: "Stage", value: "Pitching · incubation" },
      { label: "Built", value: "Phase 1 - backend core" },
    ],
    philosophy:
      "The trolley crisis is a system-visibility failure, not a bed-count failure. The hard part is keeping a real-time, multi-site view that dispatchers can trust under pressure.",
    links: [],
    tags: ["Health-tech", "Real-time", "Venture"],
    problem:
      "Bed availability is invisible across sites in real time, so ambulances are routed to hospitals already at capacity while beds sit free nearby.",
    productExperience:
      "Hospital staff update ward-level bed state (web + QR); a dispatcher console reserves an acuity-appropriate bed against an ambulance's live ETA and routes to the nearest site that is actually open and equipped.",
    architectureLayers: [
      {
        name: "Real-time API",
        detail: "A REST + WebSocket gateway pushes live bed and routing events to hospital, dispatcher, and crew clients - the system is event-driven, not poll-driven.",
      },
      {
        name: "Work queue",
        detail: "BullMQ workers handle outbound HSE sync and alerting off the request path; PostgreSQL is the source of truth, Redis provides cache + pub/sub for live fan-out.",
      },
      {
        name: "External integrations",
        detail: "Twilio for SMS alerts, Mapbox for ETA/routing, and an HSE national-sync endpoint for bed-state reconciliation.",
      },
    ],
    capabilityProof:
      "Designed and built the Phase-1 real-time backend (API, WebSocket gateway, BullMQ workers, Postgres + Redis) for a multi-stakeholder dispatch system - with the web and mobile clients scoped for later phases.",
  },
  {
    id: "fixflow",
    slug: "fixflow",
    title: "FixFlow Ireland",
    systemId: "VAULT.04",
    tagline: "Forward a tenant's WhatsApp → a tracked, evidenced repair job. The ops layer for Irish rental maintenance.",
    description:
      "Repairs in Irish lettings run on chaos - a tenant WhatsApps photos, the agent calls a contractor, approvals lag, and when a deposit or RTB dispute lands the evidence is scattered across chats. FixFlow turns a forwarded WhatsApp message into a tracked job: triaged, assigned, quoted, completed, with a full photo + audit trail. Messy message in → trackable job + evidence out.",
    status: "in-progress",
    year: "2026",
    stack: ["Spring Boot", "Java", "Next.js", "TypeScript", "PostgreSQL"],
    metrics: [
      { label: "Stage", value: "Pitching · incubation" },
      { label: "Model", value: "Tiered SaaS subscription" },
    ],
    philosophy:
      "The moat isn't the form - it's zero intake friction (no new app for tenants) plus an Ireland-specific, dispute-ready evidence trail keyed on Eircode.",
    links: [],
    tags: ["Property-tech", "SaaS", "Venture"],
    problem:
      "Letting agents spend their day chasing repairs across WhatsApp, calls, and email; when an RTB or deposit dispute lands, the proof of work simply isn't there.",
    productExperience:
      "The agent forwards the tenant's WhatsApp (tagged to the property's Eircode). FixFlow auto-triages priority and trade, offers the job to a vetted contractor, and logs quote → approval → before/after photos → completion in a per-property evidence vault.",
    architectureLayers: [
      {
        name: "Intake & triage",
        detail: "A forwarded message becomes a structured job; priority (emergency→low) and trade category are set, then the job is routed to the next available vetted contractor.",
      },
      {
        name: "Evidence trail",
        detail: "Quote, approval, photos, and completion are logged per-property and keyed on Eircode - a clean per-property history that is dispute-ready under RTB.",
      },
      {
        name: "Stack",
        detail: "Spring Boot backend + Next.js frontend with role dashboards (agent, contractor, landlord) over an audit log - a working starter codebase.",
      },
    ],
    capabilityProof:
      "Built a working Spring Boot + Next.js starter covering intake, triage, assignment, quotes, an evidence vault, and role dashboards - paired with a real business model and go-to-market for Galway letting agents.",
  },
  {
    id: "sitescribe",
    slug: "sitescribe",
    title: "SiteScribe AI",
    systemId: "VAULT.05",
    tagline: "Voice note on site → clean construction report. AI paperwork for Irish site teams.",
    description:
      "A lean workflow wrapper for Irish construction teams: a worker records a voice note plus location, AI drafts a clean site report, a manager reviews and approves, and it exports. Not a full construction-management suite - a focused layer that turns messy site inputs into tidy, approvable paperwork.",
    status: "in-progress",
    year: "2026",
    stack: ["Java 21", "Spring Boot 3", "Next.js", "TypeScript", "Groq Whisper", "Gemini", "PostgreSQL"],
    metrics: [
      { label: "Stage", value: "Pitching · incubation" },
      { label: "AI", value: "Whisper + Gemini (mock/live)" },
    ],
    philosophy:
      "AI drafts, humans approve. Capture location only at submission, store raw transcript + structured JSON + final text, and support Gaeilge/mixed-language from the data model up.",
    links: [],
    tags: ["Construction-tech", "AI", "Venture"],
    problem:
      "Site reporting is slow and messy - paperwork gets done badly or late from notes and memory, long after the work happened.",
    productExperience:
      "A worker uploads a voice note (with location) against a job; the backend transcribes and extracts a structured draft report; the manager edits, approves, and exports clean text.",
    architectureLayers: [
      {
        name: "Pluggable AI",
        detail: "Two interchangeable AI paths behind one interface: a mock path that runs the whole workflow with no paid APIs, and a live path using Groq Whisper (transcription) + Gemini 2.0 Flash (report extraction), selected by env var.",
      },
      {
        name: "Spring backend",
        detail: "Java 21 / Spring Boot 3 with JPA, Flyway migrations, OpenAPI docs, real BCrypt + JWT auth, and per-company data isolation.",
      },
      {
        name: "Beyond MVP",
        detail: "Storage abstraction (local or Supabase), Resend email notifications, and Sentry monitoring already wired in.",
      },
    ],
    capabilityProof:
      "Built an end-to-end Spring Boot + Next.js product with a clean AI-adapter seam (mock vs live Whisper/Gemini), real auth, per-tenant isolation, and a full capture → draft → approve → export workflow.",
  },
  {
    id: "cypherlink",
    slug: "cypherlink",
    title: "CypherLink",
    systemId: "VAULT.06",
    tagline: "A collaborative operating system for independent music culture.",
    description:
      "CypherLink is a platform for independent music culture - a collaborative backend with real-time features, clean auth, and object storage. The backend is built; the product is in the pitch stage.",
    status: "in-progress",
    year: "2026",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.IO", "S3"],
    metrics: [
      { label: "Stage", value: "Backend built · pitching" },
      { label: "Real-time", value: "Socket.IO" },
    ],
    philosophy:
      "Get the boring foundations right - strict typing, refresh-token auth, queues, and storage - so the collaborative features have something solid to stand on.",
    links: [],
    tags: ["Music-tech", "Real-time", "Venture"],
    problem:
      "Independent music scenes coordinate across scattered tools; CypherLink is an attempt at a single collaborative home for them.",
    architectureLayers: [
      {
        name: "API & auth",
        detail: "A NestJS + TypeScript backend with JWT access tokens and HTTP-only refresh-cookie rotation, organised into cleanly separated modules.",
      },
      {
        name: "Data & queues",
        detail: "PostgreSQL via Prisma is the source of truth; Redis with BullMQ runs background jobs off the request path.",
      },
      {
        name: "Real-time & storage",
        detail: "Socket.IO drives the live collaborative features, S3-compatible object storage holds user media, and the surface is documented with OpenAPI.",
      },
    ],
    capabilityProof:
      "Architected a NestJS backend with PostgreSQL/Prisma, Redis + BullMQ queues, Socket.IO real-time, JWT + HTTP-only refresh-cookie auth, and S3-compatible storage - documented with OpenAPI.",
  },
  {
    id: "temple-yoga",
    slug: "temple-yoga",
    title: "Temple Yoga Platform",
    systemId: "VAULT.07",
    tagline: "An AI yoga platform built on a knowledge graph of asanas.",
    description:
      "An AI-driven yoga platform organised around a knowledge graph of poses and practice - deeply specified across product, architecture, AI/knowledge-graph, safety, and roadmap, with its own design system. Early build, in the pitch stage.",
    status: "in-progress",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Knowledge graph", "AI"],
    metrics: [
      { label: "Stage", value: "Specced + early build" },
      { label: "Core", value: "Asana knowledge graph" },
    ],
    philosophy:
      "Spec the hard parts first - safety, media rights, and how the knowledge graph encodes practice - before writing the easy screens.",
    links: [],
    tags: ["Wellness-tech", "AI", "Venture"],
    architectureLayers: [
      {
        name: "Asana knowledge graph",
        detail: "The core is a knowledge graph of poses, sequences, contraindications, and progressions, so the platform reasons about practice rather than just listing videos.",
      },
      {
        name: "AI layer",
        detail: "An AI layer over the graph generates and adapts practices, with safety and contraindication rules encoded as first-class data.",
      },
      {
        name: "App & design system",
        detail: "A Next.js + TypeScript front end with its own design system, built against a full product and engineering spec (architecture, safety, media-rights, roadmap).",
      },
    ],
    capabilityProof:
      "Produced a full product + engineering specification (vision, architecture, AI/knowledge-graph, safety/media-rights, testing, roadmap) and a design system for an AI wellness platform.",
  },

  // ─── EXPERIMENTS ────────────────────────────────────────────────────────────
  {
    id: "finance-analytics",
    slug: "finance-analytics",
    title: "Quant Finance Engine",
    systemId: "VAULT.08",
    tagline: "A finance engine and a backtested trading strategy - Sharpe ≈ 2.5-2.8 at ~5% max drawdown.",
    description:
      "Quantitative work from the MSc FinTech track: a finance/analytics engine plus a systematic trading strategy that backtested to a Sharpe ratio of roughly 2.5-2.8 with a maximum drawdown around 5%. The engineering interest is treating financial models the way I treat software - with explicit assumptions and failure modes.",
    status: "in-progress",
    year: "2026",
    stack: ["Python", "Quantitative analysis"], // TODO: confirm libraries (NumPy/Pandas/etc.) + link repo
    metrics: [
      { label: "Sharpe", value: "≈ 2.5-2.8" },
      { label: "Max drawdown", value: "~5%" },
    ],
    philosophy:
      "A high Sharpe means nothing without knowing where the model breaks. The discipline is the same as software: understand the failure modes before trusting the output.",
    links: [],
    tags: ["Finance", "Quant", "Experiment"],
    architectureLayers: [
      {
        name: "Data & signals",
        detail: "A Python pipeline ingests market data and computes the indicators and signals the strategy trades on.",
      },
      {
        name: "Strategy & backtest",
        detail: "The strategy is expressed as explicit rules and run through a backtester that reports risk-adjusted performance - roughly a 2.5 to 2.8 Sharpe at about 5% max drawdown.",
      },
      {
        name: "Risk discipline",
        detail: "Every model carries explicit assumptions and failure modes; the engine is built to surface where the strategy breaks, not just its headline return.",
      },
    ],
    capabilityProof:
      "Built a quantitative finance engine and a systematic strategy that backtested to a Sharpe of ~2.5-2.8 at ~5% max drawdown - bridging the MSc Economics & FinTech work with hands-on implementation.",
  },
  {
    id: "cf-satellite",
    slug: "cf-satellite",
    title: "CF Satellite Suite",
    systemId: "VAULT.09",
    tagline: "A toolkit for print-on-demand creators - mockups, collages, bulk exports.",
    description:
      "A suite of browser tools for print-on-demand / Etsy creators: a mockup visualiser with drag/resize/rotate (Fabric.js), a collage maker, a bulk-mockup generator with ZIP export, and prompt generators. Five tools are functional today; the rest are scaffolded.",
    status: "in-progress",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Fabric.js", "three.js", "JSZip"],
    metrics: [
      { label: "Stage", value: "Experiment" },
      { label: "Built", value: "5 of 16 tools live" },
    ],
    philosophy:
      "Small, sharp tools that do one canvas-or-export job well - and prove out a pattern before scaling the suite.",
    links: [],
    tags: ["Creator-tools", "Canvas", "Experiment"],
    architectureLayers: [
      {
        name: "Canvas engine",
        detail: "Client-side tooling built on Fabric.js - drag, resize, and rotate artwork onto product mockups entirely in the browser, with no server round-trip.",
      },
      {
        name: "Bulk export",
        detail: "A bulk-mockup generator composes many product images programmatically and packages them into a single ZIP download via JSZip.",
      },
      {
        name: "Modular tool shell",
        detail: "Sixteen small single-purpose tools share one Next.js + TypeScript shell; five are functional today and the rest are scaffolded behind the same pattern.",
      },
    ],
    capabilityProof:
      "Built client-side canvas tooling - Fabric.js mockup editing, programmatic product silhouettes, and JSZip bulk export - as a multi-tool Next.js suite.",
  },
  {
    id: "creatoros",
    slug: "creatoros",
    title: "CreatorOS",
    systemId: "VAULT.10",
    tagline: "A desktop command centre for live streamers - unified chat, AI clip detection, local-first.",
    description:
      "An Electron desktop app that pulls OBS, Twitch, YouTube, and Kick into one dashboard: mirrored multi-platform chat, chat-spike + keyword moment detection, FFmpeg clip generation, and local AI suggestions/summaries via Ollama. An MVP - Twitch and OBS are real integrations; YouTube and Kick are mocked.",
    status: "in-progress",
    year: "2026",
    stack: ["Electron", "Node.js", "OBS WebSocket", "FFmpeg", "Ollama", "SQLite"],
    metrics: [
      { label: "Stage", value: "MVP" },
      { label: "AI", value: "Local (Ollama)" },
    ],
    philosophy:
      "Local-first by default - no cloud dependency for the core loop. Real where it counts (Twitch/OBS), mocked where it doesn't yet (YouTube/Kick).",
    links: [],
    tags: ["Creator-tools", "AI", "Experiment"],
    architectureLayers: [
      {
        name: "Platform integrations",
        detail: "Electron bridges several live sources - OBS over its WebSocket API and Twitch chat are real integrations, while YouTube and Kick are mocked behind the same interface for now.",
      },
      {
        name: "Moment detection & clips",
        detail: "Chat-spike and keyword detection flag highlight moments, and FFmpeg cuts clips from the stream locally on the creator's machine.",
      },
      {
        name: "Local-first AI",
        detail: "Suggestions and summaries run through a local Ollama model with SQLite for state, so the core loop needs no cloud dependency.",
      },
    ],
    capabilityProof:
      "Built a cross-process Electron app integrating OBS WebSocket and Twitch chat with FFmpeg clip generation and local Ollama inference - a working MVP of a multi-platform streaming dashboard.",
  },
];
