import type { VisitorEntry } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Owner notification on a new signature. Posts a Discord embed to a webhook.
//   • No-op when DISCORD_WEBHOOK_URL is unset (feature is opt-in).
//   • Best-effort: never throws - a failed ping must not break the submission.
//   • Awaited by the caller (so it completes in serverless), but time-bounded.
// ─────────────────────────────────────────────────────────────────────────────

const EMBER = 0xd9532b; // matches --idw-ember
const FIELD_MAX = 1024; // Discord embed field value limit

/** Send a "new signature" ping. Resolves quietly whether or not it delivered. */
export async function notifyNewSignature(entry: VisitorEntry): Promise<void> {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  const who = entry.name?.trim() || "Anonymous";
  const sub = [entry.role, entry.org].filter(Boolean).join(" · ");
  const where = [entry.city, entry.country].filter(Boolean).join(", ");

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: "From", value: sub ? `**${who}** - ${sub}` : `**${who}**` },
    { name: "Message", value: entry.message.slice(0, FIELD_MAX) },
  ];
  if (entry.link) fields.push({ name: "Link", value: entry.link.slice(0, FIELD_MAX), inline: true });
  if (where) fields.push({ name: "Where", value: where.slice(0, FIELD_MAX), inline: true });

  const body = {
    username: "Workbench Log",
    embeds: [
      {
        title: "🔧 New signature - pending review",
        description: "Approve or reject it in the owner workbench ( /owner ).",
        color: EMBER,
        fields,
        timestamp: entry.createdAt,
      },
    ],
  };

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Best-effort - swallow network/timeout/abort errors.
  }
}
