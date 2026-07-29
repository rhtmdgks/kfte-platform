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
    <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left md:px-5"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold leading-snug text-ink">
          <span className="mr-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ci-gray">
            Q{String(index + 1).padStart(2, "0")}
          </span>
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-0.5 flex-shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-ci-gray" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/5 px-4 pb-4 pt-3 md:px-5">
              <p className="text-sm leading-[1.7] text-ci-gray">{item.answer}</p>
              {"href" in item && item.href && (
                <Link
                  href={item.href}
                  className="mt-2 inline-block text-sm font-medium text-ink/60 hover:text-ink hover:underline"
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
    <section id="faq" className="bg-mist px-5 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20">
      <div className="mx-auto max-w-2xl">
        <MotionReveal className="mb-6 md:mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ci-gray md:text-sm">
            {faq.eyebrow}
          </p>
          <h2 className="text-display-ko text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
            {faq.headline}
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.06} className="flex flex-col gap-2">
          {faq.items.map((item, index) => (
            <FaqItem key={item.question} item={item} index={index} />
          ))}
        </MotionReveal>
      </div>
    </section>
  )
}
