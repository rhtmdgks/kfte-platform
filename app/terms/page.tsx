import type { Metadata } from "next"
import { pageMainClassName } from "@/lib/page-layout"

export const metadata: Metadata = {
  title: "이용약관",
  description: "한국기술창업진흥재단(KFTE) 이용약관",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <main className={pageMainClassName}>
      <div className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">이용약관</h1>
        <p className="text-base leading-[1.8] text-muted-foreground">
          한국기술창업진흥재단(KFTE) 웹사이트 이용약관입니다. 상세 내용은 추후 공개될
          예정입니다.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          문의: <a href="mailto:yun@seongyong.com" className="text-primary hover:underline">yun@seongyong.com</a>
        </p>
      </div>
    </main>
  )
}
