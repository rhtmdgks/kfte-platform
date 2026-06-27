import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginPageContent } from "@/components/auth/login-page-content"

export const metadata: Metadata = {
  title: "로그인 | 한국기술창업진흥재단(KFTE)",
}

export default function MemberLoginPage() {
  return (
    <Suspense>
      <LoginPageContent portal="member" />
    </Suspense>
  )
}
