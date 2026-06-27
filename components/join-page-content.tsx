"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Building2, Copy, Check } from "lucide-react"
import { joinPage, type JoinTabId } from "@/lib/join-content"
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { pageMainClassName } from "@/lib/page-layout"
import { tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

function JoinProcessTimeline() {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground md:text-base">
        {joinPage.processTitle}
      </p>
      <div className="relative mt-5">
        <span
          className="absolute top-[7px] right-[10%] left-[10%] hidden h-px bg-border lg:block"
          aria-hidden
        />
        <ol className="relative grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-2">
          {joinPage.steps.map((step) => (
            <li key={step.label} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-surface shadow-[0_0_0_1px_rgba(0,0,0,0.04)]",
                  step.complete ? "bg-[#22c55e]" : "bg-primary",
                )}
                aria-hidden
              />
              <p className="mt-3 text-[11px] leading-snug text-foreground/80 sm:text-xs md:text-[13px] whitespace-pre-line">
                {step.label}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <Link
        href={joinPage.applyHref}
        className="mt-8 inline-flex items-center rounded-full border-2 border-primary px-8 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:text-base"
      >
        {joinPage.applyLabel}
      </Link>
    </div>
  )
}

function CategoriesPanel() {
  const { categories } = joinPage

  return (
    <div className="space-y-14 md:space-y-16">
      <section>
        <h2 className="text-lg font-bold text-primary md:text-xl">
          {categories.startupTitle}
        </h2>
        <ol className="mt-6 space-y-3 text-base leading-relaxed text-foreground md:text-[17px]">
          {categories.startupCriteria.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="shrink-0 font-medium tabular-nums">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
        {categories.tiers.map((tier) => (
          <article key={tier.title}>
            <h3 className="text-lg font-bold text-foreground md:text-xl">{tier.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/85 md:text-[17px]">
              {tier.description}
            </p>
            <p className="mt-6 text-base leading-relaxed text-foreground md:text-[17px]">
              {tier.votingRights}
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground md:text-[17px]">
              {tier.fee}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}

function FeesPanel() {
  const { fees } = joinPage
  const [copied, setCopied] = useState(false)
  const bankMethod = fees.payment.methods[0]

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(bankMethod.account.replace(/-/g, ""))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.alert("계좌번호 복사에 실패했습니다.")
    }
  }

  return (
    <div className="space-y-12 md:space-y-16">
      <MotionReveal>
        <div className="space-y-4 text-base leading-[1.85] text-foreground/85 md:text-[17px]">
          {fees.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal delay={0.06}>
        <section>
          <h2 className="text-lg font-bold text-foreground md:text-xl">{fees.tableTitle}</h2>
          <div className="mt-6 overflow-hidden border border-border">
            <table className="w-full border-collapse text-center text-sm md:text-base">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-4 font-semibold md:px-6 md:py-5">
                    {fees.tableHeaders.category}
                  </th>
                  <th className="px-4 py-4 font-semibold md:px-6 md:py-5">
                    {fees.tableHeaders.amount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {fees.tableRows.map((row, index) => (
                  <tr
                    key={row.category}
                    className={cn(
                      "border-t border-border bg-surface transition-colors hover:bg-surface/80",
                      index % 2 === 1 && "bg-background",
                    )}
                  >
                    <td className="px-4 py-4 font-medium text-foreground md:px-6 md:py-5">
                      {row.category}
                    </td>
                    <td className="px-4 py-4 leading-relaxed text-foreground/85 md:px-6 md:py-5">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            {fees.tableNote}
          </p>
        </section>
      </MotionReveal>

      <section>
        <MotionReveal delay={0.1}>
          <h2 className="text-lg font-bold text-foreground md:text-xl">
            {fees.payment.title}
          </h2>
        </MotionReveal>

        <MotionStagger className="mt-6">
          {fees.payment.methods.map((method, index) => (
            <MotionStaggerItem key={method.id} index={index}>
              <div className="border border-border bg-surface/60 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                    <Building2 className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold tracking-wide text-primary">
                      {method.label}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:gap-y-2">
                      <span className="text-sm text-muted-foreground">은행</span>
                      <span className="text-base font-medium text-foreground">{method.bank}</span>
                      <span className="text-sm text-muted-foreground">계좌번호</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-semibold tracking-wide text-foreground">
                          {method.account}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              복사
                            </>
                          )}
                        </button>
                      </div>
                      <span className="text-sm text-muted-foreground">예금주</span>
                      <span className="text-base font-medium text-foreground">{method.holder}</span>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                      {method.note}
                    </p>
                  </div>
                </div>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>
    </div>
  )
}

function FaqPanel() {
  return (
    <dl className="space-y-10 md:space-y-12">
      {joinPage.faq.map((item) => (
        <div key={item.question}>
          <dt className="text-base font-bold text-foreground md:text-lg">{item.question}</dt>
          <dd className="mt-3 text-base leading-relaxed text-foreground/85 md:text-[17px]">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function TabPanel({ activeTab }: { activeTab: JoinTabId }) {
  switch (activeTab) {
    case "categories":
      return <CategoriesPanel />
    case "fees":
      return <FeesPanel />
    case "faq":
      return <FaqPanel />
  }
}

export function JoinPageContent() {
  const [activeTab, setActiveTab] = useState<JoinTabId>(joinPage.defaultTabId)

  return (
    <main className={pageMainClassName}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <MotionReveal>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-x-12 xl:gap-x-20">
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.15] tracking-tight text-foreground">
            {joinPage.pageTitle}
          </h1>
          <div className="mt-10 lg:mt-2">
            <JoinProcessTimeline />
          </div>
        </div>

        <nav
          className="mt-14 flex flex-wrap gap-x-0 border-b border-border md:mt-20"
          aria-label="가입 안내 섹션"
        >
          {joinPage.tabs.map((tab, index) => {
            const isActive = tab.id === activeTab

            return (
              <span key={tab.id} className="flex items-center">
                {index > 0 && (
                  <span
                    className="mx-3 text-muted-foreground/40 font-light select-none md:mx-4"
                    aria-hidden
                  >
                    |
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative pb-4 text-sm transition-colors md:text-base",
                    isActive
                      ? "font-bold text-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-foreground"
                      : "font-normal text-muted-foreground hover:text-foreground/70",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                </button>
              </span>
            )
          })}
        </nav>
        </MotionReveal>

        <div className="mt-12 md:mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={tweenSmooth}
            >
              <TabPanel activeTab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
