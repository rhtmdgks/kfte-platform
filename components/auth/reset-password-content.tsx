"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { authPortals, type AuthPortal } from "@/lib/auth-portals"

type ResetPasswordContentProps = {
  portal: AuthPortal
}

export function ResetPasswordContent({ portal }: ResetPasswordContentProps) {
  const config = authPortals[portal]
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError("비밀번호 변경에 실패했습니다. 재설정 링크가 만료되었을 수 있습니다.")
      setIsLoading(false)
      return
    }

    router.push(config.redirectPath)
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#002065] text-lg font-bold text-white">
            K
          </div>
          <CardTitle className="text-2xl font-bold text-[#002065]">새 비밀번호 설정</CardTitle>
          <CardDescription>{config.title}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">새 비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#002065] hover:bg-[#002065]/90"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              비밀번호 변경
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
