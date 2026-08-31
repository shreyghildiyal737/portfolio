// Shared types for the RAG resume assistant.

/** A unit of knowledge produced by the Markdown chunker and stored/retrieved. */
export interface KnowledgeChunk {
  title: string;
  source: string;
  source_type: string;
  tags: string[];
  content: string;
}

/** A chunk returned from retrieval, with a similarity score when available. */
export interface RetrievedChunk extends KnowledgeChunk {
  /** Cosine similarity (0..1) from the vector store, or null for keyword fallback. */
  similarity: number | null;
}

export type RetrievalMode = "rag" | "fallback";

export interface RetrievalResult {
  chunks: RetrievedChunk[];
  mode: RetrievalMode;
}

export type Confidence = "high" | "medium" | "low";

/** A source shown to the user under an answer. */
export interface AnswerSource {
  title: string;
  source: string;
  source_type: string;
  snippet: string;
  similarity: number | null;
}

/** The JSON payload returned by POST /api/chat. */
export interface ChatResponse {
  answer: string;
  sources: AnswerSource[];
  confidence: Confidence;
  followUps: string[];
  mode: RetrievalMode;
}
