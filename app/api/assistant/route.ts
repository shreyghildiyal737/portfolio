import { NextRequest, NextResponse } from "next/server";
import { retrieveResponse } from "@/data/chatKnowledge";
import type { ContentView } from "@/data/chatKnowledge";

// Optional: swap this import for Cloudflare Workers AI or similar when ready.
// The response shape (status, lede, bullets, deepDive?) must stay the same.

const FALLBACK_LEDE =
  "I don't have enough specific information on that yet, but I can answer from Shrey's current profile and project data.";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { query: string; mode: string };
  const { query, mode } = body;

  if (!query?.trim()) {
    return NextResponse.json({ error: "empty_query" }, { status: 400 });
  }

  const entry = retrieveResponse(query.trim());
  const content: ContentView =
    mode === "engineer" ? entry.engineer : entry.recruiter;

  const lede = entry.id === "fallback" ? FALLBACK_LEDE : content.lede;
  const deepDive = mode === "engineer" ? content.deepDive : undefined;

  return NextResponse.json({
    status: "Grounded Local Mode",
    lede,
    bullets: content.bullets,
    ...(deepDive ? { deepDive } : {}),
  });
}
