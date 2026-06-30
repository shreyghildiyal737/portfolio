import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client for the RAG store.
//
// IMPORTANT: this uses the SERVICE ROLE key and must never be imported into a
// client component. It is used for ingestion (writing chunks) and retrieval
// (calling the match_resume_chunks RPC). Both run on the server.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && serviceKey);
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)"
    );
  }
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
