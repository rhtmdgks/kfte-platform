import type { NewsListConfig } from "@/lib/news-types"

export const pressPageConfig: Omit<NewsListConfig, "posts"> = {
  pageTitle: "언론보도",
  pageHeading: "보도자료",
  basePath: "/news/press",
  authorColumnLabel: "매체",
  authorColumnWidth: "160px",
  categories: ["전체", "보도자료", "인터뷰", "협약"],
}

export const pressCategoryOptions = pressPageConfig.categories.filter(
  (category) => category !== "전체",
)
