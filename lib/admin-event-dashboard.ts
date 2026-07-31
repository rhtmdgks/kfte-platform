import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import {
  getContentViewTrends,
  sumViewTrend,
  type ViewTrendPoint,
} from "@/lib/content-view-analytics"
import {
  getEventRegistrationStatus,
  type EventRegistrationStatus,
} from "@/lib/event-types"
import { mapContentPostToEventPost } from "@/lib/content-posts"
import { parseEventPostMetadata } from "@/lib/event-metadata"

export type EventApplicationStatusRow = {
  eventId: string
  eventTitle: string
  formId: string
  formTitle: string
  formStatus: string
  responseCount: number
  registrationStatus: EventRegistrationStatus
}

export type RecentApplicationRow = {
  id: string
  formId: string
  formTitle: string
  eventId?: string
  eventTitle?: string
  email: string | null
  submittedAt: string
}

export type UpcomingOpenEvent = {
  eventId: string
  title: string
  eventDate: string
  location: string
  formId?: string
  responseCount: number
}

export type EventAdminDashboardData = {
  total: number
  published: number
  open: number
  soon: number
  closed: number
  drafts: number
  archive: number
  linkedForms: number
  unlinkedEvents: number
  applicationsTotal: number
  applicationsThisWeek: number
  applications: EventApplicationStatusRow[]
  recentResponses: RecentApplicationRow[]
  upcomingOpen: UpcomingOpenEvent[]
  eventViews: ViewTrendPoint[]
  eventViewsTotal: number
}

export async function getEventAdminDashboardData(): Promise<EventAdminDashboardData> {
  const empty: EventAdminDashboardData = {
    total: 0,
    published: 0,
    open: 0,
    soon: 0,
    closed: 0,
    drafts: 0,
    archive: 0,
    linkedForms: 0,
    unlinkedEvents: 0,
    applicationsTotal: 0,
    applicationsThisWeek: 0,
    applications: [],
    recentResponses: [],
    upcomingOpen: [],
    eventViews: [],
    eventViewsTotal: 0,
  }

  if (!isSupabaseConfigured()) return empty

  const supabase = await createClient()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [allEventsRes, publishedCountRes, publishedEventsRes, archiveRes, draftsRes, eventViews, eventRowsRes] =
    await Promise.all([
      supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("content_type", "event"),
      supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("content_type", "event")
        .eq("status", "published"),
      supabase
        .from("content_posts")
        .select("*")
        .eq("content_type", "event")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(40),
      supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("content_type", "event_archive")
        .eq("status", "published"),
      supabase
        .from("content_posts")
        .select("*", { count: "exact", head: true })
        .eq("content_type", "event")
        .eq("status", "draft"),
      getContentViewTrends("event", 30),
      supabase
        .from("content_posts")
        .select("*")
        .eq("content_type", "event")
        .order("updated_at", { ascending: false }),
    ])

  const statusCounts: Record<EventRegistrationStatus, number> = {
    open: 0,
    soon: 0,
    closed: 0,
  }
  for (const row of publishedEventsRes.data ?? []) {
    statusCounts[getEventRegistrationStatus(mapContentPostToEventPost(row))] += 1
  }

  const eventRows = eventRowsRes.data ?? []
  const linked = eventRows
    .map((row) => {
      const formId = parseEventPostMetadata(row.metadata).applicationFormId
      if (!formId) return null
      const event = mapContentPostToEventPost(row)
      return {
        eventId: row.id,
        eventTitle: row.title,
        formId,
        registrationStatus: getEventRegistrationStatus(event),
        eventDate: event.eventDate,
        location: event.location,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row != null)

  const formIds = [...new Set(linked.map((row) => row.formId))]
  const formToEvent = new Map(linked.map((row) => [row.formId, row]))

  const [formsRes, recentRes, weekCountRes, ...countEntries] = await Promise.all([
    formIds.length > 0
      ? supabase.from("application_forms").select("id, title, status").in("id", formIds)
      : Promise.resolve({ data: [] as { id: string; title: string; status: string }[] }),
    formIds.length > 0
      ? supabase
          .from("application_form_responses")
          .select("id, form_id, respondent_email, submitted_at")
          .in("form_id", formIds)
          .order("submitted_at", { ascending: false })
          .limit(8)
      : Promise.resolve({
          data: [] as {
            id: string
            form_id: string
            respondent_email: string | null
            submitted_at: string
          }[],
        }),
    formIds.length > 0
      ? supabase
          .from("application_form_responses")
          .select("*", { count: "exact", head: true })
          .in("form_id", formIds)
          .gte("submitted_at", weekAgo)
      : Promise.resolve({ count: 0 }),
    ...formIds.map(async (formId) => {
      const { count } = await supabase
        .from("application_form_responses")
        .select("*", { count: "exact", head: true })
        .eq("form_id", formId)
      return [formId, count ?? 0] as const
    }),
  ])

  const formMap = new Map((formsRes.data ?? []).map((form) => [form.id, form]))
  const countMap = Object.fromEntries(countEntries as [string, number][])

  const applications: EventApplicationStatusRow[] = linked
    .map((row) => {
      const form = formMap.get(row.formId)
      if (!form) return null
      return {
        eventId: row.eventId,
        eventTitle: row.eventTitle,
        formId: row.formId,
        formTitle: form.title,
        formStatus: form.status,
        responseCount: countMap[row.formId] ?? 0,
        registrationStatus: row.registrationStatus,
      }
    })
    .filter((row): row is EventApplicationStatusRow => row != null)
    .sort((a, b) => b.responseCount - a.responseCount)
    .slice(0, 8)

  const recentResponses: RecentApplicationRow[] = (recentRes.data ?? []).map((row) => {
    const form = formMap.get(row.form_id)
    const event = formToEvent.get(row.form_id)
    return {
      id: row.id,
      formId: row.form_id,
      formTitle: form?.title ?? "신청 폼",
      eventId: event?.eventId,
      eventTitle: event?.eventTitle,
      email: row.respondent_email,
      submittedAt: row.submitted_at,
    }
  })

  const upcomingOpen = (publishedEventsRes.data ?? [])
    .flatMap((row): UpcomingOpenEvent[] => {
      const event = mapContentPostToEventPost(row)
      const status = getEventRegistrationStatus(event)
      if (status !== "open" && status !== "soon") return []
      const formId = parseEventPostMetadata(row.metadata).applicationFormId
      return [
        {
          eventId: row.id,
          title: row.title,
          eventDate: event.eventDate,
          location: event.location,
          formId,
          responseCount: formId ? (countMap[formId] ?? 0) : 0,
        },
      ]
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5)

  return {
    total: allEventsRes.count ?? 0,
    published: publishedCountRes.count ?? 0,
    open: statusCounts.open,
    soon: statusCounts.soon,
    closed: statusCounts.closed,
    drafts: draftsRes.count ?? 0,
    archive: archiveRes.count ?? 0,
    linkedForms: formIds.length,
    unlinkedEvents: Math.max(eventRows.length - linked.length, 0),
    applicationsTotal: Object.values(countMap).reduce((sum, n) => sum + n, 0),
    applicationsThisWeek: weekCountRes.count ?? 0,
    applications,
    recentResponses,
    upcomingOpen,
    eventViews,
    eventViewsTotal: sumViewTrend(eventViews),
  }
}
