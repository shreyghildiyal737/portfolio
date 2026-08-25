// ─────────────────────────────────────────────────────────────────────────────
// The assistant's brain - rewritten from the REAL projects and corrected facts,
// June 2026. Honest only: no invented metrics, no removed slugs, no "First Class"
// (it's B.E. CS, Chandigarh, CGPA 7.32), no public mention of the on-hold 2nd
// client, and no "2-day Strandline" speed claim. Every entry is grounded in
// data/projects.ts, data/cv.ts, and data/timeline.ts.
// ─────────────────────────────────────────────────────────────────────────────

export interface ContentView {
  lede: string;
  bullets: string[];
  deepDive?: string;
}

export interface KnowledgeEntry {
  id: string;
  triggers: string[];
  recruiter: ContentView;
  engineer: ContentView;
  relatedProjects: string[];
  context: {
    type: "projects" | "architecture" | "timeline" | "profile";
    projectSlugs?: string[];
    architectureSlug?: string;
  };
}

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "hire",
    triggers: ["hire", "different", "unique", "why shrey", "standout", "makes him", "what makes", "why should"],
    recruiter: {
      lede: "A founder-engineer with backend roots who ships real products across very different domains - and is honest about what's shipped versus what's still in build.",
      bullets: [
        "Full-stack with a Java/Spring backend foundation built under real production pressure at OneDirect (Gupshup Group)",
        "Range across health, property, construction, music, gaming, and creator tooling - each project paired with a business model, not just a demo",
        "A live client site in production (PC Trade Frames) and a deployed production-grade build (Strandline Gaming) with geospatial search, security hardening, and a real test suite",
        "Currently pitching multiple ventures to an incubation centre while finishing an M.Sc Economics & FinTech at the University of Galway",
        "Open to full-stack, AI-systems, and founding-engineer roles - based in Galway, Ireland, with roots in India",
      ],
    },
    engineer: {
      lede: "A systems thinker who treats software as infrastructure to be designed - and who states the real status of each build plainly rather than overclaiming.",
      bullets: [
        "Event-driven backends with queues and real-time fan-out (WebSocket/Socket.IO, BullMQ, Redis pub/sub) across several systems",
        "Pragmatic AI integration: a pluggable mock-vs-live adapter seam (SiteScribe) and local-first inference via Ollama (CreatorOS) - not buzzword AI",
        "Security and correctness as defaults: Turnstile + rate limiting + a secret-path admin in Strandline; BCrypt + JWT and per-company isolation in SiteScribe",
        "Quantitative discipline from the MSc: a systematic strategy backtested to Sharpe ≈ 2.5-2.8 at ~5% max drawdown",
        "Breadth with depth - Java/Spring, TypeScript/Node/NestJS, Python - from UI to backend to AI pipeline",
      ],
      deepDive:
        "The recurring pattern is choosing the option that keeps the operational model simple for a small team. PostgreSQL as the source of truth with Redis for cache and pub/sub; BullMQ workers to push slow work off the request path; an explicit AI-adapter interface so a product can run end-to-end with no paid APIs before going live. He's also deliberate about honesty in the work itself - Strandline's public auth is intentionally left unwired because he won't stand up real accounts for a business without permission, and that constraint is stated rather than hidden.",
    },
    relatedProjects: ["strandline-gaming", "leaba-shlan", "sitescribe"],
    context: { type: "profile" },
  },
  {
    id: "ventures",
    triggers: ["building now", "what are you building", "current", "ventures", "incubator", "incubation", "pitching", "founder", "startup idea", "current work"],
    recruiter: {
      lede: "Several founder-stage products in active development - three of them in an incubation pitch pipeline - each targeting a real, specific problem.",
      bullets: [
        "Leaba Slán - real-time hospital-bed tracking and ambulance dispatch for Ireland's trolley crisis (Phase-1 backend built)",
        "FixFlow Ireland - turns a forwarded tenant WhatsApp into a tracked, evidenced rental-repair job with an RTB-ready audit trail",
        "SiteScribe AI - a site worker's voice note becomes a clean, approvable construction report",
        "CypherLink (collaborative platform for independent music culture) and Temple Yoga (AI platform on an asana knowledge graph) round out the range",
        "Each comes with a business model and go-to-market thinking, not just code",
      ],
    },
    engineer: {
      lede: "A spread of founder-stage builds sharing a backbone: a typed backend, queues for slow work, real-time where it matters, and an honest 'what's built vs scoped' line.",
      bullets: [
        "Leaba Slán: Node + WebSocket gateway, BullMQ workers, PostgreSQL + Redis - Phase-1 backend core, web/mobile clients scoped later",
        "FixFlow: Spring Boot + Next.js starter, Eircode-keyed per-property evidence vault, role dashboards over an audit log",
        "SiteScribe: Java 21 / Spring Boot 3 with a pluggable AI seam (mock vs Groq Whisper + Gemini), BCrypt + JWT, per-company isolation",
        "CypherLink: NestJS + Prisma, Redis/BullMQ, Socket.IO, JWT with HTTP-only refresh cookies, S3-compatible storage",
        "Common thread: messy real-world input → clean, structured, auditable output",
      ],
      deepDive:
        "FixFlow and SiteScribe are sibling theses: both take an unstructured real-world input (a WhatsApp message, a spoken site note) and turn it into clean paperwork an Irish SME can rely on. The engineering bet in both is the same - own the boring middle (intake, triage, structured storage, approval, export, audit) rather than chasing a flashy feature. Leaba is the hardest systems problem of the set: a real-time, multi-site view that dispatchers have to trust under pressure, which is why Phase 1 is the backend and the live state model, not the UI.",
    },
    relatedProjects: ["leaba-shlan", "fixflow", "sitescribe"],
    context: { type: "projects", projectSlugs: ["leaba-shlan", "fixflow", "sitescribe"] },
  },
  {
    id: "backend",
    triggers: ["backend", "infrastructure", "event-driven", "queue", "bullmq", "redis", "websocket", "socket.io", "real-time", "realtime", "postgresql", "database", "distributed", "kafka"],
    recruiter: {
      lede: "Backend is the home turf - real-time gateways, work queues, and production-grade data layers across several systems.",
      bullets: [
        "Leaba Slán: a REST + WebSocket gateway pushing live bed and routing events to hospital, dispatcher, and crew clients",
        "CypherLink: a NestJS backend with Prisma, Redis/BullMQ queues, and Socket.IO real-time, documented with OpenAPI",
        "Strandline Gaming: a Postgres geospatial function, an async job queue drained by cron, and feature flags with a short Redis cache",
        "Java/Spring foundation from OneDirect: production microservices with Kafka and RabbitMQ event processing",
        "PostgreSQL as the backbone; Redis for cache and pub/sub fan-out - not as a primary store",
      ],
    },
    engineer: {
      lede: "Event-driven systems built for operational simplicity: Postgres as source of truth, Redis for hot paths, queues for anything slow.",
      bullets: [
        "WebSocket/Socket.IO gateways for live fan-out so clients are event-driven, not polling (Leaba, CypherLink)",
        "BullMQ workers handle outbound sync, alerting, and email off the request path - keeping request latency low",
        "Strandline: a job_queue table drained by a Vercel cron handles notifications and GDPR acknowledgements asynchronously",
        "Geospatial 'nearest venue' via a Postgres function granted to anon/authenticated roles - real spatial querying, not a hardcoded list",
        "OneDirect production exposure: Kafka/RabbitMQ events, plus Jaeger tracing and Grafana dashboards for observability",
      ],
      deepDive:
        "The architecture choice that repeats is keeping the data model boring and pushing complexity into queues rather than into the request path. Leaba's BullMQ workers own HSE sync and alerting so the live dispatcher view stays responsive; Strandline's cron-drained job_queue keeps form submissions fast while email and GDPR work happen behind it. PostgreSQL stays the single source of truth in every case, with Redis strictly as cache and pub/sub - one fewer system to reason about under failure.",
    },
    relatedProjects: ["leaba-shlan", "cypherlink", "strandline-gaming"],
    context: { type: "projects", projectSlugs: ["leaba-shlan", "cypherlink", "strandline-gaming"] },
  },
  {
    id: "ai-workflows",
    triggers: ["ai workflow", "llm", "langchain", "groq", "whisper", "gemini", "ollama", "machine learning", "gpt", "artificial intelligence", "claude", "language model", "ai pipeline", "transcription", "ai integration"],
    recruiter: {
      lede: "Practical AI integration that's honest about cost and reliability - built so a product can run end-to-end before any paid model is switched on.",
      bullets: [
        "SiteScribe AI: a worker's voice note becomes a structured, approvable site report via Groq Whisper + Gemini",
        "A mock AI path runs the whole SiteScribe workflow with no paid APIs; the live path is selected by an env var",
        "CreatorOS: local-first AI - chat-spike/keyword clip detection and Ollama summaries running on the user's machine, no cloud dependency for the core loop",
        "Human-in-the-loop by design: AI drafts, a manager reviews and approves before anything is exported",
        "Currently going deeper on Go and LangChain",
      ],
    },
    engineer: {
      lede: "AI behind a clean seam: an interface with interchangeable mock and live implementations, so the workflow is testable and the model is a swappable dependency.",
      bullets: [
        "SiteScribe: two AI paths behind one interface - a mock path (no paid APIs) and a live path (Groq Whisper transcription → Gemini 2.0 Flash report extraction), chosen by env var",
        "Stores the raw transcript, the structured JSON, and the final approved text - so the human edit is auditable against the model output",
        "Gaeilge / mixed-language support designed in from the data model up, not bolted on",
        "CreatorOS: keyword + chat-spike moment detection drives FFmpeg clip extraction; Ollama provides local inference for summaries",
        "The assistant you're using is itself a grounded local retriever over a curated record - it won't pretend to know more than it does",
      ],
      deepDive:
        "The AI-adapter seam in SiteScribe is the interesting part. Treating the model as a dependency behind an interface means the entire capture → draft → approve → export flow can be exercised in tests and demos with zero spend, and the live Whisper/Gemini path is a configuration switch rather than a rewrite. Persisting raw transcript, structured extraction, and final text separately keeps the pipeline legible: you can always see what the model produced versus what the human approved.",
    },
    relatedProjects: ["sitescribe", "creatoros"],
    context: { type: "projects", projectSlugs: ["sitescribe", "creatoros"] },
  },
  {
    id: "strandline",
    triggers: ["strandline", "gaming", "casino", "venue", "geospatial", "turnstile"],
    recruiter: {
      lede: "The most complete build in the vault: a deployed gaming-venue + online-casino platform exercising the full production surface - explicitly a build/showcase, not a live operator.",
      bullets: [
        "Geospatial 'nearest venue' search, a marketing + venues experience, and an auth-gated admin dashboard",
        "Security hardening: Cloudflare Turnstile on public forms, a heuristic spam scorer, and Upstash Redis rate limiting in edge middleware",
        "Async work via a job_queue table drained by a Vercel cron; feature flags toggle heavy modules without a redeploy",
        "A real test suite: unit + integration in Jest, end-to-end flows in Playwright",
        "Full public auth is intentionally left unwired - he won't stand up real accounts for a business without permission",
      ],
    },
    engineer: {
      lede: "A deployed Next.js 16 app carrying real production concerns: geospatial search, layered security, async jobs, feature flags, and a full test suite.",
      bullets: [
        "nearest_venues Postgres function on Supabase, granted to anon/authenticated roles - proximity search, not a hardcoded list",
        "Turnstile + spam scoring + Upstash Redis rate limiting enforced in edge middleware; admin behind a secret path plus a Supabase session + role check",
        "job_queue table drained by a Vercel cron every few minutes for email and GDPR acknowledgements - request paths stay fast",
        "feature_flags table with a short Redis cache toggles 3D and the casino module without a redeploy",
        "Jest + Playwright runnable against local or production",
      ],
      deepDive:
        "Strandline is best read as a forcing function: pick one project that exercises everything a serious consumer app needs - spatial queries, bot defence, rate limiting, async work, feature flagging, and a real test pyramid - and build it to production standard. The deliberate omission is public auth: it's left unwired on purpose because standing up real player accounts for a business isn't something to do without authorization. That restraint is the point, not a gap.",
    },
    relatedProjects: ["strandline-gaming"],
    context: { type: "architecture", architectureSlug: "strandline-gaming" },
  },
  {
    id: "leaba",
    triggers: ["leaba", "safe bed", "hospital", "bed", "ambulance", "dispatch", "trolley", "health", "hse", "healthcare"],
    recruiter: {
      lede: "Leaba Slán ('Safe Bed') tackles Ireland's trolley crisis: ambulances arrive at saturated hospitals while a bed sits free kilometres away. It gives dispatchers a live, trustworthy view.",
      bullets: [
        "Live ward-level bed inventory with acuity-aware reservation tied to an inbound ambulance's ETA",
        "HSE-region diversion controls when a site goes on bypass",
        "Hospital staff update bed state via web + QR; a dispatcher console routes to the nearest site that's actually open and equipped",
        "Phase-1 backend core is built; web and mobile clients are scoped for later phases",
        "The hardest systems problem in the set, with real civic weight",
      ],
    },
    engineer: {
      lede: "A real-time, multi-stakeholder dispatch backend: a WebSocket gateway over a Postgres source of truth, with BullMQ workers and Redis for live fan-out.",
      bullets: [
        "REST + WebSocket gateway pushes live bed and routing events to hospital, dispatcher, and crew clients - event-driven, not poll-driven",
        "BullMQ workers handle outbound HSE sync and alerting off the request path",
        "PostgreSQL is the source of truth; Redis provides cache + pub/sub for real-time fan-out",
        "Twilio for SMS alerts, Mapbox for ETA/routing, an HSE national-sync endpoint for bed-state reconciliation",
        "Acuity-aware reservation against live ETAs is the core domain logic",
      ],
      deepDive:
        "The framing is deliberate: the trolley crisis is treated as a system-visibility failure, not a bed-count failure. So Phase 1 is the part that's actually hard - a real-time, multi-site state model that dispatchers can trust under pressure - rather than the screens. Keeping Postgres authoritative and doing fan-out through Redis pub/sub plus a WebSocket gateway is what lets every connected client (ward, dispatcher, crew) see a coherent view as bed state and ambulance ETAs change.",
    },
    relatedProjects: ["leaba-shlan"],
    context: { type: "architecture", architectureSlug: "leaba-shlan" },
  },
  {
    id: "fixflow",
    triggers: ["fixflow", "rental", "repair", "maintenance", "tenant", "landlord", "letting", "rtb", "eircode", "whatsapp", "property"],
    recruiter: {
      lede: "FixFlow Ireland turns the chaos of rental repairs into a tracked job: forward a tenant's WhatsApp, get a triaged, contractor-routed, photo-evidenced repair with an RTB-ready audit trail.",
      bullets: [
        "Zero intake friction - no new app for tenants; the agent just forwards the existing WhatsApp message",
        "Auto-triage of priority and trade, then routing to a vetted contractor",
        "A per-property evidence vault keyed on Eircode: quote → approval → before/after photos → completion",
        "Built to be dispute-ready under RTB - the proof of work exists when a deposit or dispute lands",
        "A working starter with a real business model and Galway go-to-market",
      ],
    },
    engineer: {
      lede: "Spring Boot + Next.js ops layer: a forwarded message becomes a structured job, routed and logged into an Eircode-keyed, dispute-ready evidence trail.",
      bullets: [
        "Intake & triage: a forwarded WhatsApp becomes a structured job with priority (emergency→low) and trade category set",
        "Routing to the next available vetted contractor",
        "Evidence trail logged per-property and keyed on Eircode - a clean history that holds up under RTB",
        "Role dashboards for agent, contractor, and landlord over an audit log",
        "Spring Boot backend + Next.js frontend, a working starter codebase",
      ],
      deepDive:
        "The moat is explicitly not the form - it's the combination of zero tenant-side intake friction and an Ireland-specific, dispute-ready evidence trail. That shapes the data model: everything hangs off the property's Eircode so the per-property history is the product, and the audit log is first-class rather than an afterthought. It's the same thesis as SiteScribe - own the boring middle that turns mess into defensible paperwork.",
    },
    relatedProjects: ["fixflow"],
    context: { type: "architecture", architectureSlug: "fixflow" },
  },
  {
    id: "sitescribe",
    triggers: ["sitescribe", "construction", "site report", "voice note", "gaeilge", "site team", "paperwork"],
    recruiter: {
      lede: "SiteScribe AI turns a site worker's voice note into a clean, approvable construction report - a focused workflow layer, not a heavy construction-management suite.",
      bullets: [
        "Worker records a voice note plus location → AI drafts a site report → manager reviews and approves → export",
        "AI drafts, humans approve - the report isn't trusted until a manager signs off",
        "Groq Whisper for transcription and Gemini for report extraction, with a full mock path for zero-cost runs",
        "Built for Irish site teams, with Gaeilge / mixed-language support from the data model up",
        "Sibling thesis to FixFlow: messy input → clean paperwork for Irish SMEs",
      ],
    },
    engineer: {
      lede: "Java 21 / Spring Boot 3 backend with a pluggable AI seam, real auth, and per-company isolation behind a capture → draft → approve → export flow.",
      bullets: [
        "Two interchangeable AI paths behind one interface: a mock path (no paid APIs) and a live path (Groq Whisper + Gemini 2.0 Flash), selected by env var",
        "Spring Boot 3 with JPA, Flyway migrations, and OpenAPI docs",
        "Real BCrypt + JWT auth and per-company data isolation",
        "Storage abstraction (local or Supabase), Resend email, and Sentry monitoring already wired in",
        "Location captured only at submission; raw transcript + structured JSON + final text all persisted",
      ],
      deepDive:
        "The clean AI-adapter seam is what makes SiteScribe more than a wrapper: the model is a dependency behind an interface, so the entire workflow runs and is tested with no spend, and going live is a config switch. Persisting the raw transcript, the structured extraction, and the final approved text separately keeps the human-in-the-loop step auditable - you can always compare what Whisper/Gemini produced against what the manager approved and exported.",
    },
    relatedProjects: ["sitescribe"],
    context: { type: "architecture", architectureSlug: "sitescribe" },
  },
  {
    id: "cypherlink",
    triggers: ["cypherlink", "music", "nestjs", "independent music", "collaborative", "prisma"],
    recruiter: {
      lede: "CypherLink is a collaborative operating system for independent music culture - a real-time backend is built; the product is in the pitch stage.",
      bullets: [
        "A single collaborative home for independent music scenes that today coordinate across scattered tools",
        "Real-time collaboration features over a strongly-typed backend",
        "Clean auth and object storage foundations in place",
        "Backend built and documented; product positioning in progress",
        "Part of the range that spans health, property, construction, music, and wellness",
      ],
    },
    engineer: {
      lede: "A NestJS backend done properly first: strict typing, refresh-token auth, queues, real-time, and S3-compatible storage.",
      bullets: [
        "NestJS 10 + PostgreSQL via Prisma",
        "Redis + BullMQ for background work",
        "Socket.IO for real-time collaboration",
        "JWT with HTTP-only refresh-cookie auth",
        "S3/MinIO-compatible object storage, documented with OpenAPI",
      ],
      deepDive:
        "The deliberate choice was to get the unglamorous foundations right - strict types, refresh-token auth, queues, storage - before building collaborative features on top, so the interesting parts have something solid to stand on. It's the same instinct as the other backends: a boring, dependable core beats clever features with a shaky base.",
    },
    relatedProjects: ["cypherlink"],
    context: { type: "projects", projectSlugs: ["cypherlink"] },
  },
  {
    id: "creatoros",
    triggers: ["creatoros", "creator", "streaming", "streamer", "obs", "twitch", "ffmpeg", "clip", "electron", "kick"],
    recruiter: {
      lede: "CreatorOS is a desktop command centre for live streamers - unified multi-platform chat, AI clip-moment detection, and local-first AI. An MVP, honest about what's real.",
      bullets: [
        "Pulls OBS, Twitch, YouTube, and Kick into one dashboard with mirrored multi-platform chat",
        "Chat-spike and keyword moment detection flags clip-worthy moments",
        "FFmpeg generates the clips; Ollama provides local AI suggestions and summaries",
        "Local-first: no cloud dependency for the core loop",
        "MVP status stated plainly - Twitch and OBS are real integrations; YouTube and Kick are mocked",
      ],
    },
    engineer: {
      lede: "A cross-process Electron app integrating OBS WebSocket and Twitch chat with FFmpeg clip generation and local Ollama inference.",
      bullets: [
        "Electron + Node.js desktop architecture",
        "OBS WebSocket and Twitch chat as real integrations; YouTube and Kick mocked at the MVP stage",
        "Keyword + chat-spike detection drives FFmpeg clip extraction",
        "Ollama for local AI summaries - local-first by default",
        "SQLite for local persistence",
      ],
      deepDive:
        "CreatorOS is a working MVP, and the description says so - Twitch/OBS are wired for real, YouTube/Kick are mocked. The interesting constraint is local-first: the core capture-and-clip loop runs on the user's machine with no cloud dependency, and AI summaries come from a local Ollama model rather than a hosted API. That keeps the streamer's data on their machine and the tool usable offline.",
    },
    relatedProjects: ["creatoros"],
    context: { type: "projects", projectSlugs: ["creatoros"] },
  },
  {
    id: "pc-trade",
    triggers: ["pc trade", "frames", "windows", "doors", "upvc", "quote", "client", "business site", "client work", "live site"],
    recruiter: {
      lede: "PC Trade Frames is real client work in production: a product-catalogue and quote-request site for an Irish uPVC windows & doors business, built to the client's exact brief.",
      bullets: [
        "Live at pctradeframes.ie - a paying client depending on it",
        "Customers browse the windows and doors range and submit a structured quote request online",
        "The business stops losing enquiries to scattered phone calls",
        "Not the prettiest build - the right one for what the client actually needed",
        "The un-glamorous proof of shipping for someone who is paying and relying on it",
      ],
    },
    engineer: {
      lede: "A focused, in-production business site: catalogue browsing plus an online quote workflow that turns a missed call into a structured enquiry.",
      bullets: [
        "Product-catalogue and quote-request flow built to a real client brief",
        "Structured enquiries replace ad-hoc phone calls",
        "Shipped to production and maintained for a live business",
        "Success metric is reliability for the client, not visual flash",
        "(Exact framework/DB to be confirmed - represented honestly rather than guessed)",
      ],
    },
    relatedProjects: ["pc-trade-frames"],
    context: { type: "projects", projectSlugs: ["pc-trade-frames"] },
  },
  {
    id: "quant",
    triggers: ["quant", "finance engine", "sharpe", "trading", "strategy", "backtest", "drawdown", "systematic", "quantitative"],
    recruiter: {
      lede: "Quantitative work from the MSc FinTech track: a finance engine plus a systematic trading strategy backtested to Sharpe ≈ 2.5-2.8 at ~5% maximum drawdown.",
      bullets: [
        "Real, defensible numbers - Sharpe roughly 2.5-2.8 with a maximum drawdown around 5%",
        "A finance/analytics engine paired with a systematic strategy",
        "Bridges the M.Sc Economics & FinTech coursework with hands-on implementation in Python",
        "The interest is treating financial models like software - explicit assumptions and failure modes",
        "Part of the FinTech depth alongside the Wharton FinTech and data-analytics certifications",
      ],
    },
    engineer: {
      lede: "A Python finance engine and a backtested systematic strategy, approached with the same epistemic discipline as software.",
      bullets: [
        "Systematic strategy backtested to Sharpe ≈ 2.5-2.8, max drawdown ~5%",
        "A high Sharpe means little without knowing where the model breaks - failure modes first",
        "Python-based quantitative analysis (specific libraries to be confirmed rather than guessed)",
        "Grounded in MSc Economics & FinTech study at the University of Galway",
        "The same 'understand the assumptions before trusting the output' habit that runs through the engineering work",
      ],
      deepDive:
        "The throughline he draws explicitly: a financial model is an engineered artifact with assumptions and failure modes, exactly like a software system. So the strategy work isn't just chasing a Sharpe number - it's about knowing the conditions under which that number stops being meaningful. (Repo and exact library stack are still to be confirmed, and are represented that way rather than embellished.)",
    },
    relatedProjects: ["finance-analytics"],
    context: { type: "projects", projectSlugs: ["finance-analytics"] },
  },
  {
    id: "fintech",
    triggers: ["fintech", "finance", "financial", "economics", "msc", "masters", "galway", "markets", "risk"],
    recruiter: {
      lede: "FinTech is a second vocabulary, not a side interest: an M.Sc Economics & Financial Technology at the University of Galway, alongside hands-on quant work.",
      bullets: [
        "M.Sc Economics & Financial Technology, University of Galway - 2025 to present",
        "Quantitative strategy backtested to Sharpe ≈ 2.5-2.8 at ~5% max drawdown",
        "FinTech foundations certification from Wharton (Coursera), plus IBM and Google data-analytics certs",
        "Markets, risk, and financial models as a critical lens that transfers directly to software",
        "Relocated India → Ireland in 2025 to pursue it",
      ],
    },
    engineer: {
      lede: "Financial modelling treated as systems work: know where the model breaks before you trust it.",
      bullets: [
        "MSc Economics & FinTech coursework feeding directly into implementation",
        "A systematic strategy with real risk metrics (Sharpe ≈ 2.5-2.8, ~5% drawdown)",
        "The critical lens - assumptions, failure modes, edge cases - is shared between finance and software",
        "FinTech foundations (Wharton) and data analytics (IBM, Google) certifications underpin it",
        "Python for the quantitative side; full-stack everywhere else",
      ],
    },
    relatedProjects: ["finance-analytics"],
    context: { type: "projects", projectSlugs: ["finance-analytics"] },
  },
  {
    id: "startup-fit",
    triggers: ["startup", "execution", "ship", "early stage", "startup ready", "scrappy", "ownership", "move fast", "founding engineer"],
    recruiter: {
      lede: "Startup-ready in the literal sense: actively building and pitching multiple ventures to an incubation centre, with full ownership from idea to deployment.",
      bullets: [
        "Three ventures in an incubation pitch pipeline, each with a product thesis and business model",
        "Full-stack ownership - architecture to deployment - so there's no handoff latency",
        "Ships real things: a live client site and a deployed production-grade build, not just slideware",
        "Honest about status, which is what lets a small team trust the roadmap",
        "Comfortable across unfamiliar domains - health, property, construction, music - which is the founder-engineer reality",
      ],
    },
    engineer: {
      lede: "Execution discipline that doesn't build against itself: typed backends, queues, and audit trails from the start, with scope stated plainly.",
      bullets: [
        "Prefers platform primitives over bespoke infrastructure (Supabase, Upstash, Vercel cron) to keep a small team moving",
        "Pushes slow work to queues and keeps Postgres authoritative - a simple operational model",
        "Designs the AI integration so a product runs end-to-end before any paid API is enabled",
        "States what's built versus scoped (Leaba Phase 1; CreatorOS YouTube/Kick mocked) instead of overclaiming",
        "Won't cut a corner that creates risk - e.g. leaving Strandline's public auth unwired by choice",
      ],
    },
    relatedProjects: ["fixflow", "sitescribe", "strandline-gaming"],
    context: { type: "projects", projectSlugs: ["fixflow", "sitescribe", "strandline-gaming"] },
  },
  {
    id: "architecture",
    triggers: ["architecture", "tradeoff", "design decision", "system design", "how does he think", "technical decisions", "engineering judgment", "how do you architect"],
    recruiter: {
      lede: "An engineer who picks the option with the lowest long-term overhead for a small team - and documents why.",
      bullets: [
        "Postgres as the source of truth, Redis for cache/pub-sub, queues for slow work - one coherent model to reason about",
        "Platform primitives over custom infrastructure when they keep the team moving",
        "AI behind a swappable interface so the workflow is testable without spend",
        "Designs for the real scale and the real status, not a hypothetical one",
        "States constraints openly - the unwired Strandline auth is a documented decision, not an oversight",
      ],
    },
    engineer: {
      lede: "Tradeoff-first: every architectural decision is a bet, chosen to minimise operational complexity and keep options open.",
      bullets: [
        "Queues (BullMQ) over doing slow work inline - request paths stay fast, failures are retryable",
        "WebSocket/Socket.IO fan-out over polling for anything real-time (Leaba, CypherLink)",
        "A mock-vs-live AI seam so the model is a dependency, not a hard requirement, during development",
        "Feature flags (Strandline) to toggle heavy modules without a redeploy",
        "Edge middleware for rate limiting and bot defence close to the request",
      ],
      deepDive:
        "The common principle across the systems is preferring the choice with the lowest long-term cognitive overhead for a team of one to five. That looks like keeping PostgreSQL authoritative everywhere, using Redis only as cache and pub/sub, pushing anything slow into BullMQ, and putting AI behind an interface so it can be mocked. Each decision accepts a small, known cost now to avoid a larger operational cost later.",
    },
    relatedProjects: ["leaba-shlan", "strandline-gaming", "sitescribe"],
    context: { type: "architecture", architectureSlug: "leaba-shlan" },
  },
  {
    id: "product",
    triggers: ["product", "user experience", "ux", "design thinking", "product thinking", "user-first", "customer", "go to market", "business model"],
    recruiter: {
      lede: "Product instincts sharpened by service work and client delivery: every technical decision traces back to the real person who has to use it.",
      bullets: [
        "FixFlow removes the intake gate entirely - no new app for tenants, just forward the WhatsApp they already sent",
        "SiteScribe meets workers where they are - a spoken note on site instead of paperwork later from memory",
        "PC Trade Frames optimises for the client's actual need (reliable enquiries), not for visual flash",
        "Leaba designs for dispatchers under pressure - trust and clarity over feature count",
        "Each venture pairs the build with a business model and go-to-market, not just a feature list",
      ],
    },
    engineer: {
      lede: "Systems designed around how real users actually behave and fail, not idealised ones.",
      bullets: [
        "Zero-friction intake in FixFlow because any new-app requirement would kill adoption with tenants",
        "Capture location only at submission in SiteScribe - match the real moment of work, not an idealised flow",
        "Gaeilge / mixed-language support designed in from the data model because the users are Irish site teams",
        "Human-in-the-loop approval before export - trust the worker and the manager, not the model",
        "Audit trails as a first-class feature because disputes are a real user moment (RTB, deposits)",
      ],
    },
    relatedProjects: ["fixflow", "sitescribe", "pc-trade-frames"],
    context: { type: "projects", projectSlugs: ["fixflow", "sitescribe", "pc-trade-frames"] },
  },
  {
    id: "timeline",
    triggers: ["timeline", "career", "history", "background", "journey", "gap", "career gap", "phases", "story", "arc", "onedirect", "ngo", "india"],
    recruiter: {
      lede: "A deliberate arc, India → Ireland: CS foundations → first production environment → a human chapter of service and exams → an MSc and a wave of building.",
      bullets: [
        "2018-2022: B.E. Computer Science, Chandigarh University, India (CGPA 7.32)",
        "Jul 2022 - Mar 2023: Software Engineer at OneDirect (Gupshup Group), Bengaluru - Java/Spring, Kafka, RabbitMQ, in production",
        "2023-2024: stepped away deliberately - competitive exams (CAT 2023, UKPCS 2024) and NGO recovery-support work",
        "2025: relocated India → Ireland and began the M.Sc Economics & FinTech at the University of Galway",
        "2026-present: building and pitching founder-stage ventures, plus a live client site and quant work",
      ],
    },
    engineer: {
      lede: "Each phase produced the capabilities the next one needed - the breadth is structural, not accidental.",
      bullets: [
        "B.E.: data structures, algorithms, databases - the mental models everything else runs on",
        "OneDirect: a real production codebase under pressure - Spring Boot microservices, Kafka/RabbitMQ, Jaeger tracing, Grafana - where backend became full-stack",
        "2023-2024 isn't a hole: NGO support work plus CAT and UKPCS preparation sharpened reading real human need and sustained discipline",
        "MSc Economics & FinTech: a second vocabulary for systems - markets, risk, models",
        "2026-present: founder-stage products across domains, AI integration, and quant work",
      ],
      deepDive:
        "The so-called gap is the densest, most human part of the story, not a break in it. The NGO recovery work taught reading what someone actually needs versus what they ask for - the core skill in product - and the exam preparation (CAT, UKPCS) sustained discipline through a deliberate step away from engineering. He came back to building as a choice rather than a default, which is exactly why the current range across health, property, construction, and finance reads as intentional.",
    },
    relatedProjects: [],
    context: { type: "timeline" },
  },
];

