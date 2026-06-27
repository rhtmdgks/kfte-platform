import type { Metadata } from "next"
import { EmptyPage } from "@/components/empty-page"

export const metadata: Metadata = {
  title: "소개 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE)을 소개합니다. 청소년·청년 기술창업 생태계를 연결하고 지원하는 민간 중심 재단입니다.",
}

export default function Page() {
  return <EmptyPage label="소개" />
}
