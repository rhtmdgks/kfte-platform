"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { easeSmooth } from "@/lib/animation-presets"

type HornLineProps = {
  /** hero = long underline stroke; tick = section eyebrow mark */
  variant?: "hero" | "tick"
  className?: string
}

/**
 * Signature motif: unicorn horn as rising diagonal stroke in accent-blue.
 * One bold draw on hero; small static ticks elsewhere.
 */
export function HornLine({ variant = "hero", className }: HornLineProps) {
  const reduceMotion = useReducedMotion()

  if (variant === "tick") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 12"
        className={cn("inline-block h-2.5 w-5 shrink-0 text-accent-blue", className)}
        fill="none"
      >
        <path
          d="M1 10.5 L22 1.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 280 28"
      className={cn("pointer-events-none h-[0.55em] w-[1.65em] text-accent-blue", className)}
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M4 24 L276 4"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.05, ease: easeSmooth, delay: 0.55 },
          opacity: { duration: 0.2, delay: 0.55 },
        }}
      />
    </svg>
  )
}
