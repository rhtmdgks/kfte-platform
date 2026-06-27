import type { Metadata } from "next"
import { LocationPageContent } from "@/components/location-page-content"

export const metadata: Metadata = {
  title: "찾아오시는 길 | 한국기술창업진흥재단(KFTE)",
  description:
    "한국기술창업진흥재단(KFTE) 오시는 길. 주소, 연락처, 대중교통 안내.",
}

export default function LocationPage() {
  return <LocationPageContent />
}
