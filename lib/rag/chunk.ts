import type { KnowledgeChunk } from "./types";

// Markdown chunker for the knowledge base.
//
// Format expected per section (see data/knowledge/shrey-knowledge.md):
//
//   ## Section Title
//
//   Type: Work Experience
//   Tags: backend, spring-boot
//   Source: Resume
//
//   Content:
//   The actual prose...
//
// We split on level-2 (##) headings, parse the metadata lines, and treat the
// rest as content. Long sections are windowed into overlapping chunks so each
// stays within a comfortable embedding size while keeping its title.

const TARGET_CHARS = 900; // upper bound of a single chunk's content
const MIN_SPLIT_CHARS = 1100; // only split sections longer than this
const OVERLAP_CHARS = 140; // overlap between adjacent windows

interface ParsedSection {
  title: string;
  source: string;
  source_type: string;
  tags: string[];
  content: string;
}

function parseSection(block: string): ParsedSection | null {
  const lines = block.split("\n");
  const title = lines.shift()?.trim() ?? "";
  if (!title) return null;

  let source = "Knowledge Base";
  let source_type = "Reference";
  let tags: string[] = [];
  const contentLines: string[] = [];
  let inContent = false;

  for (const raw of lines) {
    const line = raw.trim();

    if (!inContent) {
      // The literal "Content:" marker switches us into prose mode.
      if (/^content:\s*$/i.test(line)) {
        inContent = true;
        continue;
      }
      const meta = line.match(/^(Type|Tags|Source):\s*(.*)$/i);
      if (meta) {
        const key = meta[1].toLowerCase();
        const value = meta[2].trim();
        if (key === "type") source_type = value || source_type;
        else if (key === "source") source = value || source;
        else if (key === "tags") {
          tags = value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
        continue;
      }
      if (line === "") continue; // skip blank lines before content
      // A non-metadata, non-blank line before an explicit Content: marker is
      // treated as the start of the content (the marker is optional).
      inContent = true;
    }

    contentLines.push(raw);
  }

  const content = contentLines.join("\n").trim();
  if (!content) return null;

  return { title, source, source_type, tags, content };
}

/** Split overly long content into overlapping windows on sentence/word boundaries. */
function windowContent(content: string): string[] {
  if (content.length <= MIN_SPLIT_CHARS) return [content];

  const windows: string[] = [];
  let start = 0;

  while (start < content.length) {
    let end = Math.min(start + TARGET_CHARS, content.length);

    if (end < content.length) {
      // Prefer to break at a sentence end, then a space, near the target.
      const slice = content.slice(start, end);
      const sentenceBreak = Math.max(
        slice.lastIndexOf(". "),
        slice.lastIndexOf("? "),
        slice.lastIndexOf("! ")
      );
      const wordBreak = slice.lastIndexOf(" ");
      if (sentenceBreak > TARGET_CHARS * 0.5) end = start + sentenceBreak + 1;
      else if (wordBreak > TARGET_CHARS * 0.5) end = start + wordBreak;
    }

    windows.push(content.slice(start, end).trim());

    if (end >= content.length) break;
    start = Math.max(end - OVERLAP_CHARS, start + 1);
  }

  return windows.filter(Boolean);
}

/**
 * Parse a knowledge-base Markdown document into retrievable chunks.
 * Any leading `# Title` and intro prose before the first `## ` are ignored.
 */
export function chunkMarkdown(markdown: string): KnowledgeChunk[] {
  const normalized = markdown.replace(/\r\n/g, "\n");

  // Split on level-2 headings only (## ), not deeper or the document title.
  const parts = normalized.split(/^##\s+/m).slice(1);

  const chunks: KnowledgeChunk[] = [];
  for (const part of parts) {
    const section = parseSection(part);
    if (!section) continue;

    for (const window of windowContent(section.content)) {
      chunks.push({
        title: section.title,
        source: section.source,
        source_type: section.source_type,
        tags: section.tags,
        content: window,
      });
    }
  }

  return chunks;
}

/** Text used for embedding: prepend the title so it carries section context. */
export function embeddingText(chunk: KnowledgeChunk): string {
  return `${chunk.title}\n\n${chunk.content}`;
}
