"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { springGentle, staggerContainer, staggerItem, viewportOnce } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

type MotionStaggerProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode
}

export function MotionStagger({ children, className, ...props }: MotionStaggerProps) {
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
      variants={staggerContainer}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type MotionStaggerItemProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode
  index?: number
}

export function MotionStaggerItem({
  children,
  className,
  index = 0,
  ...props
}: MotionStaggerItemProps) {
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
      variants={staggerItem}
      transition={{ ...springGentle, delay: index * 0.04 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
