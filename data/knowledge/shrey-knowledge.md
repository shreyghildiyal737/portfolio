# Shrey Ghildiyal Knowledge Base

This is the grounded source of truth for the AI Resume Assistant. Every section is
real and verifiable. Edit the content under each "Content:" block to keep the
assistant accurate. Do not invent metrics, employers, dates, or achievements.

## Profile Summary

Type: Profile
Tags: recruiter-summary, full-stack, founder-engineer, backend, ai, fintech, ireland
Source: Resume

Content:
Shrey Ghildiyal is a full-stack engineer with a Java and Spring Boot backend foundation, now building founder-stage products across Ireland. He is based in Galway, Ireland, with engineering roots in India. He pairs hands-on building with an M.Sc in Economics and Financial Technology at the University of Galway. His range spans property, health, construction, music, gaming, and creator tooling, and most projects come with a business model rather than just a demo. He is open to full-stack, AI-systems, and founding-engineer roles. The honest headline: backend-strong, full-stack capable, founder-minded, and straight about what is shipped versus what is still in build.

## Recruiter 30-Second Summary

Type: Profile
Tags: recruiter-summary, elevator-pitch, hire, fit
Source: Resume

Content:
In 30 seconds: Shrey is a full-stack engineer who learned backend under real production pressure at OneDirect (Gupshup Group) in India, working on Java/Spring Boot microservices with Kafka and RabbitMQ. He now builds and ships products end to end. He has a live client site in production (PC Trade Frames) and a deployed production-grade build (Coastline Gaming) with geospatial search, security hardening, async job processing, and a full Jest plus Playwright test suite. Alongside an M.Sc in Economics and Financial Technology at the University of Galway, he is pitching several ventures to an incubation centre. He is reliable, honest about status, and comfortable owning a problem from architecture to deployment.

## Work Experience - OneDirect (Gupshup Group)

Type: Work Experience
Tags: backend, java, spring-boot, kafka, rabbitmq, microservices, observability, production
Source: Resume

Content:
Shrey worked as a Software Engineer at OneDirect, part of the Gupshup Group, in Bengaluru, India, from July 2022 to March 2023. He built and maintained Java Spring Boot microservices for a production CRM platform, owning feature development and bug fixes across the customer-engagement service layer. He worked with Kafka and RabbitMQ for distributed event processing, and implemented observability with Jaeger distributed tracing and Grafana dashboards in a live production environment. This was his first job: demanding and unglamorous, thrown into the deep end from day one. It is where a backend hire became a full-stack engineer under real pressure.

## Work Experience - Independent Engineer and Founder

Type: Work Experience
Tags: founder, full-stack, ventures, spring-boot, nestjs, nextjs, ai, real-time, current
Source: Resume

Content:
Since March 2026, Shrey has worked as an Independent Engineer and Founder, self-directed in Galway, Ireland. He is building founder-stage products across property, health, construction, and music tech, several now in an incubation pitch pipeline, on Spring Boot, NestJS, and Next.js with real-time and AI integrations. In this period he shipped a live client site (PC Trade Frames) and a production-grade full-stack build (Coastline Gaming) with geospatial search, security hardening, async job processing, and a full Jest plus Playwright test suite. He also did quantitative work alongside the MSc: a finance engine and a systematic strategy backtested to a Sharpe ratio of about 2.5 to 2.8 at roughly 5 percent maximum drawdown.

## Experience - NGO Recovery and Support Work

Type: Work Experience
Tags: service, recovery, character, product-instinct, gap, india
Source: Resume

Content:
Between roughly 2023 and 2024, Shrey did support work with an NGO in India focused on rehabilitation and recovery from illness and addiction. He worked across multiple flexible roles: direct support, coordination, accounting, and administration. This was a deliberate human chapter, not a career gap. It taught him to read what someone actually needs versus what they ask for, which is the same instinct that matters in product engineering. During this period he also sat competitive exams (CAT in 2023 and the UKPCS government exam in 2024).

