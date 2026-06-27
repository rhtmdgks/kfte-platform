import logoBlue from "@/assets/logo/kfte_logo(blue).svg"
import logoWhite from "@/assets/logo/kfte_logo(white).svg"
import logoBlue1 from "@/assets/ci/1.0/kfte_1_ci(blue).svg"
import logoWhite1 from "@/assets/ci/1.0/kfte_1_ci(white).svg"
import type { StaticImageData } from "next/image"

export type CiTabId = "2.0" | "1.0"

export type CiColorSwatch = {
  hex: string
  cmyk?: string
}

export type CiArchive = {
  downloadLabel: string
  downloadHref: string
  downloadFilename: string
  previewBlue: StaticImageData
  previewWhite: StaticImageData
  previewAlt: string
  colors: readonly CiColorSwatch[]
  description: {
    lead: string
    note: string
  }
}

export const ciPage = {
  pageTitle: "CI",
  defaultTabId: "2.0" as CiTabId,
  tabs: [
    { id: "2.0" as const, label: "KFTE 2.0 CI archive" },
    { id: "1.0" as const, label: "KFTE 1.0 CI archive" },
  ],
  archives: {
    "2.0": {
      downloadLabel: "KFTE 2.0 CI Download",
      downloadHref: "/ci/2.0/kfte-2.0-ci.zip",
      downloadFilename: "kfte-2.0-ci.zip",
      previewBlue: logoBlue,
      previewWhite: logoWhite,
      previewAlt: "KFTE 2.0 CI",
      colors: [
        { hex: "#231F20" },
        { hex: "#818381" },
        { hex: "#E1E6E1" },
        { hex: "#002065", cmyk: "C100 M85 Y0 K60" },
        { hex: "#3366FF", cmyk: "C79 M51 Y0 K0" },
        { hex: "#F5F7FA" },
      ],
      description: {
        lead:
          "한국기술창업진흥재단(KFTE)의 CI는 기술과 창업을 잇는 '성장의 다리'를 형상화한 것으로, 창업가와 기술인이 마음껏 역량을 펼칠 수 있도록 자유롭고 공정한 창업 생태계를 만들어가겠다는 의미를 담았습니다.",
        note: "2025년 KFTE 2.0을 선언하며 새롭게 제작되었습니다.",
      },
    },
    "1.0": {
      downloadLabel: "KFTE 1.0 CI Download",
      downloadHref: "/ci/1.0/kfte-1.0-ci.zip",
      downloadFilename: "kfte-1.0-ci.zip",
      previewBlue: logoBlue1,
      previewWhite: logoWhite1,
      previewAlt: "KFTE 1.0 CI",
      colors: [
        { hex: "#231F20" },
        { hex: "#818381" },
        { hex: "#E1E6E1" },
        { hex: "#002065", cmyk: "C100 M85 Y0 K60" },
        { hex: "#4A6FA5", cmyk: "C78 M52 Y0 K35" },
        { hex: "#F5F7FA" },
      ],
      description: {
        lead:
          "KFTE 1.0 CI는 재단 설립 초기부터 사용된 브랜드 자산으로, 기술 창업의 전문성과 신뢰를 상징하는 심플한 워드마크 형태로 구성되어 있습니다.",
        note: "2025년 KFTE 2.0 CI 전환 이전까지 공식 브랜드로 활용되었습니다.",
      },
    },
  } satisfies Record<CiTabId, CiArchive>,
} as const
