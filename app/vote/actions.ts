"use server"

import { createClient } from "@/lib/supabase/server"
import { parsePollQuestions, validateVoteAnswers, parsePollResults } from "@/lib/polls/types"
import type { VoteAnswers, PollResults } from "@/lib/polls/types"

export async function submitVote(
  pollId: string,
  voterToken: string,
  answers: VoteAnswers,
): Promise<{ success: boolean; alreadyVoted?: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id, status, questions")
    .eq("id", pollId)
    .single()

  if (pollError || !poll) return { success: false, error: "투표를 찾을 수 없습니다." }
  if (poll.status !== "open") return { success: false, error: "현재 투표가 열려 있지 않습니다." }

  const questions = parsePollQuestions(poll.questions)
  const validationErrors = validateVoteAnswers(questions, answers)
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0].message }
  }

  const { error: insertError } = await supabase.from("poll_votes").insert({
    poll_id: pollId,
    voter_token: voterToken,
    answers: answers as Record<string, string[]>,
  })

  if (insertError) {
    // unique constraint violation → already voted
    if (insertError.code === "23505") {
      return { success: false, alreadyVoted: true }
    }
    return { success: false, error: "투표 저장 중 오류가 발생했습니다." }
  }

  return { success: true }
}

export async function getPollResultsAction(pollId: string): Promise<PollResults | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_poll_results", { p_poll_id: pollId })
  if (error) return null
  return parsePollResults(data)
}
