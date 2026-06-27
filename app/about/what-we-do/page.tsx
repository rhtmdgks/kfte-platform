import type { Metadata } from "next"
import { WhatWeDoPageContent } from "@/components/what-we-do-page-content"

export const metadata: Metadata = {
  title: "우리가 하는 일 | 한국기술창업진흥재단(KFTE)",
  description:
    "KFTE는 청소년·청년의 기술창업을 위해 교육, 멘토링, 커뮤니티, 생태계 협력 프로그램을 운영합니다. 우리가 하는 일을 소개합니다.",
}

export default function WhatWeDoPage() {
  return <WhatWeDoPageContent />
}
