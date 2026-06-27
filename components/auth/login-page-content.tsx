"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Chrome, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import {
  authPortals,
  isRoleAllowedForPortal,
  type AuthPortal,
} from "@/lib/auth-portals"

type LoginPageContentProps = {
  portal: AuthPortal
}

export function LoginPageContent({ portal }: LoginPageContentProps) {
  const config = authPortals[portal]
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryError = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const supabase = createClient()

  const errorMessages: Record<string, string> = {
    auth_callback_failed: "인증에 실패했습니다. 다시 시도해 주세요.",
    wrong_portal: config.wrongPortalMessage,
    not_authorized: config.wrongPortalMessage,
  }

  const validateRoleAndRedirect = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !isRoleAllowedForPortal(profile.role, portal)) {
      await supabase.auth.signOut()
      setFormError(config.wrongPortalMessage)
      return false
    }

    router.push(config.redirectPath)
    router.refresh()
    return true
  }

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setFormError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setIsLoading(false)
      return
    }

    const ok = await validateRoleAndRedirect()
    if (!ok) setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    const callbackUrl = new URL("/auth/callback", window.location.origin)
    callbackUrl.searchParams.set("portal", portal)
    callbackUrl.searchParams.set("next", config.redirectPath)

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#002065] text-lg font-bold text-white">
            K
          </div>
          <CardTitle className="text-2xl font-bold text-[#002065]">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {(queryError ?? formError) && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {queryError
                ? (errorMessages[queryError] ?? "오류가 발생했습니다.")
                : formError}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-4 w-4" />
            )}
            Google로 로그인
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-white px-2">또는 이메일로 로그인</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#002065] hover:bg-[#002065]/90"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              로그인
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <Link
              href={config.forgotPasswordPath}
              className="hover:text-[#002065] hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          {portal !== "member" && (
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/kfte-os" className="hover:text-[#002065] hover:underline">
                ← KFTE OS로 돌아가기
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
