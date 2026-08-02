"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ClipboardList, FileText, Pencil, Pin, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { sortByPinnedThenDate } from "@/lib/content-post-pin"
import { parseContentPostMetadata } from "@/lib/content-post-metadata"
import { parseEventPostMetadata } from "@/lib/event-metadata"
import {
  getEventRegistrationStatus,
  registrationStatusLabel,
  type EventPost,
} from "@/lib/event-types"
import { cn } from "@/lib/utils"
import type { Tables, Database } from "@/types/database"

type ContentPost = Tables<"content_posts">
type ContentType = Database["public"]["Enums"]["content_type"]
type PostStatus = Database["public"]["Enums"]["post_status"]

const statusLabels: Record<PostStatus, string> = {
  draft: "초안",
  published: "공개",
  archived: "보관",
}

const statusVariants: Record<PostStatus, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
}

const createLabels: Partial<Record<ContentType, string>> = {
  event: "새 행사 등록",
  notice: "새 공지 작성",
  press: "새 보도 작성",
  blog: "새 글 작성",
}

type ContentPostTableProps = {
  posts: ContentPost[]
  adminPath: string
  contentType: ContentType
  onDelete: (id: string, contentType: ContentType) => Promise<void>
  createHref?: string
  hideCreate?: boolean
  sectionTitle?: string
  sectionDescription?: string
}

export function ContentPostTable({
  posts,
  adminPath,
  contentType,
  onDelete,
  createHref,
  hideCreate = false,
  sectionTitle,
  sectionDescription,
}: ContentPostTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sortedPosts = useMemo(() => sortByPinnedThenDate(posts), [posts])
  const showCategory = contentType === "notice" || contentType === "press" || contentType === "blog"
  const colSpan = (contentType === "event" ? 7 : 6) + (showCategory ? 1 : 0)

  const getEventRegistrationStatusLabel = (post: ContentPost) => {
    const meta = parseEventPostMetadata(post.metadata)
    const eventDate = meta.eventDate ?? post.published_at ?? post.created_at
    const status = getEventRegistrationStatus({
      id: post.slug,
      title: post.title,
      summary: post.summary ?? "",
      content: post.body ?? "",
      category: meta.category ?? "프로그램",
      eventDate,
      eventEndDate: meta.eventEndDate,
      location: meta.location ?? "",
      registrationStart: meta.registrationStart,
      registrationEnd: meta.registrationEnd,
      views: 0,
    } satisfies EventPost)

    return registrationStatusLabel[status]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await onDelete(id, contentType)
        setDeleteTargetId(null)
        toast.success("삭제되었습니다.")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "삭제에 실패했습니다.")
      }
    })
  }

  const createButton = !hideCreate ? (
    <Button
      asChild
      className="h-11 shrink-0 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
    >
      <Link href={createHref ?? `${adminPath}/new`}>
        <Plus className="mr-2 h-4 w-4" />
        {createLabels[contentType] ?? "새 글 작성"}
      </Link>
    </Button>
  ) : null

  const table = (
    <div className="glass-pane overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            {showCategory ? <TableHead className="hidden w-28 md:table-cell">카테고리</TableHead> : null}
            {contentType === "event" ? (
              <TableHead className="w-28">모집 상태</TableHead>
            ) : null}
            <TableHead className="w-24">상태</TableHead>
            <TableHead className="w-20 text-right">조회</TableHead>
            <TableHead className="hidden w-32 lg:table-cell">게시일</TableHead>
            <TableHead className="hidden w-32 md:table-cell">수정일</TableHead>
            <TableHead className="w-[1%] whitespace-nowrap text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="py-14 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-medium text-slate-800">게시글이 없습니다</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      새 글을 작성하면 목록에 표시됩니다.
                    </p>
                  </div>
                  {createButton}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedPosts.map((post) => {
              const meta = parseContentPostMetadata(post.metadata)
              const views = meta.views ?? 0
              const eventMeta =
                contentType === "event" ? parseEventPostMetadata(post.metadata) : null
              const registrationLabel =
                contentType === "event" ? getEventRegistrationStatusLabel(post) : null
              const applicationFormId = eventMeta?.applicationFormId

              return (
                <TableRow key={post.id} className="group">
                  <TableCell>
                    <Link
                      href={`${adminPath}/${post.id}/edit`}
                      className="inline-flex items-center gap-2 font-medium text-slate-900 transition-colors hover:text-[#002065]"
                    >
                      {post.is_pinned ? (
                        <Pin
                          className="h-4 w-4 shrink-0 fill-[#002065] text-[#002065]"
                          aria-label="상단 고정"
                        />
                      ) : null}
                      <span className="line-clamp-2">{post.title}</span>
                    </Link>
                  </TableCell>
                  {showCategory ? (
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {meta.category ?? "—"}
                    </TableCell>
                  ) : null}
                  {contentType === "event" ? (
                    <TableCell>
                      <Badge
                        variant={
                          registrationLabel === "모집중"
                            ? "default"
                            : registrationLabel === "모집 예정"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {registrationLabel}
                      </Badge>
                      {registrationLabel === "모집 마감" ? (
                        <p className="mt-1 text-[11px] text-muted-foreground">아카이브 자동 노출</p>
                      ) : null}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <Badge
                      variant={statusVariants[post.status]}
                      className={cn(
                        post.status === "published" && "bg-[#002065] hover:bg-[#002065]/90",
                      )}
                    >
                      {statusLabels[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {views.toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatDate(post.published_at)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(post.updated_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 min-w-10 rounded-full px-3"
                      >
                        <Link href={`${adminPath}/${post.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">수정</span>
                        </Link>
                      </Button>
                      {contentType === "event" && applicationFormId ? (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-10 min-w-10 rounded-full px-3"
                        >
                          <Link href={`/admin/forms/${applicationFormId}/responses`}>
                            <ClipboardList className="h-3.5 w-3.5 sm:mr-1.5" />
                            <span className="hidden sm:inline">현황</span>
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        className="h-10 min-w-10 rounded-full px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setDeleteTargetId(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">삭제</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      {sectionTitle ? (
        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Manage
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">
                {sectionTitle}
              </h2>
              {sectionDescription ? (
                <p className="mt-1 text-sm text-muted-foreground">{sectionDescription}</p>
              ) : null}
            </div>
            {createButton}
          </div>
          {table}
        </section>
      ) : (
        <div className="space-y-4">
          {!hideCreate && posts.length > 0 ? (
            <div className="flex justify-end">{createButton}</div>
          ) : null}
          {table}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
        title="이 게시글을 삭제하시겠습니까?"
        description="삭제된 게시글은 복구할 수 없습니다."
      />
    </>
  )
}
