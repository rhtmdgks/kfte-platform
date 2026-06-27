import type { NewsListConfig } from "@/lib/news-types"

export const noticesPageConfig: Omit<NewsListConfig, "posts"> = {
  pageTitle: "공지사항",
  pageHeading: "공지사항",
  basePath: "/news/notices",
  authorColumnLabel: "작성자",
  categories: ["전체", "이벤트", "아티클", "채용"],
}

export const noticeCategoryOptions = noticesPageConfig.categories.filter(
  (category) => category !== "전체",
)
