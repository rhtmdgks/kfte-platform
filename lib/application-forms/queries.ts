import { createClient } from "@/lib/supabase/server"
import { parseFormSchema, parseFormSettings } from "@/lib/application-forms/parse"
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
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function getFormBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
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
