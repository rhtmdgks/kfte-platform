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
      <header className="flex h-14 items-center gap-3 px-3 md:px-4">
        <AdminSidebarTrigger />
        <div className="min-w-0">
          <Link
            href="/admin/forms"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[#002065]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            신청 폼
          </Link>
          <h1 className="truncate text-xl font-semibold text-[#002065]">
            {form.title}
          </h1>
        </div>
      </header>
      <main className="flex-1 px-3 py-5 md:px-5 md:py-6">
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
