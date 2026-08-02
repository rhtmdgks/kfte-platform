import Link from "next/link"
import { cn } from "@/lib/utils"

type AccountsSectionNavProps = {
  active: "admins" | "users"
  adminCount: number
  userCount: number
}

const tabs = [
  { key: "admins" as const, href: "/admin/accounts/admins", label: "관리자" },
  { key: "users" as const, href: "/admin/accounts/users", label: "일반 사용자" },
]

export function AccountsSectionNav({
  active,
  adminCount,
  userCount,
}: AccountsSectionNavProps) {
  const counts = { admins: adminCount, users: userCount }

  return (
    <nav
      aria-label="계정 유형"
      className="glass-pane inline-flex w-full flex-wrap gap-1 rounded-2xl border border-white/55 p-1.5 sm:w-auto"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors sm:flex-none",
              isActive
                ? "bg-[#002065] text-white shadow-sm"
                : "text-slate-600 hover:bg-white/70 hover:text-[#002065]",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs tabular-nums",
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
              )}
            >
              {counts[tab.key]}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
