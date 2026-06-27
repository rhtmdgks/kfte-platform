"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseContentPostMetadata } from "@/lib/content-post-metadata"
import type { Tables, Database } from "@/types/database"

type ContentPost = Tables<"content_posts">
type ContentType = Database["public"]["Enums"]["content_type"]

type ContentPostFormProps = {
  post?: ContentPost
  contentType: ContentType
  action: (formData: FormData) => Promise<void>
  showExternalUrl?: boolean
  showAttachmentFields?: boolean
  authorFieldLabel?: string
  defaultAuthor?: string
  categoryOptions?: readonly string[]
  defaultCategory?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-[#002065] hover:bg-[#002065]/90">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      저장
    </Button>
  )
}

export function ContentPostForm({
  post,
  contentType,
  action,
  showExternalUrl = false,
  showAttachmentFields = false,
  authorFieldLabel = "작성자",
  defaultAuthor = "KFTE",
  categoryOptions = [],
  defaultCategory,
}: ContentPostFormProps) {
  const metadata = parseContentPostMetadata(post?.metadata ?? null)
  const [, formAction] = useActionState(async (_: void | null, formData: FormData) => {
    await action(formData)
    return null
  }, null)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="content_type" value={contentType} />

      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={post?.title}
          placeholder="제목을 입력하세요"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metadata_author">{authorFieldLabel}</Label>
          <Input
            id="metadata_author"
            name="metadata_author"
            defaultValue={metadata.author ?? defaultAuthor}
            placeholder={authorFieldLabel}
          />
        </div>

        {categoryOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="metadata_category">카테고리</Label>
            <Select
              name="metadata_category"
              defaultValue={metadata.category ?? defaultCategory ?? categoryOptions[0]}
            >
              <SelectTrigger id="metadata_category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">요약</Label>
        <Input
          id="summary"
          name="summary"
          defaultValue={post?.summary ?? ""}
          placeholder="목록에 표시될 짧은 요약"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">본문</Label>
        <Textarea
          id="body"
          name="body"
          defaultValue={post?.body ?? ""}
          placeholder="본문을 입력하세요"
          className="min-h-[400px] font-mono text-sm"
        />
      </div>

      {showExternalUrl && (
        <div className="space-y-2">
          <Label htmlFor="external_url">외부 링크 (원문 URL)</Label>
          <Input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={post?.external_url ?? ""}
            placeholder="https://example.com/article"
          />
        </div>
      )}

      {showAttachmentFields && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metadata_attachment_name">첨부파일 이름</Label>
            <Input
              id="metadata_attachment_name"
              name="metadata_attachment_name"
              defaultValue={metadata.attachmentName ?? ""}
              placeholder="예: 안내.pdf"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metadata_attachment_url">첨부파일 URL</Label>
            <Input
              id="metadata_attachment_url"
              name="metadata_attachment_url"
              type="url"
              defaultValue={metadata.attachmentUrl ?? ""}
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">게시 상태</Label>
        <Select name="status" defaultValue={post?.status ?? "draft"}>
          <SelectTrigger id="status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">초안</SelectItem>
            <SelectItem value="published">공개</SelectItem>
            <SelectItem value="archived">보관</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <SubmitButton />
      </div>
    </form>
  )
}
