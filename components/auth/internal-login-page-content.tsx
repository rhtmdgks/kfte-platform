"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KfteLogo } from "@/components/kfte-logo"
import { MotionEnter } from "@/components/motion"
import { createClient } from "@/lib/supabase/client"
import {
  authPortals,
  isRoleAllowedForPortal,
  buildInternalEmail,
  INTERNAL_EMAIL_DOMAIN,
} from "@/lib/auth-portals"

function sanitizeEmailLocal(value: string) {
  return value.replace(/[@\s]/g, "")
}

export function InternalLoginPageContent() {
  const config = authPortals.internal
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryError = searchParams.get("error")

  const [emailLocal, setEmailLocal] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

    if (!profile || !isRoleAllowedForPortal(profile.role, "internal")) {
      await supabase.auth.signOut()
      setFormError(config.wrongPortalMessage)
      return false
    }

    router.push(config.redirectPath)
    router.refresh()
    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)

    const email = buildInternalEmail(emailLocal)

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

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-surface p-6">
      <MotionEnter className="w-full max-w-lg rounded-2xl border border-border/60 bg-surface p-8 md:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="shrink-0 overflow-hidden rounded-2xl">
            <KfteLogo variant="symbol" className="h-12 w-12 md:h-14 md:w-14" priority />
          </div>
          <span className="text-xl font-semibold leading-tight text-black md:text-2xl">
            한국기술창업진흥재단
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">로그인</h1>
        <p className="mt-2 text-base text-muted-foreground">KFTE 운영 시스템</p>

        {(queryError ?? formError) && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {queryError ? (errorMessages[queryError] ?? "오류가 발생했습니다.") : formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="flex items-center rounded-xl border border-border bg-surface px-4 py-3 focus-within:border-foreground/30">
            <input
              id="email-local"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="이메일"
              value={emailLocal}
              onChange={(e) => setEmailLocal(sanitizeEmailLocal(e.target.value))}
              onPaste={(e) => {
                e.preventDefault()
                const text = e.clipboardData.getData("text")
                setEmailLocal(sanitizeEmailLocal(text))
              }}
              required
              disabled={isLoading}
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/50"
            />
            <span className="shrink-0 pl-2 text-base text-muted-foreground/50">
              @{INTERNAL_EMAIL_DOMAIN}
            </span>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 rounded-xl border-border px-4 text-base placeholder:text-muted-foreground/50"
          />

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground/70">
              계정이 없으시다면 운영팀에 문의하세요.
            </p>
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading}
              className="h-11 shrink-0 rounded-xl border-black bg-surface px-8 text-base text-black hover:border-[#002065] hover:bg-[#002065] hover:text-primary-foreground"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "로그인"}
            </Button>
          </div>
        </form>

        <div className="mt-10 border-t border-border/60 pt-6">
          <Link
            href={authPortals.partner.loginPath}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            파트너 포털 바로가기 →
          </Link>
        </div>
      </MotionEnter>
    </div>
  )
}
