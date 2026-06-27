import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createPost } from "@/app/admin/content/actions"
import { blogCategoryOptions } from "@/lib/blog-content"

export default function NewBlogPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link href="/admin/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />블로그 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">새 블로그 글</h1>
      </header>
      <main className="flex-1 p-6">
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
