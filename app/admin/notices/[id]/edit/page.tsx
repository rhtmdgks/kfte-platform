import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createClient } from "@/lib/supabase/server"
import { updatePost } from "@/app/admin/content/actions"
import { noticeCategoryOptions } from "@/lib/notices-content"

type PageProps = { params: Promise<{ id: string }> }

export default async function EditNoticePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("content_posts")
    .select("*")
    .eq("id", id)
    .eq("content_type", "notice")
    .single()

  if (!post) notFound()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link
          href="/admin/notices"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          공지사항 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">공지사항 수정</h1>
      </header>
      <main className="flex-1 p-6">
        <ContentPostForm
          post={post}
          contentType="notice"
          action={updatePost.bind(null, id)}
          authorFieldLabel="작성자"
          defaultAuthor="KFTE"
          categoryOptions={noticeCategoryOptions}
          defaultCategory="아티클"
          showAttachmentFields
        />
      </main>
    </div>
  )
}
