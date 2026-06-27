import { createClient } from "@/lib/supabase/server"
import { isEventEligibleForArchive, type EventArchiveSource } from "@/lib/event-archive-merge"
import { parseEventPostMetadata } from "@/lib/event-metadata"
import { mapContentPostToEventPost } from "@/lib/content-posts"
import type { Database } from "@/types/database"

type PostStatus = Database["public"]["Enums"]["post_status"]

export type AdminEventArchiveRow = {
  id: string
  title: string
  eventDate: string
  archiveSource: EventArchiveSource
  status: PostStatus
  editPath: string
}

export async function getAdminEventArchiveRows(): Promise<AdminEventArchiveRow[]> {
  const supabase = await createClient()

  const [{ data: manualRows }, { data: eventRows }] = await Promise.all([
    supabase
      .from("content_posts")
      .select("*")
      .eq("content_type", "event_archive")
      .order("created_at", { ascending: false }),
    supabase
      .from("content_posts")
      .select("*")
      .eq("content_type", "event")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
  ])

  const manualPosts = manualRows ?? []
  const publishedEvents = eventRows ?? []
  const manualSlugs = new Set(manualPosts.map((row) => row.slug))

  const manualEntries: AdminEventArchiveRow[] = manualPosts.map((row) => {
    const meta = parseEventPostMetadata(row.metadata)
    const eventDate = meta.eventDate ?? row.published_at ?? row.created_at

    return {
      id: row.id,
      title: row.title,
      eventDate,
      archiveSource: "manual",
      status: row.status,
      editPath: `/admin/event-archives/${row.id}/edit`,
    }
  })

  const autoEntries: AdminEventArchiveRow[] = publishedEvents
    .map((row) => ({ row, event: mapContentPostToEventPost(row) }))
    .filter(({ event }) => isEventEligibleForArchive(event))
    .filter(({ event }) => !manualSlugs.has(event.id))
    .map(({ row, event }) => ({
      id: row.id,
      title: event.title,
      eventDate: event.eventDate,
      archiveSource: "event" as const,
      status: row.status,
      editPath: `/admin/events/${row.id}/edit`,
    }))

  return [...manualEntries, ...autoEntries].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  )
}
