import type { Database } from "@/types/database"

export type ViewTrendPoint = {
  day: string
  views: number
  label: string
}

type NewsContentType = Extract<
  Database["public"]["Enums"]["content_type"],
  "notice" | "press"
>

function formatDayLabel(day: string) {
  const date = new Date(`${day}T00:00:00`)
  return date.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })
}

export function fillViewTrendSeries(
  rows: { day: string; views: number }[],
  days: number,
): ViewTrendPoint[] {
  const map = new Map(rows.map((row) => [row.day, row.views]))
  const series: ViewTrendPoint[] = []
  const today = new Date()

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const key = date.toISOString().slice(0, 10)
    series.push({
      day: key,
      views: map.get(key) ?? 0,
      label: formatDayLabel(key),
    })
  }

  return series
}

export async function getContentViewTrends(
  contentType: NewsContentType,
  days = 30,
): Promise<ViewTrendPoint[]> {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_content_view_trends", {
    p_content_type: contentType,
    p_days: days,
  })

  if (error) {
    console.error("Failed to fetch view trends:", error.message)
    return fillViewTrendSeries([], days)
  }

  return fillViewTrendSeries(
    (data ?? []).map((row) => ({ day: row.day, views: Number(row.views) })),
    days,
  )
}

export function sumViewTrend(points: ViewTrendPoint[]) {
  return points.reduce((total, point) => total + point.views, 0)
}
