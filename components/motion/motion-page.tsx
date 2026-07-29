"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import { tweenPage } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type MotionPageProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Route enter fade only. No AnimatePresence mode=wait —
 * wait + opacity exit can leave App Router children stuck at opacity 0 (blank page).
 */
export function MotionPage({ children, className }: MotionPageProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={tweenPage}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
