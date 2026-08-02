import { createClient } from "@/lib/supabase/server"

export async function getAccountSectionCounts() {
  const supabase = await createClient()
  const [{ count: adminCount }, { count: userCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user"),
  ])

  return {
    adminCount: adminCount ?? 0,
    userCount: userCount ?? 0,
  }
}
