import type { Metadata } from "next"
import { PeoplePageContent } from "@/components/people-page-content"

export const metadata: Metadata = {
  title: "함께하는 사람들 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE)과 함께 청소년·청년 기술창업 생태계를 만들어가는 사람들을 소개합니다.",
}

export default function PartnersPage() {
  return <PeoplePageContent />
}
