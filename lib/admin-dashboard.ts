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
import type { Database } from "@/types/database"

type ApplicationStatus = Database["public"]["Enums"]["application_status"]

export type MembershipPipeline = Record<ApplicationStatus, number>

export type RecentApplication = {
  id: string
  applicantName: string
  companyName: string
  status: ApplicationStatus
  submittedAt: string
}

export type EventPulse = {
  published: number
  open: number
  soon: number
  closed: number
  archive: number
  recent: {
    id: string
    title: string
    status: EventRegistrationStatus
    eventDate: string
    views: number
  }[]
}

export type ContentPulse = {
  noticePublished: number
  noticeDraft: number
  pressPublished: number
  blogPublished: number
  eventPublished: number
  eventArchive: number
}

export type AccountPulse = {
  admin: number
  user: number
  partner: number
}

export type AdminDashboardData = {
  membership: MembershipPipeline
  membershipTotal: number
  recentApplications: RecentApplication[]
  events: EventPulse
  content: ContentPulse
  accounts: AccountPulse
  noticeViews: ViewTrendPoint[]
  noticeViewsTotal: number
  pressViews: ViewTrendPoint[]
  pressViewsTotal: number
  eventViews: ViewTrendPoint[]
  eventViewsTotal: number
}

const emptyPipeline = (): MembershipPipeline => ({
  pending: 0,
  reviewing: 0,
  approved: 0,
  rejected: 0,
})

async function countPosts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  contentType: Database["public"]["Enums"]["content_type"],
  status?: Database["public"]["Enums"]["post_status"],
) {
  let query = supabase
    .from("content_posts")
    .select("*", { count: "exact", head: true })
    .eq("content_type", contentType)

  if (status) {
    query = query.eq("status", status)
  }

  const { count } = await query
  return count ?? 0
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      membership: emptyPipeline(),
      membershipTotal: 0,
      recentApplications: [],
      events: {
        published: 0,
        open: 0,
        soon: 0,
        closed: 0,
        archive: 0,
        recent: [],
      },
      content: {
        noticePublished: 0,
        noticeDraft: 0,
        pressPublished: 0,
        blogPublished: 0,
        eventPublished: 0,
        eventArchive: 0,
      },
      accounts: { admin: 0, user: 0, partner: 0 },
      noticeViews: [],
      noticeViewsTotal: 0,
      pressViews: [],
      pressViewsTotal: 0,
      eventViews: [],
      eventViewsTotal: 0,
    }
  }

  const supabase = await createClient()

  const [
    applicationsRes,
    publishedEventsRes,
    noticePublished,
    noticeDraft,
    pressPublished,
    blogPublished,
    eventPublished,
    eventArchive,
    adminCount,
    userCount,
    partnerCount,
    noticeViews,
    pressViews,
    eventViews,
  ] = await Promise.all([
    supabase
      .from("membership_applications")
      .select("id, applicant_name, company_name, status, submitted_at")
      .order("submitted_at", { ascending: false }),
    supabase
      .from("content_posts")
      .select("*")
      .eq("content_type", "event")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(40),
    countPosts(supabase, "notice", "published"),
    countPosts(supabase, "notice", "draft"),
    countPosts(supabase, "press", "published"),
    countPosts(supabase, "blog", "published"),
    countPosts(supabase, "event", "published"),
    countPosts(supabase, "event_archive", "published"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "partner"),
    getContentViewTrends("notice", 30),
    getContentViewTrends("press", 30),
    getContentViewTrends("event", 30),
  ])

  const membership = emptyPipeline()
  for (const row of applicationsRes.data ?? []) {
    membership[row.status] += 1
  }

  const recentApplications: RecentApplication[] = (applicationsRes.data ?? [])
    .slice(0, 6)
    .map((row) => ({
      id: row.id,
      applicantName: row.applicant_name ?? "—",
      companyName: row.company_name ?? "—",
      status: row.status,
      submittedAt: row.submitted_at,
    }))

  const mappedEvents = (publishedEventsRes.data ?? []).map(mapContentPostToEventPost)
  const statusCounts: Record<EventRegistrationStatus, number> = {
    open: 0,
    soon: 0,
    closed: 0,
  }
  for (const event of mappedEvents) {
    statusCounts[getEventRegistrationStatus(event)] += 1
  }

  return {
    membership,
    membershipTotal: (applicationsRes.data ?? []).length,
    recentApplications,
    events: {
      published: eventPublished,
      open: statusCounts.open,
      soon: statusCounts.soon,
      closed: statusCounts.closed,
      archive: eventArchive,
      recent: mappedEvents.slice(0, 5).map((event) => ({
        id: event.id,
        title: event.title,
        status: getEventRegistrationStatus(event),
        eventDate: event.eventDate,
        views: event.views,
      })),
    },
    content: {
      noticePublished,
      noticeDraft,
      pressPublished,
      blogPublished,
      eventPublished,
      eventArchive,
    },
    accounts: {
      admin: adminCount.count ?? 0,
      user: userCount.count ?? 0,
      partner: partnerCount.count ?? 0,
    },
    noticeViews,
    noticeViewsTotal: sumViewTrend(noticeViews),
    pressViews,
    pressViewsTotal: sumViewTrend(pressViews),
    eventViews,
    eventViewsTotal: sumViewTrend(eventViews),
  }
}
