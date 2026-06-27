"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { FileText, ScrollText } from "lucide-react"
import {
  bylawsPage,
  type BylawsArticle,
  type BylawsChapter,
} from "@/lib/bylaws-content"
import { MotionEnter, MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/motion"
import { pageMainClassName } from "@/lib/page-layout"
import { fadeUpHero, springGentle } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

function ArticleBody({ article }: { article: BylawsArticle }) {
  return (
    <div className="space-y-4 text-base md:text-[17px] leading-[1.85] text-foreground/90">
      {article.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {article.clauses?.map((clause) => (
        <p key={clause.label}>
          <span className="mr-2 font-semibold text-primary">{clause.label}</span>
          {clause.text}
        </p>
      ))}
      {article.items && article.items.length > 0 && (
        <ol className="space-y-2 pl-1">
          {article.items.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="shrink-0 font-semibold tabular-nums text-primary/80">
                {index + 1}.
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function ChapterSection({
  chapter,
  isActive,
  onInView,
}: {
  chapter: BylawsChapter
  isActive: boolean
  onInView: (id: string) => void
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onInView(chapter.id)
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [chapter.id, onInView])

  return (
    <section
      ref={ref}
      id={chapter.id}
      className="scroll-mt-32 border-t border-border/60 pt-12 first:border-t-0 first:pt-0 md:pt-14"
    >
      <MotionReveal>
        <div className="mb-8 flex items-center gap-4 md:mb-10">
          <span
            className={cn(
              "text-[clamp(2rem,4vw,3rem)] font-bold leading-none tabular-nums transition-colors duration-300",
              isActive ? "text-primary" : "text-primary/25",
            )}
          >
            {chapter.number}
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Chapter
            </p>
            <h3 className="text-xl font-bold text-foreground md:text-2xl">{chapter.title}</h3>
          </div>
        </div>
      </MotionReveal>

      <MotionStagger className="space-y-8 md:space-y-10">
        {chapter.articles.map((article, articleIndex) => (
          <MotionStaggerItem key={article.id} index={articleIndex}>
            <article className="group rounded-none border border-transparent bg-surface/50 p-5 transition-colors hover:border-primary/10 hover:bg-surface md:p-7">
              <div className="flex items-center gap-4 md:gap-6">
                <span
                  className="shrink-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none text-primary tabular-nums"
                  aria-hidden
                >
                  {String(articleIndex + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary/80">{article.label}</p>
                  <h4 className="mt-1 text-lg font-bold text-foreground md:text-xl">
                    {article.title}
                  </h4>
                </div>
              </div>
              <div className="mt-4 md:ml-[calc(clamp(1.75rem,3vw,2.5rem)+1.5rem)]">
                <ArticleBody article={article} />
              </div>
            </article>
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </section>
  )
}

function SupplementarySection({
  isActive,
  onInView,
}: {
  isActive: boolean
  onInView: () => void
}) {
  const { document: doc, supplementary } = bylawsPage
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onInView()
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [onInView])

  return (
    <section
      ref={ref}
      id="supplementary"
      className={cn(
        "scroll-mt-32 border-t border-border/60 pt-12 md:pt-14",
        isActive && "border-primary/20",
      )}
    >
      <MotionReveal>
        <h3 className="text-xl font-bold text-foreground md:text-2xl">{supplementary.title}</h3>
      </MotionReveal>
      <MotionStagger className="mt-8 space-y-6">
        {supplementary.articles.map((article, index) => (
          <MotionStaggerItem key={article.id} index={index}>
            <article className="border border-border/60 bg-surface/50 p-5 md:p-7">
              <p className="text-sm font-semibold text-primary/80">{article.label}</p>
              <h4 className="mt-1 text-lg font-bold">{article.title}</h4>
              <div className="mt-4">
                <ArticleBody article={article} />
              </div>
            </article>
          </MotionStaggerItem>
        ))}
      </MotionStagger>

      <MotionEnter className="mt-12">
        <div className="border border-primary/15 bg-primary px-6 py-8 text-primary-foreground md:px-10 md:py-10">
          <p className="text-base leading-[1.9] text-primary-foreground/90 md:text-lg">
            {doc.enactment}
          </p>
          <p className="mt-6 text-right text-sm font-semibold tracking-wide md:text-base">
            {doc.effectiveDate}
          </p>
        </div>
      </MotionEnter>
    </section>
  )
}

export function BylawsPageContent() {
  const { document: doc, chapters, supplementary } = bylawsPage
  const [activeChapter, setActiveChapter] = useState<string>(chapters[0]?.id ?? "")
  const reduceMotion = useReducedMotion()
  const contentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: progressRef,
    offset: ["start start", "end end"],
  })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <main className={cn(pageMainClassName, "bg-background")}>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, #002065 1px, transparent 1px), linear-gradient(to bottom, #002065 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-28 md:px-10 md:pb-20 md:pt-36 lg:px-16 xl:px-20">
          <motion.div
            variants={reduceMotion ? undefined : heroStagger}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.p
              variants={fadeUpHero}
              transition={springGentle}
              className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground"
            >
              <ScrollText className="h-4 w-4 text-primary" />
              Articles of Association
            </motion.p>

            <motion.h1
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-8 text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-foreground md:mt-10"
            >
              {bylawsPage.pageTitle}
            </motion.h1>

            <motion.nav
              variants={fadeUpHero}
              transition={springGentle}
              className="mt-6 flex flex-wrap items-center gap-y-2 text-base md:text-lg"
              aria-label="정관 종류"
            >
              {bylawsPage.tabs.map((tab, index) => (
                <span key={tab.id} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-3 select-none font-light text-muted-foreground/40 md:mx-4">
                      |
                    </span>
                  )}
                  <span className="font-bold text-foreground">{tab.label}</span>
                </span>
              ))}
            </motion.nav>
          </motion.div>
        </div>
      </section>

      {!reduceMotion && (
        <div
          className="fixed left-0 right-0 top-[96px] z-[99] hidden h-0.5 overflow-hidden bg-border md:block"
          aria-hidden
        >
          <motion.div className="h-full bg-primary" style={{ width: progressWidth }} />
        </div>
      )}

      <div
        ref={progressRef}
        className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20"
      >
        <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <MotionReveal>
              <h2 className="text-xl font-bold leading-snug text-primary md:text-2xl">
                {doc.headline}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{doc.subtitle}</p>
              <p className="mt-4 text-sm text-muted-foreground">{doc.date}</p>
              <p className="mt-8 text-base leading-relaxed text-foreground/85">{doc.summary}</p>

              <Link
                href={doc.pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 border border-foreground/25 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <FileText className="h-4 w-4 text-primary" />
                전문보기(PDF)
              </Link>

              <nav className="mt-12 hidden lg:block" aria-label="장 목차">
                <p className="mb-4 text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground">
                  목차
                </p>
                <ul className="space-y-1 border-l border-border">
                  {chapters.map((chapter) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        className={cn(
                          "block border-l-2 py-2 pl-4 text-sm transition-colors",
                          activeChapter === chapter.id
                            ? "border-primary font-semibold text-primary"
                            : "-ml-px border-transparent text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {chapter.title}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#supplementary"
                      className={cn(
                        "block border-l-2 py-2 pl-4 text-sm transition-colors",
                        activeChapter === "supplementary"
                          ? "border-primary font-semibold text-primary"
                          : "-ml-px border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {supplementary.title}
                    </a>
                  </li>
                </ul>
              </nav>
            </MotionReveal>
          </aside>

          <div ref={contentRef} className="relative mt-14 lg:mt-0">
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start overflow-hidden select-none pt-8"
              aria-hidden
            >
              {doc.watermark.map((line) => (
                <span
                  key={line}
                  className="whitespace-nowrap text-[clamp(3rem,10vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-[#ececec]"
                >
                  {line}
                </span>
              ))}
            </div>

            <div className="relative z-10 space-y-4 pb-8">
              {chapters.map((chapter) => (
                <ChapterSection
                  key={chapter.id}
                  chapter={chapter}
                  isActive={activeChapter === chapter.id}
                  onInView={setActiveChapter}
                />
              ))}

              <SupplementarySection
                isActive={activeChapter === "supplementary"}
                onInView={() => setActiveChapter("supplementary")}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
