"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { MoreHorizontal, Pencil, Pin, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

type ContentPostTableProps = {
  posts: ContentPost[]
  adminPath: string
  contentType: ContentType
  onDelete: (id: string, contentType: ContentType) => Promise<void>
}

export function ContentPostTable({
  posts,
  adminPath,
  contentType,
  onDelete,
}: ContentPostTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sortedPosts = useMemo(() => sortByPinnedThenDate(posts), [posts])

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
      await onDelete(id, contentType)
      setDeleteTargetId(null)
      toast.success("삭제되었습니다.")
    })
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild className="bg-[#002065] hover:bg-[#002065]/90">
          <Link href={`${adminPath}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {contentType === "event" ? "새 행사 등록" : "새 글 작성"}
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-20 text-right">조회</TableHead>
              <TableHead className="w-32">게시일</TableHead>
              <TableHead className="w-32">수정일</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              sortedPosts.map((post) => {
                const views = parseContentPostMetadata(post.metadata).views ?? 0

                return (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      {post.is_pinned ? (
                        <Pin
                          className="h-4 w-4 shrink-0 fill-[#002065] text-[#002065]"
                          aria-label="상단 고정"
                        />
                      ) : null}
                      {post.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {views.toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(post.published_at)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(post.updated_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`${adminPath}/${post.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTargetId(post.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

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
