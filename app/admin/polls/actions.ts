"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { PollQuestions } from "@/lib/polls/types"
import type { Json } from "@/types/database"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요합니다.")
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (!profile || profile.role !== "admin") throw new Error("관리자 권한이 필요합니다.")
  return { supabase, user }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
    + "-" + Date.now().toString(36)
}

export async function createPoll() {
  const { supabase, user } = await requireAdmin()
  const slug = slugify("제목 없는 투표")
  const { data, error } = await supabase
    .from("polls")
    .insert({
      title: "제목 없는 투표",
      slug,
      status: "draft",
      questions: [] as unknown as Json,
      created_by: user.id,
    })
    .select("id")
    .single()
  if (error) throw error
  revalidatePath("/admin/polls")
  redirect(`/admin/polls/${data.id}/edit`)
}

export async function updatePoll(
  id: string,
  values: {
    title: string
    slug: string
    description: string
    status: "draft" | "open" | "closed"
    questions: PollQuestions
  },
) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from("polls")
    .update({
      title: values.title,
      slug: values.slug,
      description: values.description || null,
      status: values.status,
      questions: values.questions as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) throw error
  revalidatePath("/admin/polls")
  revalidatePath(`/admin/polls/${id}/edit`)
  revalidatePath(`/vote/${values.slug}`)
}

export async function deletePoll(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from("polls").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/polls")
  redirect("/admin/polls")
}

export async function setPollStatus(id: string, status: "draft" | "open" | "closed") {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from("polls")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw error
  revalidatePath("/admin/polls")
  revalidatePath(`/admin/polls/${id}/edit`)
}
