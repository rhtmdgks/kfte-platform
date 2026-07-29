import { createBrowserClient } from "@supabase/ssr"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import type { Database } from "@/types/database"

export function createClient() {
  const env = getSupabasePublicEnv()
  if (!env) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    )
  }

  return createBrowserClient<Database>(env.url, env.anonKey)
}
