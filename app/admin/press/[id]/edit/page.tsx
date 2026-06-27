import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createClient } from "@/lib/supabase/server"
import { updatePost } from "@/app/admin/content/actions"
import { pressCategoryOptions } from "@/lib/press-content"

type PageProps = { params: Promise<{ id: string }> }

export default async function EditPressPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("content_posts")
    .select("*")
    .eq("id", id)
    .eq("content_type", "press")
    .single()

  if (!post) notFound()

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link href="/admin/press" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />언론보도 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">언론보도 수정</h1>
      </header>
      <main className="flex-1 p-6">
        <ContentPostForm
          post={post}
          contentType="press"
          action={updatePost.bind(null, id)}
          authorFieldLabel="매체"
          defaultAuthor=""
          categoryOptions={pressCategoryOptions}
          defaultCategory="보도자료"
          showExternalUrl
        />
      </main>
    </div>
  )
}
