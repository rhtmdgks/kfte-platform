"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type MotionEnterProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode
  delay?: number
}

export function MotionEnter({
  children,
  className,
  delay = 0,
  ...props
}: MotionEnterProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={cn(className)} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springGentle, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
