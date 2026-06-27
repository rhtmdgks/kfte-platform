import {
  getEventRegistrationStatus,
  registrationStatusLabel,
  type EventPost,
} from "@/lib/event-types"
import { cn } from "@/lib/utils"

type EventStatusBadgeProps = {
  event: EventPost
  /** 썸네일 위 오버레이 — 흰 테두리·그림자로 가독성 강화 */
  overlay?: boolean
  className?: string
}

const statusStyles = {
  open: {
    overlay:
      "bg-[#002065] text-white ring-2 ring-white/95 shadow-[0_4px_14px_rgba(0,32,101,0.45)]",
    inline: "bg-primary text-primary-foreground shadow-sm",
  },
  soon: {
    overlay:
      "bg-amber-500 text-white ring-2 ring-white/95 shadow-[0_4px_14px_rgba(245,158,11,0.45)]",
    inline: "bg-amber-500 text-white shadow-sm",
  },
  closed: {
    overlay:
      "bg-neutral-700 text-white ring-2 ring-white/95 shadow-[0_4px_14px_rgba(0,0,0,0.35)]",
    inline: "bg-neutral-600 text-white shadow-sm",
  },
} as const

export function EventStatusBadge({ event, overlay = false, className }: EventStatusBadgeProps) {
  const status = getEventRegistrationStatus(event)
  const variant = overlay ? statusStyles[status].overlay : statusStyles[status].inline

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide",
        variant,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          status === "open" && "bg-emerald-300",
          status === "soon" && "bg-white",
          status === "closed" && "bg-neutral-300",
        )}
        aria-hidden
      />
      {registrationStatusLabel[status]}
    </span>
  )
}
