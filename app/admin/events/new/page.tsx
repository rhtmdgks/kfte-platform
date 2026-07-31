import { redirect } from "next/navigation"

/** 행사 등록은 /admin/events#register 로 통합 */
export default function NewEventPage() {
  redirect("/admin/events")
}