## Education - M.Sc Economics and Financial Technology

Type: Education
Tags: fintech, economics, university-of-galway, masters, ireland, current
Source: Resume

Content:
Shrey is studying for an M.Sc in Economics and Financial Technology at the University of Galway (NUI Galway), Ireland, from 2025 to present. He relocated from India to Ireland in 2025 to pursue it. The programme gives him a second vocabulary for systems: markets, risk, and financial models. It feeds directly into his quantitative work, including a systematic trading strategy backtested to a Sharpe ratio of about 2.5 to 2.8 at roughly 5 percent maximum drawdown.

## Education - B.E. Computer Science

Type: Education
Tags: computer-science, chandigarh-university, bachelors, india, fundamentals
Source: Resume

Content:
Shrey holds a Bachelor of Engineering in Computer Science from Chandigarh University, India, completed from 2018 to 2022 with a CGPA of 7.32. This is the foundation the rest of his work runs on: data structures, algorithms, and databases. His roots are in India; he now builds in Ireland.

## Skills - Backend and Data

Type: Skills
Tags: java, spring-boot, nodejs, nestjs, express, postgresql, redis, prisma, backend
Source: Resume

Content:
Backend is Shrey's home turf. Languages and frameworks: Java, Spring Boot, Node.js, NestJS, Express. Data layers: PostgreSQL, Redis, Prisma. His pattern is to keep PostgreSQL as the source of truth and use Redis for cache and pub/sub fan-out rather than as a primary store. He has production backend exposure from OneDirect (Spring Boot microservices) and multiple self-built backends (Leaba Slan in Node, CypherLink in NestJS, FixFlow and SiteScribe in Spring Boot).

## Skills - Frontend and UI

Type: Skills
Tags: typescript, javascript, react, nextjs, tailwind, framer-motion, frontend
Source: Resume

Content:
On the frontend, Shrey works in TypeScript and JavaScript with React and Next.js, styled with Tailwind CSS and animated with Framer Motion. He builds the full surface of his products, from UI through API to backend, so there is no handoff latency between layers.

## Skills - Messaging and Real-time

Type: Skills
Tags: kafka, rabbitmq, bullmq, socketio, websocket, real-time, queues, events
Source: Resume

Content:
Shrey works with event-driven and real-time systems: Kafka and RabbitMQ (production experience from OneDirect), plus BullMQ, Socket.IO, and raw WebSocket in his own builds. The recurring design is WebSocket or Socket.IO gateways for live fan-out and BullMQ workers to push slow work off the request path, keeping request latency low.

## Skills - AI and ML

Type: Skills
Tags: openai, claude, groq, whisper, gemini, langchain, pgvector, ollama, rag, ai
Source: Resume

Content:
Shrey integrates AI pragmatically and honestly about cost and reliability. He has worked with the OpenAI and Claude APIs, Groq (Whisper transcription), Gemini, LangChain, pgvector for embeddings, and local inference via Ollama. His hallmark is a pluggable mock-versus-live AI seam (SiteScribe) so a product can run end to end with no paid APIs before going live, and local-first inference (CreatorOS) that keeps the core loop off the cloud. This very assistant is a retrieval-augmented (RAG) build over a curated record. He is currently going deeper on Go and LangChain.

## Skills - Infrastructure and Ops

Type: Skills
Tags: python, docker, supabase, vercel, aws-s3, turnstile, jaeger, grafana, infra
Source: Resume

Content:
On infrastructure, Shrey uses Python, Docker, Supabase, Vercel, AWS S3, and Cloudflare Turnstile, with observability via Jaeger and Grafana from his production work. He prefers platform primitives (Supabase, Upstash, Vercel cron) over bespoke infrastructure to keep a small team moving fast.

## Project - PC Trade Frames

Type: Project
Tags: client-work, production, shipped, react, fastapi, mongodb, full-stack, ireland
Source: Portfolio