const fallbackEntry: KnowledgeEntry = {
  id: "fallback",
  triggers: [],
  recruiter: {
    lede: "Ask about a specific project, a domain, or how Shrey approaches building - the answers come from a curated record of real work.",
    bullets: [
      "Try: 'Why should we hire Shrey?' for the founder-engineer overview",
      "Try: 'What are you building now?' for the active ventures",
      "Try: 'Tell me about Strandline Gaming.' for the most complete build",
      "Try: 'Explain Leaba Slán.' for the hardest systems problem",
      "Try: 'Why the career gap?' for the honest arc",
    ],
  },
  engineer: {
    lede: "This assistant retrieves from a curated record of real work - ask something more specific to surface the relevant depth.",
    bullets: [
      "Project deep-dives: Strandline Gaming, Leaba Slán, FixFlow, SiteScribe, CypherLink, CreatorOS, PC Trade Frames",
      "Domain deep-dives: backend & real-time systems, practical AI integration, FinTech & quant",
      "Process questions: architecture tradeoffs, product thinking, startup execution",
      "Background: the India → Ireland timeline and how the phases connect",
    ],
  },
  relatedProjects: [],
  context: { type: "profile" },
};

export function retrieveResponse(query: string): KnowledgeEntry {
  if (!query.trim()) return fallbackEntry;

  const normalized = query.toLowerCase();

  const scored = knowledgeBase.map((entry) => ({
    entry,
    score: entry.triggers.reduce(
      (acc, trigger) => (normalized.includes(trigger.toLowerCase()) ? acc + 1 : acc),
      0
    ),
  }));

  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best.score > 0 ? best.entry : fallbackEntry;
}
