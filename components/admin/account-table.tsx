"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { MoreHorizontal } from "lucide-react"
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
import type { Tables } from "@/types/database"

type Profile = Tables<"profiles">

type AccountTableProps = {
  profiles: Profile[]
  currentUserId: string
  showRoleToggle?: boolean
  onRoleChange?: (id: string, newRole: "admin" | "user") => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function AccountTable({
  profiles,
  currentUserId,
  showRoleToggle = true,
  onRoleChange,
  onDelete,
}: AccountTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleRoleChange = (profile: Profile) => {
    if (!onRoleChange) return
    const newRole = profile.role === "admin" ? "user" : "admin"
    startTransition(async () => {
      await onRoleChange(profile.id, newRole)
      toast.success(
        `${profile.display_name ?? profile.email}님의 역할을 ${newRole === "admin" ? "관리자" : "일반 사용자"}로 변경했습니다.`,
      )
    })
  }

  const handleDelete = (id: string) => {
    if (!onDelete) return
    startTransition(async () => {
      await onDelete(id)
      setDeleteTargetId(null)
      toast.success("계정이 삭제되었습니다.")
    })
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>가입일</TableHead>
            {(onRoleChange ?? onDelete) && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={(onRoleChange ?? onDelete) ? 5 : 4} className="py-10 text-center text-muted-foreground">
                계정이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  {profile.display_name ?? "—"}
                </TableCell>
                <TableCell>{profile.email ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      profile.role === "admin"
                        ? "default"
                        : profile.role === "partner"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {profile.role === "admin"
                      ? "관리자"
                      : profile.role === "partner"
                        ? "파트너"
                        : "일반 사용자"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(profile.created_at)}
                </TableCell>
                {(onRoleChange ?? onDelete) && (
                  <TableCell>
                    {profile.id !== currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {showRoleToggle && onRoleChange && (
                            <DropdownMenuItem onClick={() => handleRoleChange(profile)}>
                              {profile.role === "admin"
                                ? "일반 사용자로 변경"
                                : "관리자로 승격"}
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => setDeleteTargetId(profile.id)}
                              className="text-red-600"
                            >
                              계정 삭제
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
        title="계정을 삭제하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다. Supabase Auth에서 해당 사용자 계정이 삭제됩니다."
      />
    </>
  )
}
