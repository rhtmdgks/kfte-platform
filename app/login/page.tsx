import type { Metadata } from "next"
import { EmptyPage } from "@/components/empty-page"

export const metadata: Metadata = {
  title: "로그인 | 한국기술창업진흥재단(KFTE)",
}

export default function Page() {
  return <EmptyPage label="로그인" />
}
