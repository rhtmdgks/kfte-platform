import { notFound } from "next/navigation"
import { PublicForm } from "@/components/apply/public-form"
import { parseFormSchema, parseFormSettings } from "@/lib/application-forms/parse"
import { getEventPathForForm, getFormBySlug } from "@/lib/application-forms/queries"
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
      <main className={cn(pageMainClassName, "bg-white")}>
        <div className="mx-auto max-w-4xl px-5 py-20 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{form.title}</h1>
          <p className="mt-4 text-base text-slate-500">이 폼은 마감되었습니다.</p>
        </div>
      </main>
    )
  }

  const eventHref = await getEventPathForForm(form.id)

  return (
    <main className={cn(pageMainClassName, "bg-white")}>
      <PublicForm
        formId={form.id}
        title={form.title}
        description={form.description}
        schema={parseFormSchema(form.schema)}
        settings={parseFormSettings(form.settings)}
        initialEditToken={edit}
        eventHref={eventHref}
      />
    </main>
  )
}
