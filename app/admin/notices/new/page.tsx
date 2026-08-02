import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createPost } from "@/app/admin/content/actions"
import { noticeCategoryOptions } from "@/lib/notices-content"

export default function NewNoticePage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href="/admin/notices"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            공지사항 목록
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">새 공지사항</h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <ContentPostForm
          contentType="notice"
          action={createPost}
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
