"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Download } from "lucide-react"
import { ciPage, type CiColorSwatch, type CiTabId } from "@/lib/ci-content"
import { MotionReveal } from "@/components/motion"
import { pageMainClassName } from "@/lib/page-layout"
import { tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

function ColorSwatch({ color }: { color: CiColorSwatch }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-14 w-14 rounded-full md:h-16 md:w-16"
        style={{ backgroundColor: color.hex }}
        aria-hidden
      />
      <div className="space-y-0.5 text-center text-[11px] leading-snug text-muted-foreground md:text-xs">
        {color.cmyk ? <p>{color.cmyk}</p> : null}
        <p className="font-medium text-foreground">{color.hex}</p>
      </div>
    </div>
  )
}

function CiGuideSection({ activeTab }: { activeTab: CiTabId }) {
  const archive = ciPage.archives[activeTab]

  return (
    <section className="mt-20 md:mt-28 lg:mt-32 pb-16 md:pb-24 lg:pb-32">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-8 xl:gap-10">
        <div className="flex min-h-[160px] items-center justify-center bg-primary px-6 py-8 md:min-h-[200px] md:px-8 md:py-10">
          <Image
            src={archive.previewWhite}
            alt={`${archive.previewAlt} (White)`}
            className="h-auto w-full max-w-[280px] md:max-w-[320px]"
          />
        </div>

        <div className="flex min-h-[160px] items-center justify-center bg-[#E1E6E1] px-6 py-8 md:min-h-[200px] md:px-8 md:py-10">
          <Image
            src={archive.previewBlue}
            alt={`${archive.previewAlt} (Blue)`}
            className="h-auto w-full max-w-[280px] md:max-w-[320px]"
          />
        </div>

        <div className="grid grid-cols-3 gap-x-6 gap-y-8 px-2 py-2 sm:gap-x-8 md:gap-x-10 lg:px-4">
          {archive.colors.map((color) => (
            <ColorSwatch key={`${activeTab}-${color.hex}`} color={color} />
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-4 border-y border-primary py-8 md:mt-16 md:py-10">
        <p className="text-base md:text-lg font-bold leading-relaxed text-foreground">
          {archive.description.lead}
        </p>
        <p className="text-base md:text-lg leading-relaxed text-foreground">
          {archive.description.note}
        </p>
      </div>
    </section>
  )
}

export function CiPageContent() {
  const [activeTab, setActiveTab] = useState<CiTabId>(ciPage.defaultTabId)
  const archive = ciPage.archives[activeTab]

  return (
    <main className={pageMainClassName}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <MotionReveal>
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.15] tracking-tight text-foreground">
            {ciPage.pageTitle}
          </h1>

          <nav
            className="mt-8 flex flex-wrap items-center gap-y-2 text-[15px] md:text-base"
            aria-label="CI 아카이브"
          >
            {ciPage.tabs.map((tab, index) => {
              const isActive = tab.id === activeTab

              return (
                <span key={tab.id} className="flex items-center">
                  {index > 0 && (
                    <span
                      className="mx-3 text-[#c4c4c4] font-light select-none md:mx-4"
                      aria-hidden
                    >
                      |
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "font-bold text-foreground"
                        : "font-normal text-[#999999] hover:text-foreground/60",
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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={tweenSmooth}
          >
            <Link
              href={archive.downloadHref}
              download={archive.downloadFilename}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#3366FF] px-7 py-3.5 text-[15px] md:text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden />
              {archive.downloadLabel}
            </Link>

            <div className="mt-14 md:mt-20 flex w-full flex-col items-center gap-12 md:gap-16">
              <Image
                src={archive.previewBlue}
                alt={`${archive.previewAlt} (Blue)`}
                className="h-auto w-full max-w-[min(100%,42rem)] md:max-w-[min(100%,48rem)] lg:max-w-[min(100%,56rem)]"
                priority
              />

              <div className="flex w-full max-w-[min(100%,42rem)] items-center justify-center bg-primary px-8 py-10 md:max-w-[min(100%,48rem)] md:px-12 md:py-14 lg:max-w-[min(100%,56rem)] lg:py-16">
                <Image
                  src={archive.previewWhite}
                  alt={`${archive.previewAlt} (White)`}
                  className="h-auto w-full max-w-[min(100%,36rem)] md:max-w-[min(100%,40rem)] lg:max-w-[min(100%,48rem)]"
                />
              </div>
            </div>

            <CiGuideSection activeTab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
