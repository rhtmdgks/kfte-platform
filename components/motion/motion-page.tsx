"use client"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { pageTransition, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type MotionPageProps = {
  children: React.ReactNode
  className?: string
}

export function MotionPage({ children, className }: MotionPageProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={tweenSmooth}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
