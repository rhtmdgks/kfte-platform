import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ContentPostForm } from "@/components/admin/content-post-form"
import { createPost } from "@/app/admin/content/actions"

export default function NewResourcePage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <Link href="/admin/resources" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />자료실 목록
        </Link>
        <h1 className="text-lg font-semibold text-[#002065]">새 자료</h1>
      </header>
      <main className="flex-1 p-6">
        <ContentPostForm contentType="resource" action={createPost} />
      </main>
    </div>
  )
}
