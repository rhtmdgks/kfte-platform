"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { createFormForEvent } from "@/app/admin/forms/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { publicFormPath } from "@/lib/application-forms/types"

export type FormOption = {
  id: string
  title: string
  slug: string
  status: string
}

type EventApplicationFormFieldProps = {
  forms: FormOption[]
  initialFormId?: string
  initialExternalUrl?: string
  eventTitle?: string
}

export function EventApplicationFormField({
  forms: initialForms,
  initialFormId,
  initialExternalUrl,
  eventTitle,
}: EventApplicationFormFieldProps) {
  const [forms, setForms] = useState(initialForms)
  const [mode, setMode] = useState<"internal" | "external">(
    initialFormId ? "internal" : initialExternalUrl ? "external" : "internal",
  )
  const [formId, setFormId] = useState(initialFormId ?? "")
  const [externalUrl, setExternalUrl] = useState(
    initialFormId ? "" : (initialExternalUrl ?? ""),
  )
  const [isPending, startTransition] = useTransition()

  const selected = useMemo(
    () => forms.find((form) => form.id === formId) ?? null,
    [formId, forms],
  )

  const resolvedExternalUrl =
    mode === "internal" && selected ? publicFormPath(selected.slug) : externalUrl

  return (
    <div className="space-y-4 rounded-md border bg-background p-4">
      <input type="hidden" name="metadata_application_form_id" value={mode === "internal" ? formId : ""} />
      <input type="hidden" name="external_url" value={resolvedExternalUrl} />

      <div className="space-y-2">
        <Label>신청 방식</Label>
        <Select
          value={mode}
          onValueChange={(value) => setMode(value as "internal" | "external")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">내부 신청 폼</SelectItem>
            <SelectItem value="external">외부 링크 (Google 폼 등)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === "internal" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>내부 폼 선택</Label>
            <Select value={formId || undefined} onValueChange={setFormId}>
              <SelectTrigger>
                <SelectValue placeholder="폼을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.title} ({form.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  try {
                    const created = await createFormForEvent(
                      eventTitle ? `${eventTitle} 신청` : "행사 신청 폼",
                    )
                    setForms((prev) => [
                      {
                        id: created.id,
                        title: created.title,
                        slug: created.slug,
                        status: "published",
                      },
                      ...prev,
                    ])
                    setFormId(created.id)
                    toast.success("내부 폼을 만들고 연결했습니다. 저장 후 질문을 편집하세요.")
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "폼 생성 실패")
                  }
                })
              }
            >
              {isPending ? "생성 중…" : "새 내부 폼 만들기"}
            </Button>
            {selected ? (
              <Button asChild type="button" variant="secondary" size="sm">
                <Link href={`/admin/forms/${selected.id}/edit`} target="_blank">
                  폼 편집 열기
                </Link>
              </Button>
            ) : null}
          </div>

          {selected ? (
            <p className="font-mono text-xs text-muted-foreground">
              연결 URL: {publicFormPath(selected.slug)}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              폼을 선택하거나 새로 만들면 참가 신청 버튼이 내부 폼으로 연결됩니다.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="external_url_visible">외부 신청 링크</Label>
          <Input
            id="external_url_visible"
            type="text"
            inputMode="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://forms.google.com/..."
          />
        </div>
      )}
    </div>
  )
}
