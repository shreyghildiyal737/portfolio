import { readFile } from "node:fs/promises";
import path from "node:path";
import { ResumeChat } from "@/components/ask/ResumeChat";
import { chunkMarkdown } from "@/lib/rag/chunk";

export const metadata = {
  title: "Ask my AI Resume | Shrey Ghildiyal",
  description:
    "A recruiter-focused AI assistant grounded in Shrey Ghildiyal's verified resume, projects, and experience. Ask evidence-backed questions and see the sources behind every answer.",
};

// Count the verified knowledge sections at build time so the page can state its
// real grounding without a hardcoded (and stale-prone) number.
async function getSectionCount(): Promise<number> {
  try {
    const md = await readFile(
      path.join(process.cwd(), "data", "knowledge", "shrey-knowledge.md"),
      "utf-8"
    );
    return new Set(chunkMarkdown(md).map((c) => c.title)).size;
  } catch {
    return 0;
  }
}

export default async function AskPage() {
  const sectionCount = await getSectionCount();
  return <ResumeChat sectionCount={sectionCount} />;
}
