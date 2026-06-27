import type { EventPost } from "@/lib/event-types"

export type EventArchivePost = EventPost

export type EventArchivePageConfig = {
  pageTitle: string
  pageHeading: string
  description: string
  basePath: string
  eventsPath: string
  categories: readonly string[]
  posts: readonly EventArchivePost[]
}

export function getEventYear(eventDate: string) {
  return new Date(eventDate).getFullYear()
}

export function formatArchiveMonthDay(dateString: string) {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${month}.${day}`
}

export function groupArchivesByYear(posts: readonly EventArchivePost[]) {
  const map = new Map<number, EventArchivePost[]>()

  for (const post of posts) {
    const year = getEventYear(post.eventDate)
    const group = map.get(year) ?? []
    group.push(post)
    map.set(year, group)
  }

  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, items }))
}
