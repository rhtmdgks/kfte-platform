import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { FormResponsesPanel } from "@/components/admin/form-responses-panel"
import { parseFormSchema } from "@/lib/application-forms/parse"
import { getFormById, listResponses } from "@/lib/application-forms/queries"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminFormResponsesPage({ params }: PageProps) {
  const { id } = await params
  const form = await getFormById(id)
  if (!form) notFound()
  const responses = await listResponses(form.id)

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <Link
          href="/admin/forms"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          신청 폼
        </Link>
        <h1 className="truncate text-lg font-semibold text-[#002065]">
          모집 현황 · {form.title}
        </h1>
      </header>
      <main className="flex-1 px-3 py-5 md:px-6 md:py-6">
        <FormResponsesPanel
          formId={form.id}
          formTitle={form.title}
          schema={parseFormSchema(form.schema)}
          responses={responses}
        />
      </main>
    </div>
  )
}
