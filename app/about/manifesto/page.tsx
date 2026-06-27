import type { Metadata } from "next"
import { ManifestoPageContent } from "@/components/manifesto-page-content"

export const metadata: Metadata = {
  title: "선언문 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE)의 선언문. 청소년·청년 기술창업 생태계를 향한 우리의 약속입니다.",
}

export default function ManifestoPage() {
  return <ManifestoPageContent />
}
