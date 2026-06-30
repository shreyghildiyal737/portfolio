import { NextRequest, NextResponse } from "next/server";
import { retrieveContext, scoreConfidence } from "@/lib/rag/retrieve";
import { generateAnswer, isGeminiConfigured } from "@/lib/rag/gemini";
import { SYSTEM_PROMPT, buildUserPrompt, suggestedFollowUps } from "@/lib/rag/prompt";
import type { AnswerSource, ChatResponse, RetrievedChunk } from "@/lib/rag/types";

// The fallback path reads the corpus from disk, so this must run on Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1000;
const INSUFFICIENT =
  "I do not have enough evidence in Shrey's resume data to answer that.";
const AI_UNAVAILABLE =
  "The AI answer is unavailable right now, but here are the most relevant grounded matches from Shrey's resume.";

// Best-effort in-memory rate limit. Serverless instances are not shared, so this
// is a soft guard against a single hot instance, not a global limiter (the
// Vercel WAF handles the hard edge limit on /api).
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function snippet(text: string, max = 240): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}...` : clean;
}

function toSources(chunks: RetrievedChunk[]): AnswerSource[] {
  return chunks.map((c) => ({
    title: c.title,
    source: c.source,
    source_type: c.source_type,
    snippet: snippet(c.content),
    similarity: c.similarity,
  }));
}

export async function POST(request: NextRequest) {
  let message: unknown;
  try {
    ({ message } = (await request.json()) as { message?: unknown });
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "message_too_long" }, { status: 413 });
  }
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const query = message.trim();
  const retrieval = await retrieveContext(query);
  const sources = toSources(retrieval.chunks);
  const followUps = suggestedFollowUps(query);

  // No grounded context at all - refuse rather than improvise.
  if (retrieval.chunks.length === 0) {
    const body: ChatResponse = {
      answer: INSUFFICIENT,
      sources: [],
      confidence: "low",
      followUps,
      mode: "fallback",
    };
    return NextResponse.json(body);
  }

  // Try to generate a grounded answer. If Gemini is unconfigured or fails, return
  // the retrieved snippets so the assistant still gives the recruiter something.
  if (isGeminiConfigured()) {
    try {
      const answer = await generateAnswer(
        SYSTEM_PROMPT,
        buildUserPrompt(query, retrieval.chunks)
      );
      const body: ChatResponse = {
        answer,
        sources,
        confidence: scoreConfidence(retrieval),
        followUps,
        mode: retrieval.mode, // "rag" only if vector search also succeeded
      };
      return NextResponse.json(body);
    } catch (err) {
      console.error("[chat] generation failed, returning grounded matches:", err);
    }
  }

  const body: ChatResponse = {
    answer: `${AI_UNAVAILABLE}\n\n${sources[0]?.snippet ?? ""}`.trim(),
    sources,
    confidence: retrieval.mode === "rag" ? "medium" : "low",
    followUps,
    mode: "fallback",
  };
  return NextResponse.json(body);
}
