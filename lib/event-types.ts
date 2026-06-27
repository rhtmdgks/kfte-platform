export type EventCategory = string

export type EventRegistrationStatus = "open" | "soon" | "closed"

export type EventPost = {
  id: string
  title: string
  summary: string
  content: string
  category: string
  subcategory?: string
  eventDate: string
  eventEndDate?: string
  location: string
  locationDetail?: string
  cost?: string
  registrationUrl?: string
  registrationStart?: string
  registrationEnd?: string
  thumbnailUrl?: string
  pinned?: boolean
  featured?: boolean
  views: number
}

export type EventsPageConfig = {
  pageTitle: string
  pageHeading: string
  description: string
  basePath: string
  archivePath: string
  categories: readonly EventCategory[]
  posts: readonly EventPost[]
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const

export function formatEventDateTime(dateString: string) {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const weekday = WEEKDAYS[date.getDay()]
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${month}월 ${day}일(${weekday}) ${hours}:${minutes}`
}

export function formatEventDateRange(start: string, end?: string) {
  const startFormatted = formatEventDateTime(start)
  if (!end) return startFormatted

  const endDate = new Date(end)
  const hours = String(endDate.getHours()).padStart(2, "0")
  const minutes = String(endDate.getMinutes()).padStart(2, "0")
  return `${startFormatted} ~ ${hours}:${minutes}`
}

export function formatEventListDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}.${month}.${day}`
}

export function getEventRegistrationStatus(event: EventPost): EventRegistrationStatus {
  const now = Date.now()

  if (event.registrationStart && event.registrationEnd) {
    const start = new Date(event.registrationStart).getTime()
    const end = new Date(event.registrationEnd).getTime()
    if (now < start) return "soon"
    if (now <= end) return "open"
    return "closed"
  }

  const eventTime = new Date(event.eventDate).getTime()
  return now < eventTime ? "open" : "closed"
}

export const registrationStatusLabel: Record<EventRegistrationStatus, string> = {
  open: "모집중",
  soon: "모집 예정",
  closed: "모집 마감",
}
