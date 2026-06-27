import type { Metadata } from "next"
import { ManifestoPageContent } from "@/components/manifesto-page-content"

export const metadata: Metadata = {
  title: "선언문 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE) 출범 선언문. 기술로 미래를 열고, 창업으로 혁신을 짓겠다는 재단의 설립 취지와 사명을 담았습니다.",
}

export default function ManifestoPage() {
  return <ManifestoPageContent />
}
