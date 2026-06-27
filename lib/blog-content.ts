import type { BlogListConfig } from "@/lib/blog-types"

export const blogCategoryOptions = ["아티클", "인터뷰", "행사", "에세이"] as const

export const blogPageConfig: Omit<BlogListConfig, "posts"> = {
  pageTitle: "블로그",
  pageHeading: "블로그",
  basePath: "/news/blog",
  categories: ["전체", ...blogCategoryOptions],
}
