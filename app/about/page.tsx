import type { Metadata } from "next"
import { AboutPageContent } from "@/components/about-page-content"

export const metadata: Metadata = {
  title: "소개 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE)을 소개합니다. 이사장 인사말, 미션·비전, 재단 정보와 함께 청소년·청년 기술창업 생태계를 연결하는 민간 중심 재단의 이야기를 전합니다.",
}

export default function AboutPage() {
  return <AboutPageContent />
}
