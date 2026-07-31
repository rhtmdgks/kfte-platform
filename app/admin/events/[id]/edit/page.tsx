import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ClipboardList, ExternalLink } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { EventPostForm } from "@/components/admin/event-post-form"
import { Button } from "@/components/ui/button"
import { listForms } from "@/lib/application-forms/queries"
import { parseEventPostMetadata } from "@/lib/event-metadata"
import { createClient } from "@/lib/supabase/server"
import { updatePost } from "@/app/admin/content/actions"

type PageProps = { params: Promise<{ id: string }> }

const statusLabel = {
  draft: "초안",
  published: "공개",
  archived: "보관",
} as const

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: post }, forms] = await Promise.all([
    supabase
      .from("content_posts")
      .select("*")
      .eq("id", id)
      .eq("content_type", "event")
      .single(),
    listForms().catch(() => []),
  ])

  if (!post) notFound()

  const formId = parseEventPostMetadata(post.metadata).applicationFormId
  const publicPath = `/activities/events/${post.slug}`

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 border-b px-3 md:gap-4 md:px-6">
        <AdminSidebarTrigger />
        <Link
          href="/admin/events"
          className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          행사
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-[#002065]">
            행사 수정 · {post.title}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {statusLabel[post.status]} · /{post.slug}
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {formId ? (
            <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
              <Link href={`/admin/forms/${formId}/responses`}>
                <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
                모집 현황
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
            <Link href={publicPath} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              미리보기
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-6 md:py-6">
        <EventPostForm
          post={post}
          contentType="event"
          action={updatePost.bind(null, id)}
          applicationForms={forms.map((form) => ({
            id: form.id,
            title: form.title,
            slug: form.slug,
            status: form.status,
          }))}
        />
      </main>
    </div>
  )
}
