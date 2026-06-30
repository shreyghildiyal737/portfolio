import { readFile } from "node:fs/promises";
import path from "node:path";
import { chunkMarkdown } from "./chunk";
import type { KnowledgeChunk, RetrievedChunk } from "./types";

// Local keyword search over the knowledge Markdown. This is the free-first
// fallback: it needs no database and no API keys, so /api/chat keeps working
// even when Supabase or Gemini are unavailable. It runs on the Node runtime
// because it reads the corpus from disk.
//
// Matching is word-boundary based (not substring) with light stemming, so a
// 2-letter token like "ai" matches the word "AI" but not "maintained", and
// "projects" matches "project". A minimum score gates out off-topic questions
// (e.g. "medical history") so the API can honestly refuse instead of surfacing
// a spurious snippet.

const KNOWLEDGE_PATH = path.join(
  process.cwd(),
  "data",
  "knowledge",
  "shrey-knowledge.md"
);

// Below this score a chunk is too weak a match to count as evidence. Tuned so
// real recruiter questions clear it comfortably while off-topic ones do not.
const MIN_SCORE = 4;

const STOPWORDS = new Set([
  "the", "and", "for", "are", "was", "were", "with", "that", "this", "his",
  "has", "have", "had", "does", "did", "what", "who", "how", "why", "can",
  "could", "would", "you", "your", "shrey", "about", "tell", "give", "from",
  "into", "any", "all", "its", "than", "then", "them", "they", "their",
  "there", "here", "been", "being", "also", "each", "more", "most", "some",
  "such", "not", "but", "out", "get", "got", "use", "used", "using", "is",
  "of", "to", "in", "on", "do", "he", "it", "me", "an", "as", "at", "by",
  "or", "so", "we", "be", "if", "up", "my", "no", "us",
]);

/** Drop a trailing plural "s" so "projects" matches "project". */
function stem(word: string): string {
  return word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
}

/** Split on non-alphanumeric, drop short/stop words, stem. Hyphens split too. */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w))
    .map(stem);
}

interface IndexedChunk {
  chunk: KnowledgeChunk;
  title: Set<string>;
  tags: Set<string>;
  body: Map<string, number>;
}

let index: IndexedChunk[] | null = null;

async function loadIndex(): Promise<IndexedChunk[]> {
  if (index) return index;
  const md = await readFile(KNOWLEDGE_PATH, "utf-8");
  index = chunkMarkdown(md).map((chunk) => {
    const body = new Map<string, number>();
    for (const w of words(chunk.content)) body.set(w, (body.get(w) ?? 0) + 1);
    return {
      chunk,
      title: new Set(words(chunk.title)),
      tags: new Set(words(chunk.tags.join(" "))),
      body,
    };
  });
  return index;
}

/**
 * Keyword-score every chunk against the query and return the best matches.
 * Title and tag hits weigh above body frequency. Returns [] when nothing clears
 * MIN_SCORE, which the API treats as "no grounded evidence". similarity is null
 * because this path produces no vector distance.
 */
export async function fallbackSearch(
  query: string,
  limit = 6
): Promise<RetrievedChunk[]> {
  const indexed = await loadIndex();
  const terms = [...new Set(words(query))];
  if (terms.length === 0) return [];

  const scored = indexed.map((entry) => {
    let score = 0;
    for (const term of terms) {
      if (entry.title.has(term)) score += 5;
      if (entry.tags.has(term)) score += 3;
      score += Math.min(entry.body.get(term) ?? 0, 4); // cap runaway repetition
    }
    return { chunk: entry.chunk, score };
  });

  return scored
    .filter((s) => s.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk }) => ({ ...chunk, similarity: null }));
}