Content:
PC Trade Frames is real client work in production: a product-catalogue and quote-request site for an Irish uPVC windows and doors business, built to the client's exact brief and live at pctradeframes.ie. Customers browse the windows and doors range and submit a structured quote request online, so the business stops losing enquiries to scattered phone calls. The stack is React, TypeScript, and Tailwind on the frontend, with a FastAPI (Python) backend, MongoDB, Resend for email automation, and Vercel hosting. It is not the prettiest build; it is the right one for what a paying client actually needed. This is the un-glamorous proof that Shrey can ship for someone who is paying and relying on it.

## Project - Coastline Gaming

Type: Project
Tags: production-grade, nextjs, supabase, redis, turnstile, geospatial, security, testing, deployed
Source: Portfolio

Content:
Coastline Gaming is the most complete build in Shrey's vault: a deployed Next.js 16 build of a gaming-venue network and online-casino platform. It exercises the full production surface: a geospatial nearest-venue search via a Postgres function on Supabase, security hardening (Cloudflare Turnstile, a heuristic spam scorer, Upstash Redis rate limiting in edge middleware, an admin behind a secret path plus Supabase session and role check), async work through a job_queue table drained by a Vercel cron, feature flags with a short Redis cache, and a real test suite in Jest and Playwright. It is explicitly a build and showcase, not a live operator: full public auth is intentionally left unwired because Shrey will not stand up real accounts for a business without permission. That restraint is the point, not a gap.

## Project - Leaba Slan

Type: Project
Tags: health-tech, real-time, websocket, bullmq, postgres, redis, twilio, mapbox, venture
Source: Portfolio

Content:
Leaba Slan (Irish for "Safe Bed") tackles Ireland's trolley crisis: ambulances routinely arrive at saturated hospitals while a bed sits free kilometres away. It gives dispatchers live ward-level bed inventory, acuity-aware reservation tied to an inbound ambulance's ETA, and HSE-region diversion controls when a site goes on bypass. The architecture is a REST plus WebSocket gateway pushing live bed and routing events to hospital, dispatcher, and crew clients (event-driven, not poll-driven), BullMQ workers for outbound HSE sync and alerting, PostgreSQL as the source of truth, Redis for cache and pub/sub, with Twilio for SMS and Mapbox for routing. The Phase 1 backend core is built; web and mobile clients are scoped for later phases. It is the hardest systems problem in the set, with real civic weight, and is being pitched to an incubation centre.

## Project - FixFlow Ireland

Type: Project
Tags: property-tech, saas, spring-boot, nextjs, postgres, eircode, rtb, venture
Source: Portfolio

Content:
FixFlow Ireland is an operations layer for Irish rental maintenance. An agent forwards a tenant's WhatsApp message and FixFlow turns it into a tracked job: auto-triaged by priority and trade, routed to a vetted contractor, and logged through quote, approval, before and after photos, and completion in a per-property evidence vault keyed on Eircode. The moat is zero intake friction (no new app for tenants) plus an Ireland-specific, dispute-ready audit trail that holds up under RTB. It is built on Spring Boot and Next.js with PostgreSQL, with role dashboards for agent, contractor, and landlord over an audit log. It is a working starter with a real business model and a Galway go-to-market, in the incubation pitch pipeline.

## Project - SiteScribe AI

Type: Project
Tags: construction-tech, ai, spring-boot, nextjs, groq-whisper, gemini, jwt, venture
Source: Portfolio

Content:
SiteScribe AI turns a construction site worker's voice note into a clean, approvable site report: record a voice note plus location, AI drafts a report, a manager reviews and approves, then it exports. The standout engineering is a pluggable AI seam: two interchangeable paths behind one interface, a mock path that runs the whole workflow with no paid APIs and a live path using Groq Whisper for transcription and Gemini 2.0 Flash for report extraction, selected by an env var. It is built on Java 21 and Spring Boot 3 with JPA, Flyway migrations, OpenAPI docs, real BCrypt plus JWT auth, and per-company data isolation, plus a storage abstraction, Resend email, and Sentry monitoring. It supports Gaeilge and mixed-language input from the data model up. It is a sibling thesis to FixFlow: messy input, clean paperwork for Irish SMEs.

