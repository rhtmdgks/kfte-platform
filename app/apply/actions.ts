"use server"

import { createClient } from "@/lib/supabase/server"
import { parseFormSchema, parseFormSettings } from "@/lib/application-forms/parse"
import { validateAnswers, type AnswerMap } from "@/lib/application-forms/validate-answers"
import type { Json } from "@/types/database"

export async function submitFormResponse(
  formId: string,
  payload: {
    answers: AnswerMap
    email?: string
    editToken?: string
  },
) {
  const supabase = await createClient()

  const { data: form, error: formError } = await supabase
    .from("application_forms")
    .select("*")
    .eq("id", formId)
    .eq("status", "published")
    .maybeSingle()

  if (formError || !form) {
    return { ok: false as const, error: "제출할 수 없는 폼입니다." }
  }

  const schema = parseFormSchema(form.schema)
  const settings = parseFormSettings(form.settings)
  const validation = validateAnswers(schema, settings, payload.answers, payload.email)

  if (!validation.ok) {
    return { ok: false as const, error: "입력값을 확인해 주세요.", errors: validation.errors }
  }

  const answers = payload.answers as Json
  const email = settings.collectEmail ? payload.email?.trim() || null : null

  if (payload.editToken && settings.allowResponseEditing) {
    const { data, error } = await supabase
      .from("application_form_responses")
      .update({
        answers,
        respondent_email: email,
        score: validation.score ?? null,
        submitted_at: new Date().toISOString(),
      })
      .eq("form_id", formId)
      .eq("edit_token", payload.editToken)
      .select("id, edit_token, score")
      .maybeSingle()

    if (error || !data) {
      return { ok: false as const, error: "응답을 수정할 수 없습니다." }
    }

    return {
      ok: true as const,
      responseId: data.id,
      editToken: data.edit_token ?? undefined,
      score: data.score ?? undefined,
      confirmationMessage: settings.confirmationMessage,
    }
  }

  const editToken = settings.allowResponseEditing ? crypto.randomUUID() : null

  const { data, error } = await supabase
    .from("application_form_responses")
    .insert({
      form_id: formId,
      answers,
      respondent_email: email,
      edit_token: editToken,
      score: validation.score ?? null,
    })
    .select("id, edit_token, score")
    .single()

  if (error || !data) {
    return { ok: false as const, error: error?.message || "제출에 실패했습니다." }
  }

  return {
    ok: true as const,
    responseId: data.id,
    editToken: data.edit_token ?? undefined,
    score: data.score ?? undefined,
    confirmationMessage: settings.confirmationMessage,
  }
}
