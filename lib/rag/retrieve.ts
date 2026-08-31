import { generateEmbedding, isGeminiConfigured } from "./gemini";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { fallbackSearch } from "./fallback-search";
import type { Confidence, RetrievalResult, RetrievedChunk } from "./types";

// Vector search (Gemini embedding + Supabase pgvector) with a keyword fallback
// when either service is unconfigured, errors, or returns nothing.

const MATCH_COUNT = 6;
const MATCH_THRESHOLD = 0.2;

interface MatchRow {
  id: string;
  title: string;
  source: string;
  source_type: string;
  tags: string[] | null;
  content: string;
  similarity: number;
}

/**
 * Retrieve the most relevant knowledge chunks for a query.
 * Tries vector search (Gemini embedding + Supabase pgvector RPC) first, and
 * falls back to local keyword search if either is unconfigured, errors, or
 * returns nothing. The fallback keeps /api/chat working with zero infra.
 */
export async function retrieveContext(query: string): Promise<RetrievalResult> {
  if (isGeminiConfigured() && isSupabaseConfigured()) {
    try {
      const embedding = await generateEmbedding(query, "RETRIEVAL_QUERY");
      const { data, error } = await getSupabase().rpc("match_resume_chunks", {
        query_embedding: embedding,
        match_count: MATCH_COUNT,
        match_threshold: MATCH_THRESHOLD,
      });
      if (error) throw new Error(error.message);

      const rows = (data ?? []) as MatchRow[];
      if (rows.length > 0) {
        const chunks: RetrievedChunk[] = rows.map((r) => ({
          title: r.title,
          source: r.source,
          source_type: r.source_type,
          tags: r.tags ?? [],
          content: r.content,
          similarity: r.similarity,
        }));
        return { chunks, mode: "rag" };
      }
      // Vector search found nothing above threshold; try keywords before giving up.
    } catch (err) {
      console.error("[rag] vector retrieval failed, falling back to keywords:", err);
    }
  }

  const chunks = await fallbackSearch(query, MATCH_COUNT);
  return { chunks, mode: "fallback" };
}

/** Confidence is derived from retrieval quality, not asserted by the model. */
export function scoreConfidence(result: RetrievalResult): Confidence {
  if (result.chunks.length === 0) return "low";
  if (result.mode === "rag") {
    const top = result.chunks[0].similarity ?? 0;
    if (top >= 0.75 && result.chunks.length >= 2) return "high";
    if (top >= 0.55) return "medium";
    return "low";
  }
  // Keyword fallback never claims high confidence.
  return result.chunks.length >= 2 ? "medium" : "low";
}
