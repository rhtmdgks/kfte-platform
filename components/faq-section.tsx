"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { MotionReveal } from "@/components/motion"
import { faq } from "@/lib/kfte-content"

function FaqItem({
  item,
  index,
}: {
  item: (typeof faq.items)[number]
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-semibold text-foreground leading-snug">
          <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground/50 uppercase mr-3">
            Q{String(index + 1).padStart(2, "0")}
          </span>
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-10 pr-10">
              <p className="text-base leading-[1.8] text-muted-foreground">
                {item.answer}
              </p>
              {"href" in item && item.href && (
                <Link
                  href={item.href}
                  className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  {item.hrefLabel} →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-28 md:px-12 lg:px-20 md:py-36">
      <div className="max-w-3xl mx-auto">
        <MotionReveal className="mb-12 md:mb-16 pb-6 border-b border-border">
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3">
            {faq.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {faq.headline}
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          {faq.items.map((item, index) => (
            <FaqItem key={item.question} item={item} index={index} />
          ))}
        </MotionReveal>
      </div>
    </section>
  )
}
