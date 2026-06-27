import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createPost } from "@/app/admin/content/actions"

export default function NewPressPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link href="/admin/press" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />언론보도 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">새 언론보도</h1>
      </header>
      <main className="flex-1 p-6">
        <ContentPostForm contentType="press" action={createPost} showExternalUrl />
      </main>
    </div>
  )
}
