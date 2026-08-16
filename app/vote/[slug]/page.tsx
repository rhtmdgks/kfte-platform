import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPollBySlug, getPollResults } from "@/lib/polls/queries"
import { parsePollQuestions } from "@/lib/polls/types"
import { VotePage } from "@/components/vote/vote-page"

type PageProps = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export default async function VoteSlugPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  let poll
  try {
    poll = await getPollBySlug(supabase, slug)
  } catch {
    notFound()
  }

  if (!poll) notFound()

  const questions = parsePollQuestions(poll.questions)

  let initialResults = null
  try {
    initialResults = await getPollResults(supabase, poll.id)
  } catch {
    // non-fatal — UI will poll
  }

  return (
    <VotePage
      pollId={poll.id}
      title={poll.title}
      description={poll.description}
      status={poll.status as "open" | "closed"}
      questions={questions}
      initialResults={initialResults}
    />
  )
}
