"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { easeSmooth } from "@/lib/animation-presets"

type PrismStackProps = {
  className?: string
  density?: "hero" | "compact"
}

/** Stacked frosted panes — white glass only, no accent-blue. */
export function PrismStack({ className, density = "hero" }: PrismStackProps) {
  const reduceMotion = useReducedMotion()
  const isHero = density === "hero"

  const panes = [
    {
      key: "back",
      className: cn(
        "absolute rounded-xl border border-white/12 bg-white/[0.06] backdrop-blur-xl",
        isHero
          ? "inset-y-[8%] right-[4%] w-[42%] max-w-md"
          : "inset-y-[10%] right-[6%] w-[48%]",
      ),
      rotate: reduceMotion ? 0 : -3.5,
      x: reduceMotion ? 0 : 12,
      delay: 0.15,
    },
    {
      key: "mid",
      className: cn(
        "absolute rounded-xl border border-white/15 bg-white/[0.08] backdrop-blur-xl",
        isHero
          ? "inset-y-[14%] right-[10%] w-[38%] max-w-sm"
          : "inset-y-[16%] right-[12%] w-[42%]",
      ),
      rotate: reduceMotion ? 0 : 2,
      x: reduceMotion ? 0 : -4,
      delay: 0.28,
    },
    {
      key: "front",
      className: cn(
        "absolute rounded-xl border border-white/20 bg-white/[0.1] backdrop-blur-md",
        isHero
          ? "bottom-[18%] right-[18%] h-[28%] w-[22%] max-w-[9rem]"
          : "bottom-[20%] right-[20%] h-[24%] w-[26%]",
      ),
      rotate: reduceMotion ? 0 : 6,
      x: 0,
      delay: 0.4,
    },
  ]

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(255,255,255,0.08),transparent_50%)]" />

      {panes.map((pane) => (
        <motion.div
          key={pane.key}
          className={pane.className}
          initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: pane.rotate - 2 }}
          animate={{ opacity: 1, y: 0, rotate: pane.rotate, x: pane.x }}
          transition={{ duration: 0.9, ease: easeSmooth, delay: pane.delay }}
        />
      ))}
    </div>
  )
}
