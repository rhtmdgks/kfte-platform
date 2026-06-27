"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { fadeUp, springGentle, viewportOnce } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type MotionRevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode
  delay?: number
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  ...props
}: MotionRevealProps) {
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
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ ...springGentle, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
