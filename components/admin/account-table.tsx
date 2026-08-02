"use client"

import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import {
  KeyRound,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database"

type Profile = Tables<"profiles">

type AccountTableProps = {
  profiles: Profile[]
  currentUserId: string
  emptyTitle?: string
  emptyDescription?: string
  showRoleToggle?: boolean
  onRoleChange?: (id: string, newRole: "admin" | "user") => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onUpdateDisplayName: (id: string, displayName: string) => Promise<void>
  onUpdatePassword: (id: string, password: string) => Promise<void>
}

export function AccountTable({
  profiles,
  currentUserId,
  emptyTitle = "계정이 없습니다",
  emptyDescription = "조건에 맞는 계정이 없습니다.",
  showRoleToggle = true,
  onRoleChange,
  onDelete,
  onUpdateDisplayName,
  onUpdatePassword,
}: AccountTableProps) {
  const [query, setQuery] = useState("")
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profiles
    return profiles.filter((profile) => {
      const name = (profile.display_name ?? "").toLowerCase()
      const email = (profile.email ?? "").toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [profiles, query])

  const openEdit = (profile: Profile) => {
    setEditTarget(profile)
    setDisplayName(profile.display_name ?? "")
    setPassword("")
    setConfirmPassword("")
    setFormError(null)
  }

  const closeEdit = () => {
    if (isPending) return
    setEditTarget(null)
    setFormError(null)
  }

  const handleRoleChange = (profile: Profile) => {
    if (!onRoleChange) return
    const newRole = profile.role === "admin" ? "user" : "admin"
    startTransition(async () => {
      try {
        await onRoleChange(profile.id, newRole)
        toast.success(
          `${profile.display_name ?? profile.email}님의 역할을 ${
            newRole === "admin" ? "관리자" : "일반 사용자"
          }로 변경했습니다.`,
        )
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "역할 변경에 실패했습니다.")
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!onDelete) return
    startTransition(async () => {
      try {
        await onDelete(id)
        setDeleteTargetId(null)
        toast.success("계정이 삭제되었습니다.")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "삭제에 실패했습니다.")
      }
    })
  }

  const handleSaveEdit = () => {
    if (!editTarget) return
    const name = displayName.trim()
    if (!name) {
      setFormError("이름을 입력해 주세요.")
      return
    }
    if (password) {
      if (password.length < 8) {
        setFormError("비밀번호는 8자 이상이어야 합니다.")
        return
      }
      if (password !== confirmPassword) {
        setFormError("새 비밀번호가 일치하지 않습니다.")
        return
      }
    }

    const targetId = editTarget.id
    const shouldUpdatePassword = Boolean(password)
    const nameChanged = name !== (editTarget.display_name ?? "").trim()

    if (!nameChanged && !shouldUpdatePassword) {
      setFormError("변경할 내용이 없습니다.")
      return
    }

    setFormError(null)
    startTransition(async () => {
      try {
        if (nameChanged) await onUpdateDisplayName(targetId, name)
        if (shouldUpdatePassword) await onUpdatePassword(targetId, password)
        toast.success(
          shouldUpdatePassword && nameChanged
            ? "이름과 비밀번호를 변경했습니다."
            : shouldUpdatePassword
              ? "비밀번호를 변경했습니다."
              : "이름을 변경했습니다.",
        )
        setEditTarget(null)
        setPassword("")
        setConfirmPassword("")
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "저장에 실패했습니다.")
      }
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
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름 또는 이메일 검색"
          className="h-11 rounded-xl border-slate-200/80 bg-white/80 pl-10 shadow-none"
          aria-label="계정 검색"
        />
      </div>

      <div className="glass-pane overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-28">역할</TableHead>
              <TableHead className="hidden w-32 md:table-cell">가입일</TableHead>
              <TableHead className="w-[1%] whitespace-nowrap text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#002065]/10 text-[#002065]">
                      <Users className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">
                        {profiles.length === 0 ? emptyTitle : "검색 결과가 없습니다"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {profiles.length === 0
                          ? emptyDescription
                          : "다른 이름이나 이메일로 다시 검색해 보세요."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((profile) => {
                const isSelf = profile.id === currentUserId
                return (
                  <TableRow key={profile.id} className="group">
                    <TableCell className="font-medium">
                      <span className="inline-flex flex-wrap items-center gap-2">
                        {profile.display_name ?? "—"}
                        {isSelf ? (
                          <Badge variant="outline" className="font-normal">
                            나
                          </Badge>
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm">
                      {profile.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          profile.role === "admin"
                            ? "default"
                            : profile.role === "partner"
                              ? "outline"
                              : "secondary"
                        }
                        className={cn(
                          profile.role === "admin" && "bg-[#002065] hover:bg-[#002065]/90",
                        )}
                      >
                        {profile.role === "admin"
                          ? "관리자"
                          : profile.role === "partner"
                            ? "파트너"
                            : "일반 사용자"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(profile.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-10 min-w-10 rounded-full px-3"
                          disabled={isPending}
                          onClick={() => openEdit(profile)}
                        >
                          <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">이름·비밀번호</span>
                        </Button>
                        {(showRoleToggle && onRoleChange && !isSelf) ||
                        (onDelete && !isSelf) ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 min-w-10 rounded-full px-3"
                                disabled={isPending}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">추가 메뉴</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {showRoleToggle && onRoleChange && !isSelf ? (
                                <DropdownMenuItem onClick={() => handleRoleChange(profile)}>
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  {profile.role === "admin"
                                    ? "일반 사용자로 변경"
                                    : "관리자로 승격"}
                                </DropdownMenuItem>
                              ) : null}
                              {onDelete && !isSelf ? (
                                <>
                                  {showRoleToggle && onRoleChange ? (
                                    <DropdownMenuSeparator />
                                  ) : null}
                                  <DropdownMenuItem
                                    onClick={() => setDeleteTargetId(profile.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    계정 삭제
                                  </DropdownMenuItem>
                                </>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editTarget != null} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="gap-0 overflow-hidden border-white/60 p-0 sm:max-w-md">
          <div className="h-2 bg-[#002065]" />
          <div className="space-y-4 p-5 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-[#002065]">이름·비밀번호 변경</DialogTitle>
              <DialogDescription>
                {editTarget?.email ?? "계정"} — 비밀번호는 바꿀 때만 입력하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {formError ? (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {formError}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="account-display-name">이름</Label>
                <Input
                  id="account-display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="표시 이름"
                  disabled={isPending}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-new-password">새 비밀번호 (선택)</Label>
                <Input
                  id="account-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="변경하지 않으면 비워 두세요"
                  disabled={isPending}
                  minLength={8}
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">8자 이상</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-confirm-password">새 비밀번호 확인</Label>
                <Input
                  id="account-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending || !password}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full"
                onClick={closeEdit}
                disabled={isPending}
              >
                취소
              </Button>
              <Button
                type="button"
                className="h-11 rounded-full bg-[#002065] hover:bg-[#002065]/90"
                onClick={handleSaveEdit}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                저장
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

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
