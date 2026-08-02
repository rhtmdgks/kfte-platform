/** Client-safe public URL bases — no server imports. */
export function getPublicPathsForContentType(
  contentType: "notice" | "press" | "blog" | "event" | "event_archive",
) {
  const map = {
    notice: "/news/notices",
    press: "/news/press",
    blog: "/news/blog",
    event: "/activities/events",
    event_archive: "/activities/events/archive",
  } as const

  return map[contentType]
}
