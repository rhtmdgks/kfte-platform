import { notFound } from "next/navigation"
import { getPollById, getPollResults } from "@/lib/polls/queries"
import { parsePollQuestions } from "@/lib/polls/types"
import { createClient } from "@/lib/supabase/server"
import { PollLiveDashboard } from "@/components/admin/poll-live-dashboard"

type PageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function PollLivePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  let poll
  try {
    poll = await getPollById(supabase, id)
  } catch {
    notFound()
  }

  const questions = parsePollQuestions(poll.questions)

  let initialResults = null
  try {
    initialResults = await getPollResults(supabase, poll.id)
  } catch {
    // non-fatal
  }

  return (
    <PollLiveDashboard
      pollId={poll.id}
      pollSlug={poll.slug}
      pollTitle={poll.title}
      questions={questions}
      initialResults={initialResults}
    />
  )
}
