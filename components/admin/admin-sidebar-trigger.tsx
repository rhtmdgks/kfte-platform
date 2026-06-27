"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type AdminSidebarTriggerProps = {
  className?: string
}

export function AdminSidebarTrigger({ className }: AdminSidebarTriggerProps) {
  const { toggleSidebar, state, isMobile, openMobile } = useSidebar()
  const isOpen = isMobile ? openMobile : state === "expanded"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 shrink-0", className)}
      onClick={toggleSidebar}
      aria-label={isOpen ? "사이드바 접기" : "사이드바 열기"}
      title={isOpen ? "사이드바 접기" : "사이드바 열기"}
    >
      {isOpen ? (
        <PanelLeftClose className="h-5 w-5" />
      ) : (
        <PanelLeftOpen className="h-5 w-5" />
      )}
    </Button>
  )
}
