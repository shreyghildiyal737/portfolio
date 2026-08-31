# AI Resume Assistant (RAG) - `/ask`

A free-first, retrieval-augmented assistant that answers recruiter questions about
Shrey using only his verified resume and portfolio. Every answer shows the
evidence it was drawn from, and the assistant refuses when the knowledge base does
not support an answer.

- **Page:** `/ask`
- **API:** `POST /api/chat`
- **Embeddings + generation:** Gemini (Google AI Studio free tier)
- **Vector store:** Supabase Postgres + pgvector
- **Fallback:** local keyword search over the Markdown corpus (no infra needed)

## How it works

1. The knowledge base lives in `data/knowledge/shrey-knowledge.md` as titled,
   metadata-tagged sections (`Type`, `Tags`, `Source`, `Content`).
2. `npm run ingest:resume` chunks it, embeds each chunk with Gemini (768 dims),
   and upserts the rows into the Supabase `resume_chunks` table.
3. On a question, `/api/chat` embeds the query, calls the `match_resume_chunks`
   RPC for the nearest chunks, then asks Gemini to answer **only** from them.
4. Confidence is derived from retrieval similarity, not asserted by the model.

### Free-first fallback

The page works with **zero** configuration. If `GEMINI_API_KEY` or the Supabase
env vars are missing (or either service errors), retrieval falls back to local
keyword search over the Markdown file and the API returns the best grounded
snippets with `mode: "fallback"`. This keeps the resume link functional even when
free API limits are hit.

## Setup

### 1. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
GEMINI_API_KEY=            # https://aistudio.google.com/apikey
NEXT_PUBLIC_SUPABASE_URL=  # Supabase project URL (public)
SUPABASE_SERVICE_ROLE_KEY= # Supabase service role key (SECRET, server-only)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> The service role key must **never** be exposed to the client. It is only used
> in the ingestion script and the server-side retrieval module. Do not prefix it
> with `NEXT_PUBLIC`.

### 2. Supabase schema

In the Supabase SQL editor, run:

```sql
create extension if not exists vector;

create table if not exists resume_chunks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,
  source_type text not null,
  tags text[] default '{}',
  content text not null,
  embedding vector(768),
  created_at timestamptz default now()
);

create or replace function match_resume_chunks (
  query_embedding vector(768),
  match_count int default 6,
  match_threshold float default 0.2
)
returns table (
  id uuid,
  title text,
  source text,
  source_type text,
  tags text[],
  content text,
  similarity float
)
language sql stable
as $$
  select
    resume_chunks.id,
    resume_chunks.title,
    resume_chunks.source,
    resume_chunks.source_type,
    resume_chunks.tags,
    resume_chunks.content,
    1 - (resume_chunks.embedding <=> query_embedding) as similarity
  from resume_chunks
  where 1 - (resume_chunks.embedding <=> query_embedding) > match_threshold
  order by resume_chunks.embedding <=> query_embedding
  limit match_count;
$$;
```

Optional but recommended for larger corpora (an approximate index):

```sql
create index on resume_chunks
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);
```

### 3. Ingest the knowledge base

```bash
npm run ingest:resume
```

This clears `resume_chunks` and re-inserts fresh embeddings. Re-run it whenever
you edit `data/knowledge/shrey-knowledge.md`.

### 4. Run

```bash
npm run dev      # /ask works immediately (fallback mode without keys)
npm run build    # production build
```

## Editing the knowledge base

Edit `data/knowledge/shrey-knowledge.md`. Each `##` section becomes one or more
chunks. Keep the metadata lines and the `Content:` block. Only add facts that are
true and verifiable - the assistant is instructed never to invent anything, and
the corpus is the single source of truth. Re-run `npm run ingest:resume` after
edits (the fallback path picks up edits with no ingestion).

## Deploy on Vercel

1. Add `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and
   `SUPABASE_SERVICE_ROLE_KEY` in Project Settings → Environment Variables.
2. Run the SQL above in Supabase once.
3. Run `npm run ingest:resume` locally (or in CI) to populate the table - the
   ingestion writes to Supabase directly, so it does not need to run on Vercel.
4. Deploy. The `/api` rate limit is already covered by the existing Vercel WAF
   rule; the route also applies a soft in-memory per-instance limit.

## Limitations

- The free Gemini tier has rate limits; under load the assistant degrades to
  grounded snippets rather than failing.
- The corpus is intentionally small and curated. The assistant will not answer
  beyond it, by design.
- Confidence is a heuristic over retrieval similarity, not a calibrated score.
