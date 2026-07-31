import { notFound } from "next/navigation"
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
        <h1 className="text-lg font-semibold text-[#002065]">응답 · {form.title}</h1>
        <span className="ml-auto text-sm text-muted-foreground">{responses.length}건</span>
      </header>
      <main className="flex-1 p-6">
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
