import { notFound } from "next/navigation"
import { PublicForm } from "@/components/apply/public-form"
import { parseFormSchema, parseFormSettings } from "@/lib/application-forms/parse"
import { getFormBySlug } from "@/lib/application-forms/queries"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function ApplyFormPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { edit } = await searchParams
  const form = await getFormBySlug(slug)

  if (!form || form.status === "draft") notFound()

  if (form.status === "closed") {
    return (
      <main className={cn(pageMainClassName, "bg-[#FBFCFF]")}>
        <div className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="text-2xl font-bold text-[#002065]">{form.title}</h1>
          <p className="mt-4 text-muted-foreground">이 폼은 마감되었습니다.</p>
        </div>
      </main>
    )
  }

  return (
    <main className={cn(pageMainClassName, "bg-[#FBFCFF]")}>
      <PublicForm
        formId={form.id}
        title={form.title}
        description={form.description}
        schema={parseFormSchema(form.schema)}
        settings={parseFormSettings(form.settings)}
        initialEditToken={edit}
      />
    </main>
  )
}
