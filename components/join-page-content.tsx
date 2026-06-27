"use client"

import { useState } from "react"
import Link from "next/link"
import { joinPage, type JoinTabId } from "@/lib/join-content"
import { pageMainClassName } from "@/lib/page-layout"
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
                  "relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)]",
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
  return (
    <div className="space-y-10 md:space-y-12">
      <p className="text-base leading-relaxed text-foreground/85 md:text-[17px]">
        {joinPage.fees.intro}
      </p>
      {joinPage.fees.items.map((item) => (
        <section key={item.title}>
          <h2 className="text-lg font-bold text-primary md:text-xl">{item.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground md:text-[17px]">
            {item.content}
          </p>
        </section>
      ))}
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

        <div className="mt-12 md:mt-16">
          <TabPanel activeTab={activeTab} />
        </div>
      </div>
    </main>
  )
}
