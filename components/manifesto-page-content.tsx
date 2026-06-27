"use client"

// import { useState } from "react"
import Link from "next/link"
import { manifestoPage, type ManifestoTabId } from "@/lib/manifesto-content"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

export function ManifestoPageContent() {
  // 출범 선언문만 노출. 선언문 종류 추가 시 아래 탭 전환 로직 주석을 해제하세요.
  // const [activeTab, setActiveTab] = useState<ManifestoTabId>(
  //   manifestoPage.defaultTabId as ManifestoTabId,
  // )
  const activeTab = manifestoPage.defaultTabId as ManifestoTabId

  const statement = manifestoPage.statements[activeTab]

  return (
    <main className={pageMainClassName}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-foreground">
          {manifestoPage.pageTitle}
        </h1>

        <nav
          className="mt-8 flex flex-wrap items-center gap-y-2 text-base md:text-lg"
          aria-label="선언문 종류"
        >
          {manifestoPage.tabs.map((tab, index) => {
            const isActive = tab.id === activeTab

            return (
              <span key={tab.id} className="flex items-center">
                {index > 0 && (
                  <span
                    className="mx-3 md:mx-4 text-muted-foreground/40 font-light select-none"
                    aria-hidden
                  >
                    |
                  </span>
                )}
                <span
                  className={cn(
                    isActive
                      ? "font-bold text-foreground"
                      : "font-normal text-muted-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                </span>
                {/*
                // 탭 전환 활성화 시 위 <span>을 아래 <button>으로 교체
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id as ManifestoTabId)}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "font-bold text-foreground"
                      : "font-normal text-muted-foreground hover:text-foreground/70",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                </button>
                */}
              </span>
            )
          })}
        </nav>

        <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="text-xl md:text-2xl font-bold leading-snug text-primary">
              {statement.headline}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">{statement.date}</p>
            <p className="mt-8 text-base leading-relaxed text-foreground/85">
              {statement.summary}
            </p>
            <Link
              href={statement.pdfHref}
              className="mt-10 inline-flex items-center border border-foreground/25 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              전문보기(PDF)
            </Link>
          </aside>

          <section className="relative mt-14 lg:mt-0 min-h-[480px]">
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center overflow-hidden select-none"
              aria-hidden
            >
              {statement.watermark.map((line) => (
                <span
                  key={line}
                  className="whitespace-nowrap text-[clamp(3.5rem,11vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-[#ececec]"
                >
                  {line}
                </span>
              ))}
            </div>

            <ol className="relative z-10 space-y-10 md:space-y-12 lg:space-y-14">
              {statement.items.map((item) => (
                <li
                  key={item.number}
                  className="flex items-start gap-5 md:gap-8"
                >
                  <span
                    className="shrink-0 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none text-primary tabular-nums"
                    aria-hidden
                  >
                    {item.number}
                  </span>
                  <p className="pt-2 md:pt-3 text-base md:text-lg lg:text-xl font-medium leading-relaxed text-foreground">
                    {item.content}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  )
}
