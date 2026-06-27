"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionEnter } from "@/components/motion"
import { createClient } from "@/lib/supabase/client"
import { authPortals, type AuthPortal, buildInternalEmail, INTERNAL_EMAIL_DOMAIN } from "@/lib/auth-portals"

function sanitizeEmailLocal(value: string) {
  return value.replace(/[@\s]/g, "")
}

type ForgotPasswordContentProps = {
  portal: AuthPortal
}

export function ForgotPasswordContent({ portal }: ForgotPasswordContentProps) {
  const config = authPortals[portal]
  const [emailLocal, setEmailLocal] = useState("")
  const isInternal = portal === "internal"
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const callbackUrl = new URL("/auth/callback", window.location.origin)
    callbackUrl.searchParams.set("portal", portal)
    callbackUrl.searchParams.set("type", "recovery")

    const email = isInternal ? buildInternalEmail(emailLocal) : emailLocal

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl.toString(),
    })

    if (resetError) {
      setError("이메일 발송에 실패했습니다. 다시 시도해 주세요.")
    } else {
      setSent(true)
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <MotionEnter className="w-full max-w-md">
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#002065] text-lg font-bold text-primary-foreground">
            K
          </div>
          <CardTitle className="text-2xl font-bold text-[#002065]">비밀번호 재설정</CardTitle>
          <CardDescription>
            {sent
              ? "이메일을 확인해 주세요"
              : `${config.title} — 가입 이메일로 재설정 링크를 보내드립니다`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {isInternal ? buildInternalEmail(emailLocal) : emailLocal}
                </span>
                로 재설정 링크를
                발송했습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                {isInternal ? (
                  <div className="flex items-center rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="email"
                      type="text"
                      value={emailLocal}
                      onChange={(e) => setEmailLocal(sanitizeEmailLocal(e.target.value))}
                      onPaste={(e) => {
                        e.preventDefault()
                        setEmailLocal(sanitizeEmailLocal(e.clipboardData.getData("text")))
                      }}
                      required
                      disabled={isLoading}
                      placeholder="이메일"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <span className="shrink-0 pl-2 text-sm text-muted-foreground">
                      @{INTERNAL_EMAIL_DOMAIN}
                    </span>
                  </div>
                ) : (
                  <Input
                    id="email"
                    type="email"
                    value={emailLocal}
                    onChange={(e) => setEmailLocal(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#002065] hover:bg-[#002065]/90"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                재설정 링크 발송
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href={config.loginPath}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#002065]"
            >
              <ArrowLeft className="h-3 w-3" />
              로그인으로 돌아가기
            </Link>
          </div>
        </CardContent>
      </Card>
      </MotionEnter>
    </div>
  )
}
