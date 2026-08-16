import { notFound } from "next/navigation"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { PollBuilder } from "@/components/admin/poll-builder"
import { getPollById } from "@/lib/polls/queries"
import { parsePollQuestions } from "@/lib/polls/types"
import { createClient } from "@/lib/supabase/server"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PollEditPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  let poll
  try {
    poll = await getPollById(supabase, id)
  } catch {
    notFound()
  }

  const questions = parsePollQuestions(poll.questions)

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-[#002065] truncate">{poll.title}</h1>
          <p className="truncate text-sm text-muted-foreground">투표 편집</p>
        </div>
      </header>

      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <div className="mx-auto max-w-2xl">
          <PollBuilder
            id={poll.id}
            initialTitle={poll.title}
            initialSlug={poll.slug}
            initialDescription={poll.description ?? ""}
            initialStatus={poll.status as "draft" | "open" | "closed"}
            initialQuestions={questions}
          />
        </div>
      </main>
    </div>
  )
}
