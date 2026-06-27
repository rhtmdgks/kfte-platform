export type NewsCategory = string

export type NewsPost = {
  id: string
  title: string
  content: string
  author: string
  category: Exclude<NewsCategory, "전체">
  createdAt: string
  views: number
  attachmentUrl?: string
  attachmentName?: string
  externalUrl?: string
  pinned?: boolean
}

export type NewsListConfig = {
  pageTitle: string
  pageHeading: string
  basePath: string
  authorColumnLabel: string
  /** 첫 번째 열(작성자·매체) 너비. 기본 100px */
  authorColumnWidth?: string
  categories: readonly NewsCategory[]
  posts: readonly NewsPost[]
}

export function formatNewsListDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, "")
}

export function formatNewsDetailDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getNewsPostById(posts: readonly NewsPost[], id: string) {
  return posts.find((post) => post.id === id) ?? null
}
