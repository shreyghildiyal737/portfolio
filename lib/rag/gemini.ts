// Gemini REST client - embeddings and answer generation.
//
// We talk to the Generative Language REST API directly with fetch so the
// project keeps zero AI SDK dependencies. The API key is read from
// GEMINI_API_KEY and only ever used server-side.
import "server-only"; // hard guarantee this secret-bearing module never ships to the client

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.0-flash";

// Must match the pgvector column dimension in Supabase (vector(768)).
export const EMBED_DIMENSIONS = 768;

// Kept under the platform function budget so our own graceful fallback fires
// before the host kills the request.
const REQUEST_TIMEOUT_MS = 9_000;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

async function postJson(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    // Key travels in a header, not the URL query, to keep it out of request logs.
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

/** L2-normalise a vector. Gemini does not normalise sub-3072 dimension output. */
function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
  return norm > 0 ? vec.map((v) => v / norm) : vec;
}

export type EmbeddingTask = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT";

/** Embed a single piece of text to a normalised 768-dimension vector. */
export async function generateEmbedding(
  text: string,
  task: EmbeddingTask = "RETRIEVAL_QUERY"
): Promise<number[]> {
  const url = `${API_BASE}/models/${EMBED_MODEL}:embedContent`;
  const data = (await postJson(url, {
    model: `models/${EMBED_MODEL}`,
    content: { parts: [{ text }] },
    taskType: task,
    outputDimensionality: EMBED_DIMENSIONS,
  })) as { embedding?: { values?: number[] } };

  const values = data.embedding?.values;
  // Enforce the exact dimension so a model/API change fails loudly here rather
  // than silently at pgvector insert/query time.
  if (!values || values.length !== EMBED_DIMENSIONS) {
    throw new Error(
      `Gemini returned ${values?.length ?? 0} embedding dims, expected ${EMBED_DIMENSIONS}`
    );
  }
  return normalize(values);
}

/** Generate a grounded answer. Returns plain text; throws on API failure. */
export async function generateAnswer(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `${API_BASE}/models/${CHAT_MODEL}:generateContent`;
  const data = (await postJson(url, {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 600,
    },
  })) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini returned an empty answer");
  return text;
}
