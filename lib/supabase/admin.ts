import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import type { Database } from "@/types/database"

/** Service-role client for trusted server routes only. Never import from client components. */
export function createAdminClient() {
  const env = getSupabasePublicEnv()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!env || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createClient<Database>(env.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
