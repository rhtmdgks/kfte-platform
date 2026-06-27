export type BlogCategory = string

export type BlogPost = {
  id: string
  title: string
  summary: string
  content: string
  author: string
  category: string
  createdAt: string
  views: number
  thumbnailUrl?: string
  pinned?: boolean
}

export type BlogListConfig = {
  pageTitle: string
  pageHeading: string
  basePath: string
  categories: readonly string[]
  posts: readonly BlogPost[]
}

const WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const

export function formatBlogListDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const weekday = WEEKDAYS[date.getDay()]
  return `${year}년 ${month}월 ${day}일 ${weekday}`
}

export function formatBlogDetailDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getBlogPostById(posts: readonly BlogPost[], id: string) {
  return posts.find((post) => post.id === id) ?? null
}
