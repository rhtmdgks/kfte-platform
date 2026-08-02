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
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href={`/admin/forms/${form.id}/edit`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            폼 편집
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">
            모집 현황 · {form.title}
          </h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
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
