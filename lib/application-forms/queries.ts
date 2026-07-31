import { createClient } from "@/lib/supabase/server"
import {
  normalizeFormSlug,
  parseFormSchema,
  parseFormSettings,
} from "@/lib/application-forms/parse"
import type { Tables } from "@/types/database"

export type ApplicationFormRow = Tables<"application_forms">
export type ApplicationFormResponseRow = Tables<"application_form_responses">

export async function listForms() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .order("updated_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getFormById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function getPublishedFormBySlug(slug: string) {
  const supabase = await createClient()
  const normalized = normalizeFormSlug(slug)
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .eq("slug", normalized)
    .eq("status", "published")
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function getFormBySlug(slug: string) {
  const supabase = await createClient()
  const normalized = normalizeFormSlug(slug)
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .eq("slug", normalized)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

/** 이 폼을 신청 링크로 쓰는 행사 상세 경로. 없으면 행사 목록. */
export async function getEventPathForForm(formId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("content_posts")
    .select("slug")
    .eq("content_type", "event")
    .filter("metadata->>applicationFormId", "eq", formId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data?.slug ? `/activities/events/${data.slug}` : "/activities/events"
}

export async function listResponses(formId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("application_form_responses")
    .select("*")
    .eq("form_id", formId)
    .order("submitted_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function countResponses(formId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("application_form_responses")
    .select("*", { count: "exact", head: true })
    .eq("form_id", formId)
  if (error) throw new Error(error.message)
  return count ?? 0
}

export function hydrateForm(row: ApplicationFormRow) {
  return {
    ...row,
    parsedSchema: parseFormSchema(row.schema),
    parsedSettings: parseFormSettings(row.settings),
  }
}