## Project - CypherLink

Type: Project
Tags: music-tech, nestjs, prisma, postgres, redis, bullmq, socketio, jwt, s3, venture
Source: Portfolio

Content:
CypherLink is a collaborative operating system for independent music culture: a single home for scenes that today coordinate across scattered tools. The backend is built and documented; the product is in the pitch stage. It is a NestJS and TypeScript backend with PostgreSQL via Prisma, Redis with BullMQ for background jobs, Socket.IO for real-time collaboration, JWT access tokens with HTTP-only refresh-cookie rotation, and S3-compatible object storage, documented with OpenAPI. The deliberate choice was to get the unglamorous foundations right first so collaborative features have something solid to stand on.

## Project - Temple Yoga Platform

Type: Project
Tags: wellness-tech, ai, knowledge-graph, nextjs, spec, early-build, venture
Source: Portfolio

Content:
Temple Yoga is an AI-driven yoga platform organised around a knowledge graph of poses, sequences, contraindications, and progressions, so the platform reasons about practice rather than just listing videos. An AI layer over the graph generates and adapts practices, with safety and contraindication rules encoded as first-class data. It is deeply specified across product, architecture, AI and knowledge graph, safety and media rights, testing, and roadmap, with its own design system. It is an early build in the pitch stage, and is the clearest example of Shrey speccing the hard parts (safety, media rights, knowledge representation) before writing the easy screens.

## Project - Quant Finance Engine

Type: Project
Tags: finance, quant, python, backtesting, sharpe, risk, msc-fintech, experiment
Source: Portfolio

Content:
The Quant Finance Engine is quantitative work from Shrey's M.Sc FinTech track: a finance and analytics engine plus a systematic trading strategy that backtested to a Sharpe ratio of roughly 2.5 to 2.8 with a maximum drawdown around 5 percent (real, user-supplied metrics). It is built in Python. The engineering interest is treating financial models the way he treats software, with explicit assumptions and failure modes: a high Sharpe means little without knowing where the model breaks. It bridges the MSc Economics and FinTech coursework with hands-on implementation. (The exact libraries and repository are still being confirmed and are represented that way rather than embellished.)

## Project - CF Satellite Suite

Type: Project
Tags: creator-tools, canvas, fabricjs, threejs, jszip, nextjs, experiment
Source: Portfolio

Content:
CF Satellite is a suite of browser tools for print-on-demand and Etsy creators: a mockup visualiser with drag, resize, and rotate built on Fabric.js, a collage maker, a bulk-mockup generator with ZIP export via JSZip, and prompt generators. It is built on Next.js and TypeScript with three.js and Fabric.js. Five of sixteen tools are functional today and the rest are scaffolded behind the same shell. It is an experiment in small, sharp, single-purpose tools that prove a pattern before scaling.

## Project - CreatorOS

Type: Project
Tags: creator-tools, electron, obs, twitch, ffmpeg, ollama, sqlite, local-first, experiment
Source: Portfolio

Content:
CreatorOS is an Electron desktop command centre for live streamers that pulls OBS, Twitch, YouTube, and Kick into one dashboard with mirrored multi-platform chat, chat-spike and keyword moment detection, FFmpeg clip generation, and local AI suggestions and summaries via Ollama with SQLite for state. It is local-first by design: no cloud dependency for the core loop. It is an MVP, and honest about it: OBS and Twitch are real integrations while YouTube and Kick are mocked behind the same interface for now.

## Certifications

Type: Certifications
Tags: coursera, wharton, ibm, google, fintech, data-analytics, cybersecurity, algorithms
Source: Resume

