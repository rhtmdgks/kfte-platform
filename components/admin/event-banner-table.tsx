"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react"
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
import type { EventBanner } from "@/lib/event-banners"
import { cn } from "@/lib/utils"

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
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Banners
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">배너 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            3초 자동 전환 · 호버 시 좌우 이동 · 숫자가 작을수록 먼저 표시
          </p>
        </div>
        <Button
          asChild
          className="h-11 shrink-0 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
        >
          <Link href="/admin/event-banners/new">
            <Plus className="mr-2 h-4 w-4" />
            배너 추가
          </Link>
        </Button>
      </div>

      <div className="glass-pane overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[112px]">미리보기</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-20 text-center">순서</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-[1%] whitespace-nowrap text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                      <ImageIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">등록된 배너가 없습니다</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        배너를 추가하면 행사 목록 상단 캐러셀에 노출됩니다.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="h-11 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
                    >
                      <Link href="/admin/event-banners/new">
                        <Plus className="mr-2 h-4 w-4" />
                        배너 추가
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id} className="group">
                  <TableCell>
                    <div className="relative aspect-[4/3] w-20 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
                      {banner.imageUrl ? (
                        <Image
                          src={banner.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ImageIcon className="h-5 w-5" aria-hidden />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/event-banners/${banner.id}/edit`}
                      className="font-medium text-slate-900 transition-colors hover:text-[#002065]"
                    >
                      {banner.title}
                    </Link>
                    {banner.metaText ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {banner.metaText}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center tabular-nums text-muted-foreground">
                    {banner.sortOrder}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={banner.isActive ? "default" : "secondary"}
                      className={cn(
                        banner.isActive && "bg-[#002065] hover:bg-[#002065]/90",
                      )}
                    >
                      {banner.isActive ? "공개" : "비공개"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 min-w-10 rounded-full px-3"
                      >
                        <Link href={`/admin/event-banners/${banner.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">수정</span>
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 min-w-10 rounded-full px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setDeleteTargetId(banner.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">삭제</span>
                      </Button>
                    </div>
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
    </section>
  )
}
