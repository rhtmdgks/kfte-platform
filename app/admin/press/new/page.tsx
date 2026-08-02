import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createPost } from "@/app/admin/content/actions"
import { pressCategoryOptions } from "@/lib/press-content"

export default function NewPressPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href="/admin/press"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            언론보도 목록
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">새 언론보도</h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <ContentPostForm
          contentType="press"
          action={createPost}
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