Content:
Shrey holds seven verifiable certifications. FinTech: Foundations, Payments, and Regulations from Wharton, University of Pennsylvania (Coursera, 2025). Introduction to Data Analytics from IBM (Coursera, 2025). Foundations: Data, Data, Everywhere from Google (Coursera, 2025). Cybersecurity for Everyone from the University of Maryland (Coursera, 2025). Algorithms on Graphs from UC San Diego (Coursera, 2021). R Programming from Johns Hopkins University (Coursera, 2021). Data Structures in Java, Top Performer, from Coding Ninjas (2020). He also sat the UKPCS government exam in 2024 (an exam, not a certification).

## Career Timeline and Arc

Type: Timeline
Tags: career, history, journey, gap, india, ireland, onedirect, ngo, msc
Source: Resume

Content:
The arc is deliberate, India to Ireland. 2018 to 2022: B.E. Computer Science, Chandigarh University, India (CGPA 7.32). July 2022 to March 2023: Software Engineer at OneDirect (Gupshup Group), Bengaluru, working on Java/Spring, Kafka, and RabbitMQ in production, where backend became full-stack. 2023 to 2024: a deliberate step away for competitive exams (CAT 2023, UKPCS 2024) and NGO recovery-support work, not a hole in the story but the densest, most human part of it. 2025: relocated from India to Ireland and began the M.Sc Economics and Financial Technology at the University of Galway. 2026 to present: building and pitching founder-stage ventures, plus a live client site and quant work. Each phase produced the capabilities the next one needed, so the breadth is structural, not accidental.

## Full-Stack and Role Fit

Type: Fit
Tags: job-fit, full-stack, founding-engineer, ai-systems, ownership, recruiter
Source: Synthesis

Content:
Is Shrey suitable for a full-stack role? Yes, and the evidence is concrete. He has production backend experience (Java/Spring Boot microservices, Kafka, RabbitMQ at OneDirect) and ships full-stack products end to end: PC Trade Frames (React plus FastAPI, live for a paying client) and Coastline Gaming (Next.js 16 with geospatial search, security, async jobs, and a Jest plus Playwright test suite). He owns architecture through deployment with no handoff latency, works across Java, TypeScript/Node/NestJS, and Python, and integrates AI pragmatically. He is well suited to full-stack, founding-engineer, AI-systems, and backend-leaning roles, especially in early-stage teams where ownership and honest status reporting matter. For a junior or mid software-engineering role he is comfortably qualified; his backend depth and breadth point above entry level.

## Evidence - Java and Spring Boot

Type: Evidence
Tags: java, spring-boot, backend, evidence, skill-check, onedirect, sitescribe, fixflow
Source: Synthesis

Content:
What evidence supports Shrey's Java and Spring Boot experience? Three concrete sources. First, production work: at OneDirect (Gupshup Group), July 2022 to March 2023, he built and maintained Java Spring Boot microservices for a production CRM platform, with Kafka and RabbitMQ event processing and Jaeger plus Grafana observability. Second, SiteScribe AI: a Java 21 and Spring Boot 3 backend with JPA, Flyway migrations, OpenAPI docs, real BCrypt plus JWT auth, and per-company data isolation. Third, FixFlow Ireland: a Spring Boot backend (with a Next.js frontend) implementing intake, triage, contractor routing, an Eircode-keyed evidence vault, and role dashboards over an audit log. So the Spring Boot claim is backed by both real production employment and multiple self-built systems.

## Contact and Links

Type: Contact
Tags: contact, links, github, linkedin, email, location
Source: Resume

Content:
Shrey is based in Galway, Ireland. GitHub: github.com/shreyghildiyal737. LinkedIn: linkedin.com/in/shrey-ghildiyal. Email: shreyghildiyal71@gmail.com. Portfolio: shrey-ghildiyal-resume.vercel.app. He is open to full-stack, AI-systems, backend, and founding-engineer roles.
