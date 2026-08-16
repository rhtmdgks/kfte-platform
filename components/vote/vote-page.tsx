"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { motion, useReducedMotion } from "motion/react"
import { CheckCircle, Circle, Loader2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitVote, getPollResultsAction } from "@/app/vote/actions"
import type { PollQuestion, PollResults, VoteAnswers } from "@/lib/polls/types"

const VOTER_TOKEN_KEY = "kfte-vote-token"
const POLL_INTERVAL_MS = 3000 // ponytail: 3 s polling — upgrade to Realtime broadcast if concurrent voters > 200

function getOrCreateVoterToken(): string {
  if (typeof window === "undefined") return ""
  let token = localStorage.getItem(VOTER_TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(VOTER_TOKEN_KEY, token)
  }
  return token
}

type VoteState = "form" | "results" | "closed"

type VotePageProps = {
  pollId: string
  title: string
  description: string | null
  status: "open" | "closed"
  questions: PollQuestion[]
  initialResults: PollResults | null
}

export function VotePage({ pollId, title, description, status, questions, initialResults }: VotePageProps) {
  const shouldReduceMotion = useReducedMotion()
  const [voterToken] = useState(getOrCreateVoterToken)
  const [answers, setAnswers] = useState<VoteAnswers>({})
  const [voteState, setVoteState] = useState<VoteState>(status === "closed" ? "closed" : "form")
  const [results, setResults] = useState<PollResults | null>(initialResults)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Poll for results when showing results view
  useEffect(() => {
    if (voteState !== "results" && voteState !== "closed") return
    const refresh = async () => {
      const r = await getPollResultsAction(pollId)
      if (r) setResults(r)
    }
    refresh()
    intervalRef.current = setInterval(refresh, POLL_INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [voteState, pollId])

  function toggleOption(questionId: string, optionId: string, allowMultiple: boolean, maxSelections?: number) {
    setAnswers((prev) => {
      const current = prev[questionId] ?? []
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter((id) => id !== optionId) }
      }
      if (!allowMultiple) {
        return { ...prev, [questionId]: [optionId] }
      }
      if (maxSelections && current.length >= maxSelections) return prev
      return { ...prev, [questionId]: [...current, optionId] }
    })
  }

  function handleSubmit() {
    if (!voterToken) return
    setError(null)
    startTransition(async () => {
      const res = await submitVote(pollId, voterToken, answers)
      if (res.success || res.alreadyVoted) {
        setVoteState("results")
      } else {
        setError(res.error ?? "오류가 발생했습니다.")
      }
    })
  }

  return (
    <div className="min-h-dvh bg-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-primary py-8 px-5 text-white">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60 mb-2">
            KFTE 청중 투표
          </p>
          <h1 className="text-2xl font-bold leading-snug">{title}</h1>
          {description && <p className="mt-2 text-sm text-primary-foreground/70">{description}</p>}
        </div>
      </header>

      <main className="flex-1 px-5 py-8">
        <div className="mx-auto max-w-lg">
          {voteState === "form" && (
            <VoteForm
              questions={questions}
              answers={answers}
              onToggle={toggleOption}
              onSubmit={handleSubmit}
              isPending={isPending}
              error={error}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          )}

          {(voteState === "results" || voteState === "closed") && (
            <ResultsView
              questions={questions}
              results={results}
              voteState={voteState}
              myAnswers={voteState === "results" ? answers : {}}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          )}
        </div>
      </main>
    </div>
  )
}

// ── Vote Form ─────────────────────────────────────────────────────────────────

function VoteForm({
  questions,
  answers,
  onToggle,
  onSubmit,
  isPending,
  error,
  shouldReduceMotion,
}: {
  questions: PollQuestion[]
  answers: VoteAnswers
  onToggle: (qId: string, oId: string, allowMultiple: boolean, maxSelections?: number) => void
  onSubmit: () => void
  isPending: boolean
  error: string | null
  shouldReduceMotion: boolean
}) {
  const allAnswered = questions.every((q) => (answers[q.id]?.length ?? 0) > 0)

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <motion.div
          key={q.id}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qi * 0.08 }}
          className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5"
        >
          <p className="font-semibold text-slate-800 mb-1">{q.title}</p>
          {q.allowMultiple && (
            <p className="text-xs text-slate-400 mb-3">
              {q.maxSelections ? `최대 ${q.maxSelections}개` : "복수 선택 가능"}
            </p>
          )}
          <div className="space-y-2 mt-3">
            {q.options.map((opt) => {
              const selected = (answers[q.id] ?? []).includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onToggle(q.id, opt.id, q.allowMultiple, q.maxSelections)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    "min-h-[44px]",
                    selected
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary/40",
                  )}
                >
                  {selected ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  {opt.label}
                </button>
              )
            })}
          </div>
        </motion.div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isPending || !allAnswered}
        className={cn(
          "w-full min-h-[48px] rounded-2xl font-semibold text-sm transition-colors",
          "bg-primary text-white",
          "disabled:opacity-40",
        )}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "투표하기"}
      </button>
    </div>
  )
}

// ── Results View ──────────────────────────────────────────────────────────────

function ResultsView({
  questions,
  results,
  voteState,
  myAnswers,
  shouldReduceMotion,
}: {
  questions: PollQuestion[]
  results: PollResults | null
  voteState: VoteState
  myAnswers: VoteAnswers
  shouldReduceMotion: boolean
}) {
  return (
    <div className="space-y-6">
      {voteState === "results" && (
        <div className="flex items-center gap-2 rounded-2xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 font-medium">
          <CheckCircle className="h-4 w-4 shrink-0" />
          투표가 완료되었습니다.
        </div>
      )}
      {voteState === "closed" && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-500">
          투표가 마감되었습니다.
        </div>
      )}

      {results && (
        <div className="rounded-2xl bg-white border border-slate-100 px-5 py-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary/60 shrink-0" />
          <span className="text-sm text-slate-600">
            총 <span className="font-bold text-primary">{results.totalVoters}</span>명 참여
          </span>
        </div>
      )}

      {questions.map((q) => {
        const qResult = results?.questions.find((r) => r.questionId === q.id)
        const total = qResult
          ? Object.values(qResult.optionCounts).reduce((a, b) => a + b, 0)
          : 0

        return (
          <div key={q.id} className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
            <p className="font-semibold text-slate-800 mb-4">{q.title}</p>
            <div className="space-y-3">
              {q.options.map((opt) => {
                const count = qResult?.optionCounts[opt.id] ?? 0
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                const isMine = (myAnswers[q.id] ?? []).includes(opt.id)

                return (
                  <div key={opt.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className={cn("font-medium", isMine ? "text-primary" : "text-slate-700")}>
                        {isMine && "✓ "}
                        {opt.label}
                      </span>
                      <span className="text-slate-400 tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", isMine ? "bg-primary" : "bg-primary/30")}
                        initial={shouldReduceMotion ? false : { width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 text-right">{count}표</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
