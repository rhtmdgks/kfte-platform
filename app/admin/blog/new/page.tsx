import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createPost } from "@/app/admin/content/actions"
import { blogCategoryOptions } from "@/lib/blog-content"

export default function NewBlogPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            블로그 목록
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">새 블로그 글</h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
        <ContentPostForm
          contentType="blog"
          action={createPost}
          authorFieldLabel="작성자"
          defaultAuthor="KFTE"
          categoryOptions={blogCategoryOptions}
          defaultCategory="아티클"
          showThumbnailField
        />
      </main>
    </div>
  )
}
