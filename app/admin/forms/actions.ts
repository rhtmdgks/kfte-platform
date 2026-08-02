"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { parseFormSchema, parseFormSettings, slugifyFormTitle } from "@/lib/application-forms/parse"
import {
  createDefaultSettings,
  createEmptySchema,
  publicFormPath,
} from "@/lib/application-forms/types"
import {
  validateAnswers,
  type AnswerMap,
} from "@/lib/application-forms/validate-answers"
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

  if (profile?.role !== "admin") throw new Error("관리자만 접근할 수 있습니다.")
  return { supabase, user }
}

function revalidateFormPaths(slug?: string) {
  revalidatePath("/admin/forms")
  if (slug) revalidatePath(publicFormPath(slug))
}

export async function createForm(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const title = ((formData.get("title") as string) || "제목 없는 폼").trim() || "제목 없는 폼"
  let slug = ((formData.get("slug") as string) || "").trim() || slugifyFormTitle(title)

  const { data: existing } = await supabase
    .from("application_forms")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()
  if (existing) slug = `${slug}-${Date.now().toString(36)}`

  const { data, error } = await supabase
    .from("application_forms")
    .insert({
      title,
      slug,
      description: "",
      status: "draft",
      schema: createEmptySchema() as unknown as Json,
      settings: createDefaultSettings() as unknown as Json,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)
  revalidateFormPaths(slug)
  redirect(`/admin/forms/${data.id}/edit`)
}

export async function updateForm(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const title = ((formData.get("title") as string) || "").trim()
  const description = ((formData.get("description") as string) || "").trim()
  const status = ((formData.get("status") as string) || "draft") as
    | "draft"
    | "published"
    | "closed"
  let slug = ((formData.get("slug") as string) || "").trim()
  const schemaRaw = (formData.get("schema") as string) || ""
  const settingsRaw = (formData.get("settings") as string) || ""

  if (!title) throw new Error("제목을 입력해 주세요.")
  if (!slug) slug = slugifyFormTitle(title)

  let schemaJson: Json
  let settingsJson: Json
  try {
    schemaJson = parseFormSchema(JSON.parse(schemaRaw)) as unknown as Json
  } catch {
    throw new Error("폼 스키마가 올바르지 않습니다.")
  }
  try {
    settingsJson = parseFormSettings(JSON.parse(settingsRaw)) as unknown as Json
  } catch {
    throw new Error("폼 설정이 올바르지 않습니다.")
  }

  const { data: conflict } = await supabase
    .from("application_forms")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle()
  if (conflict) throw new Error("이미 사용 중인 슬러그입니다.")

  const { error } = await supabase
    .from("application_forms")
    .update({
      title,
      description: description || null,
      status,
      slug,
      schema: schemaJson,
      settings: settingsJson,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidateFormPaths(slug)
}

export async function deleteForm(id: string) {
  const { supabase } = await requireAdmin()
  const { data: form } = await supabase
    .from("application_forms")
    .select("slug")
    .eq("id", id)
    .maybeSingle()

  const { error } = await supabase.from("application_forms").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidateFormPaths(form?.slug)
  redirect("/admin/forms")
}

export async function deleteResponse(formId: string, responseId: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from("application_form_responses")
    .delete()
    .eq("id", responseId)
    .eq("form_id", formId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/forms/${formId}/responses`)
  revalidatePath(`/admin/forms/${formId}/edit`)
}

export async function updateResponse(
  formId: string,
  responseId: string,
  payload: { answers: AnswerMap; email?: string | null },
) {
  const { supabase } = await requireAdmin()

  const { data: form, error: formError } = await supabase
    .from("application_forms")
    .select("schema, settings")
    .eq("id", formId)
    .maybeSingle()
  if (formError || !form) throw new Error("폼을 찾을 수 없습니다.")

  const schema = parseFormSchema(form.schema)
  const settings = parseFormSettings(form.settings)
  // ponytail: admin override skips required; still recompute quiz score
  const scored = validateAnswers(
    schema,
    { ...settings, collectEmail: false },
    payload.answers,
  )

  const { error } = await supabase
    .from("application_form_responses")
    .update({
      answers: payload.answers as Json,
      respondent_email: payload.email?.trim() || null,
      score: settings.isQuiz ? (scored.score ?? null) : null,
    })
    .eq("id", responseId)
    .eq("form_id", formId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/forms/${formId}/responses`)
}

export async function createFormForEvent(title: string) {
  const { supabase, user } = await requireAdmin()
  const safeTitle = title.trim() || "행사 신청 폼"
  let slug = slugifyFormTitle(safeTitle)
  const { data: existing } = await supabase
    .from("application_forms")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()
  if (existing) slug = `${slug}-${Date.now().toString(36)}`

  const { data, error } = await supabase
    .from("application_forms")
    .insert({
      title: safeTitle,
      slug,
      description: "",
      status: "published",
      schema: createEmptySchema() as unknown as Json,
      settings: createDefaultSettings() as unknown as Json,
      created_by: user.id,
    })
    .select("id, slug, title")
    .single()

  if (error) throw new Error(error.message)
  revalidateFormPaths(slug)
  return data
}
