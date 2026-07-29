import type { Metadata } from "next"
import { BonlipLanding } from "@/components/bonlipdosaeng/landing"

export const metadata: Metadata = {
  title: "본립도생 — BIZCOOL 2026",
  description:
    "바로 지금, 근본을 세울 차례. 비즈쿨 창업톤 & 컨퍼런스. 本立道生 — 근본이 서면 길이 생긴다.",
  openGraph: {
    title: "본립도생 — BIZCOOL 2026",
    description:
      "바로 지금, 근본을 세울 차례. 비즈쿨 창업톤(8.16) & 컨퍼런스(8.17) · 대전컨벤션센터",
  },
}

export default function BonlipdosaengPage() {
  return <BonlipLanding />
}
