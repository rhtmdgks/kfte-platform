import { notFound } from "next/navigation"
import { AdminSidebarTrigger } from "@/components/admin/admin-sidebar-trigger"
import { FormBuilder } from "@/components/admin/form-builder"
import { parseFormSchema, parseFormSettings } from "@/lib/application-forms/parse"
import { countResponses, getFormById } from "@/lib/application-forms/queries"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminFormEditPage({ params }: PageProps) {
  const { id } = await params
  const form = await getFormById(id)
  if (!form) notFound()

  const responseCount = await countResponses(form.id)

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <AdminSidebarTrigger />
        <h1 className="text-lg font-semibold text-[#002065]">폼 편집</h1>
      </header>
      <main className="flex-1 p-6">
        <FormBuilder
          form={form}
          initialSchema={parseFormSchema(form.schema)}
          initialSettings={parseFormSettings(form.settings)}
          responseCount={responseCount}
        />
      </main>
    </div>
  )
}
