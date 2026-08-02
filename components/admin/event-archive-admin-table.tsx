"use client"

import Link from "next/link"
import { Archive, CalendarDays, Pencil, Plus } from "lucide-react"
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
import { formatEventListDate } from "@/lib/event-types"
import type { AdminEventArchiveRow } from "@/lib/event-archive-admin"
import { cn } from "@/lib/utils"

type EventArchiveAdminTableProps = {
  rows: AdminEventArchiveRow[]
}

const statusLabels = {
  draft: "초안",
  published: "공개",
  archived: "보관",
} as const

export function EventArchiveAdminTable({ rows }: EventArchiveAdminTableProps) {
  const manualCount = rows.filter((row) => row.archiveSource === "manual").length
  const autoCount = rows.length - manualCount

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Archives
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#002065]">아카이브 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            자동 {autoCount}개 · 수동 {manualCount}개 · 행사 일정 기준 정렬
          </p>
        </div>
        <Button
          asChild
          className="h-11 shrink-0 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
        >
          <Link href="/admin/event-archives/new">
            <Plus className="mr-2 h-4 w-4" />
            수동 아카이브 등록
          </Link>
        </Button>
      </div>

      <div className="glass-pane overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">출처</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-36">행사일</TableHead>
              <TableHead className="w-[1%] whitespace-nowrap text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                      <Archive className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">아카이브 항목이 없습니다</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        모집 마감 행사는 자동 노출됩니다. 별도 기록이 필요하면 수동 등록하세요.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="h-11 rounded-full bg-[#002065] px-5 hover:bg-[#002065]/90"
                    >
                      <Link href="/admin/event-archives/new">
                        <Plus className="mr-2 h-4 w-4" />
                        수동 아카이브 등록
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={`${row.archiveSource}-${row.id}`} className="group">
                  <TableCell>
                    <Link
                      href={row.editPath}
                      className="font-medium text-slate-900 transition-colors hover:text-[#002065]"
                    >
                      <span className="line-clamp-2">{row.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={row.archiveSource === "manual" ? "default" : "secondary"}
                      className={cn(
                        row.archiveSource === "manual" &&
                          "bg-[#002065] hover:bg-[#002065]/90",
                      )}
                    >
                      {row.archiveSource === "manual" ? "수동" : "자동"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={row.status === "published" ? "default" : "outline"}
                      className={cn(
                        row.status === "published" && "bg-[#002065] hover:bg-[#002065]/90",
                      )}
                    >
                      {statusLabels[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {formatEventListDate(row.eventDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 min-w-10 rounded-full px-3"
                      >
                        <Link href={row.editPath}>
                          <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">
                            {row.archiveSource === "manual" ? "수정" : "행사 수정"}
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#002065]/10 bg-[#002065]/[0.03] px-4 py-3 text-sm text-muted-foreground">
        <Archive className="mt-0.5 h-4 w-4 shrink-0 text-[#002065]" aria-hidden />
        <p>
          <span className="font-medium text-foreground">자동</span> 항목은 행사 관리에서 모집
          마감일(또는 행사일)이 지나면 공개 아카이브에 반영됩니다. 별도 기록 페이지가 필요할 때만
          수동 아카이브를 추가하세요.
        </p>
      </div>
    </section>
  )
}
