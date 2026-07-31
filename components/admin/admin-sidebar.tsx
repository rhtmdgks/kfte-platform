"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ClipboardList,
  ImageIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Newspaper,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { KfteLogo } from "@/components/kfte-logo"
import type { Tables } from "@/types/database"

type Profile = Tables<"profiles">

type AdminSidebarProps = {
  profile: Profile | null
}

const contentNavItems = [
  { href: "/admin/notices", label: "공지사항", icon: Bell },
  { href: "/admin/press", label: "언론보도", icon: Newspaper },
  { href: "/admin/events", label: "행사", icon: Calendar },
  { href: "/admin/event-banners", label: "행사 배너", icon: ImageIcon },
  { href: "/admin/event-archives", label: "행사 아카이브", icon: BookOpen },
  { href: "/admin/blog", label: "블로그", icon: Megaphone },
  { href: "/admin/forms", label: "신청 폼", icon: ClipboardList },
]

const accountNavItems = [
  { href: "/admin/accounts/admins", label: "관리자 계정", icon: Users },
  { href: "/admin/accounts/users", label: "일반 사용자", icon: Users },
]

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/kfte-os/internal/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-14 shrink-0 flex-row items-center gap-0 border-b border-border p-0">
        {isCollapsed ? (
          <div className="flex h-full w-full items-center justify-center">
            <Link
              href="/admin"
              className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
              title="KFTE 운영 페이지"
            >
              <KfteLogo variant="symbol" className="h-8 w-8" />
            </Link>
          </div>
        ) : (
          <div className="flex h-full w-full items-center gap-2 px-4">
            <Link href="/admin" className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <KfteLogo variant="symbol" className="h-8 w-8" />
              </div>
              <span className="font-semibold text-[#002065]">KFTE 운영 페이지</span>
            </Link>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>대시보드</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>대시보드</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>콘텐츠 관리</SidebarGroupLabel>
          <SidebarMenu>
            {contentNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>계정 관리</SidebarGroupLabel>
          <SidebarMenu>
            {accountNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>회원사</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/admin/membership-applications")}
              >
                <Link href="/admin/membership-applications">
                  <Building2 />
                  <span>가입 신청</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#002065] text-xs text-primary-foreground">
                    {profile?.display_name?.[0] ?? profile?.email?.[0] ?? "A"}
                  </div>
                  <span className="truncate">
                    {profile?.display_name ?? profile?.email ?? "관리자"}
                  </span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/admin/account/password">
                    <KeyRound className="mr-2 h-4 w-4" />
                    비밀번호 변경
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
