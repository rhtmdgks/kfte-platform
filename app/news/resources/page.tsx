import type { Metadata } from "next"
import { EmptyPage } from "@/components/empty-page"

export const metadata: Metadata = {
  title: "자료실 | 한국기술창업진흥재단(KFTE)",
}

export default function Page() {
  return <EmptyPage label="자료실" />
}
