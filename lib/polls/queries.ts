import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { parsePollResults, type PollResults } from "./types"

type DB = Database

export async function listPolls(supabase: SupabaseClient<DB>) {
  const { data, error } = await supabase
    .from("polls")
    .select("id, slug, title, status, created_at, updated_at")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getPollById(supabase: SupabaseClient<DB>, id: string) {
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function getPollBySlug(supabase: SupabaseClient<DB>, slug: string) {
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .single()
  if (error) throw error
  return data
}

export async function getPollResults(
  supabase: SupabaseClient<DB>,
  pollId: string,
): Promise<PollResults | null> {
  const { data, error } = await supabase.rpc("get_poll_results", { p_poll_id: pollId })
  if (error) throw error
  return parsePollResults(data)
}

export async function getPollVoteCount(supabase: SupabaseClient<DB>, pollId: string) {
  const { count, error } = await supabase
    .from("poll_votes")
    .select("id", { count: "exact", head: true })
    .eq("poll_id", pollId)
  if (error) throw error
  return count ?? 0
}
