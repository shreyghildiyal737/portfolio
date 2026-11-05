// Gemini REST client - embeddings and answer generation.
//
// We talk to the Generative Language REST API directly with fetch so the
// project keeps zero AI SDK dependencies. The API key is read from
// GEMINI_API_KEY and only ever used server-side.
import "server-only"; // server-only: keeps the API key out of any client bundle

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
// Tried in order. The "-latest" aliases follow Google's current release, so a
// retired model (gemini-2.0-flash went in 2026 and silently pushed every answer
// into fallback) cannot take the assistant down again. Lite leads because it
// answers in about two seconds and the full model is often at capacity on the
// free tier; summarising a handful of retrieved passages does not need more.
const CHAT_MODELS = [
  process.env.GEMINI_CHAT_MODEL,
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
].filter((m, i, all): m is string => Boolean(m) && all.indexOf(m) === i);

// Must match the pgvector column dimension in Supabase (vector(768)).
export const EMBED_DIMENSIONS = 768;

// Per call. One embedding plus two chat attempts stays inside the chat route's
// maxDuration, so our own graceful fallback fires before the host kills the request.
const REQUEST_TIMEOUT_MS = 8_000;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

class GeminiHttpError extends Error {
  constructor(readonly status: number, detail: string) {
    super(`Gemini API ${status}: ${detail.slice(0, 300)}`);
  }
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
    throw new GeminiHttpError(res.status, detail);
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

// Worth moving to the next model: retired (404), rate limited (429), overloaded
// (5xx) or timed out. Anything else, such as a bad key, fails the same everywhere.
function isModelSpecific(err: unknown): boolean {
  if (err instanceof GeminiHttpError) {
    return err.status === 404 || err.status === 429 || err.status >= 500;
  }
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

/** Generate a grounded answer. Returns plain text; throws once every model has failed. */
export async function generateAnswer(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  let lastError: unknown;
  for (const model of CHAT_MODELS) {
    try {
      return await generateWith(model, systemPrompt, userPrompt);
    } catch (err) {
      lastError = err;
      if (!isModelSpecific(err)) break;
      console.warn(`[gemini] ${model} unavailable, trying the next model:`, err);
    }
  }
  throw lastError;
}

async function generateWith(
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `${API_BASE}/models/${model}:generateContent`;
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

  if (!text) throw new Error(`${model} returned an empty answer`);
  return text;
}
