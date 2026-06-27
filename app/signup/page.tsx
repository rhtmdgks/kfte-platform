import type { Metadata } from "next"
import { EmptyPage } from "@/components/empty-page"

export const metadata: Metadata = {
  title: "회원가입",
}

export default function Page() {
  return <EmptyPage label="회원가입" />
}
