"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
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
import type { EventBanner } from "@/lib/event-banners"

type EventBannerTableProps = {
  banners: EventBanner[]
  onDelete: (id: string) => Promise<void>
}

export function EventBannerTable({ banners, onDelete }: EventBannerTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!deleteTargetId) return
    startTransition(async () => {
      try {
        await onDelete(deleteTargetId)
        toast.success("배너를 삭제했습니다.")
        setDeleteTargetId(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "삭제에 실패했습니다.")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">총 {banners.length}개</p>
        <Button asChild className="bg-[#002065] hover:bg-[#002065]/90">
          <Link href="/admin/event-banners/new">
            <Plus className="mr-2 h-4 w-4" />
            배너 추가
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[88px]">이미지</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">순서</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  등록된 배너가 없습니다. 배너를 추가해 주세요.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="relative h-12 w-16 overflow-hidden rounded bg-muted">
                      {banner.imageUrl ? (
                        <Image
                          src={banner.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{banner.title}</div>
                    {banner.metaText ? (
                      <div className="mt-0.5 text-xs text-muted-foreground">{banner.metaText}</div>
                    ) : null}
                  </TableCell>
                  <TableCell>{banner.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "공개" : "비공개"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/event-banners/${banner.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteTargetId(banner.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteTargetId != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setDeleteTargetId(null)
        }}
        onConfirm={handleDelete}
        title="배너 삭제"
        description="이 배너를 삭제하면 행사 페이지 캐러셀에서 바로 사라집니다."
      />
    </div>
  )
}
