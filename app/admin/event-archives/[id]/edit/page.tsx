import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createClient } from "@/lib/supabase/server"
import { updatePost } from "@/app/admin/content/actions"
import { eventCategoryOptions } from "@/lib/events-content"

type PageProps = { params: Promise<{ id: string }> }

export default async function EditEventArchivePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("content_posts")
    .select("*")
    .eq("id", id)
    .eq("content_type", "event_archive")
    .single()

  if (!post) notFound()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href="/admin/event-archives"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            행사 아카이브 목록
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">{post.title}</h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <ContentPostForm
          post={post}
          contentType="event_archive"
          action={updatePost.bind(null, id)}
          categoryOptions={eventCategoryOptions}
          defaultCategory="프로그램"
          showExternalUrl
        />
      </main>
    </div>
  )
}
