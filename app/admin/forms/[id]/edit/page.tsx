import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
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
        <Link
          href="/admin/forms"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          신청 폼
        </Link>
        <h1 className="truncate text-lg font-semibold text-[#002065]">
          폼 편집 · {form.title}
        </h1>
      </header>
      <main className="flex-1 px-3 py-5 md:px-6 md:py-6">
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
