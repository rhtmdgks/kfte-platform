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
    // ponytail: no .select() — anon RLS has no SELECT on responses
    const { error } = await supabase
      .from("application_form_responses")
      .update({
        answers,
        respondent_email: email,
        score: validation.score ?? null,
        submitted_at: new Date().toISOString(),
      })
      .eq("form_id", formId)
      .eq("edit_token", payload.editToken)

    if (error) {
      return { ok: false as const, error: "응답을 수정할 수 없습니다." }
    }

    return {
      ok: true as const,
      editToken: payload.editToken,
      score: validation.score ?? undefined,
      confirmationMessage: settings.confirmationMessage,
    }
  }

  const editToken = settings.allowResponseEditing ? crypto.randomUUID() : null

  // ponytail: insert without RETURNING — public SELECT on responses would leak data
  const { error } = await supabase.from("application_form_responses").insert({
    form_id: formId,
    answers,
    respondent_email: email,
    edit_token: editToken,
    score: validation.score ?? null,
  })

  if (error) {
    return { ok: false as const, error: error.message || "제출에 실패했습니다." }
  }

  return {
    ok: true as const,
    editToken: editToken ?? undefined,
    score: validation.score ?? undefined,
    confirmationMessage: settings.confirmationMessage,
  }
}
