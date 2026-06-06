// ─────────────────────────────────────────────────────────────────────────────
// Resolve Upstash Redis REST credentials from whichever names are present:
//   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (the @upstash/redis native names)
//   - KV_REST_API_URL / KV_REST_API_TOKEN                (provisioned by the Vercel
//                                                         Upstash Marketplace integration)
// Returns null when neither pair is set, so the store falls back to the local file.
// ─────────────────────────────────────────────────────────────────────────────

export function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}
