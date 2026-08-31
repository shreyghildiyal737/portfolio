/**
 * Ingest the knowledge base into Supabase pgvector.
 *
 * Reads data/knowledge/shrey-knowledge.md, splits it into chunks, embeds each
 * with Gemini (768 dims), clears the resume_chunks table, and inserts the fresh
 * rows. Run with:  npm run ingest:resume
 *
 * Requires GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, and
 * SUPABASE_SERVICE_ROLE_KEY (loaded here from .env.local).
 */
import path from "node:path";
import { readFile } from "node:fs/promises";

const KNOWLEDGE_PATH = path.join(process.cwd(), "data", "knowledge", "shrey-knowledge.md");
const EMBED_DELAY_MS = 250; // gentle pacing for the free-tier rate limit

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // Load .env.local before importing modules that read env at load time.
  try {
    process.loadEnvFile(path.join(process.cwd(), ".env.local"));
  } catch {
    // Fall back to whatever is already in the shell environment.
  }

  const { chunkMarkdown, embeddingText } = await import("../lib/rag/chunk");
  const { generateEmbedding, isGeminiConfigured } = await import("../lib/rag/gemini");
  const { getSupabase, isSupabaseConfigured } = await import("../lib/rag/supabase");

  if (!isGeminiConfigured()) {
    console.error("✗ GEMINI_API_KEY is not set. Add it to .env.local.");
    process.exit(1);
  }
  if (!isSupabaseConfigured()) {
    console.error("✗ Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
    process.exit(1);
  }

  const markdown = await readFile(KNOWLEDGE_PATH, "utf-8");
  const chunks = chunkMarkdown(markdown);
  console.log(`Parsed ${chunks.length} chunks from ${path.basename(KNOWLEDGE_PATH)}.`);

  const rows: Array<{
    title: string;
    source: string;
    source_type: string;
    tags: string[];
    content: string;
    embedding: number[];
  }> = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(embeddingText(chunk), "RETRIEVAL_DOCUMENT");
    rows.push({
      title: chunk.title,
      source: chunk.source,
      source_type: chunk.source_type,
      tags: chunk.tags,
      content: chunk.content,
      embedding,
    });
    process.stdout.write(`  embedded ${i + 1}/${chunks.length}\r`);
    if (i < chunks.length - 1) await sleep(EMBED_DELAY_MS);
  }
  console.log(`\nEmbedded ${rows.length} chunks (768 dims each).`);

  const supabase = getSupabase();

  // Clear existing rows so re-ingestion is idempotent.
  const { error: deleteError } = await supabase
    .from("resume_chunks")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) {
    console.error("✗ Failed to clear resume_chunks:", deleteError.message);
    process.exit(1);
  }

  const { error: insertError, count } = await supabase
    .from("resume_chunks")
    .insert(rows, { count: "exact" });
  if (insertError) {
    console.error("✗ Failed to insert chunks:", insertError.message);
    process.exit(1);
  }

  console.log(`✓ Inserted ${count ?? rows.length} chunks into resume_chunks.`);
}

main().catch((err) => {
  console.error("✗ Ingestion failed:", err);
  process.exit(1);
});
