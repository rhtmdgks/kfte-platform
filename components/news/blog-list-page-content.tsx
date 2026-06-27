"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  Pin,
  Search,
} from "lucide-react"
import { MotionReveal } from "@/components/motion"
import { sortByPinnedThenDate } from "@/lib/content-post-pin"
import {
  formatBlogListDate,
  type BlogCategory,
  type BlogListConfig,
} from "@/lib/blog-types"
import { pageMainClassName } from "@/lib/page-layout"
import { listItem, tweenSmooth } from "@/lib/animation-presets"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 8

type BlogListPageContentProps = {
  config: BlogListConfig
}

function BlogThumbnail({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 120px, 280px"
      />
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#EEF2FA]">
      <ImageIcon className="h-10 w-10 text-[#002065]/25" strokeWidth={1.5} />
    </div>
  )
}

export function BlogListPageContent({ config }: BlogListPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("전체")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = useMemo(() => {
    const filtered = config.posts.filter((item) => {
      const matchesCategory =
        selectedCategory === "전체" || item.category === selectedCategory
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })

    return sortByPinnedThenDate(filtered)
  }, [config.posts, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleCategoryChange = (category: BlogCategory) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <main className={cn(pageMainClassName, "bg-[#FBFCFF]")}>
      <div className="relative z-10 px-6 pb-20 md:px-10 lg:px-[72px]">
        <MotionReveal>
          <h1 className="mb-12 text-center text-[40px] font-medium text-black">
            {config.pageHeading}
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.06}>
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <Search className="absolute left-0 top-1/2 h-9 w-9 -translate-y-1/2 text-black" />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                className="w-full border-b border-black bg-transparent py-2 pl-12 pr-4 text-[17px] text-black placeholder:text-black/70 focus:outline-none"
              />
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div className="mb-10 flex flex-wrap justify-center gap-x-9 gap-y-3">
            {config.categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "text-[20px] font-semibold transition-colors",
                  selectedCategory === category
                    ? "text-black"
                    : "text-[#C4C4C4] hover:text-black/60",
                )}
              >
                {category}
                {category === "전체" && (
                  <span className="ml-0.5 text-[16px] font-normal text-[#7B7B7B]">
                    ({filteredPosts.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </MotionReveal>

        <div className="mx-auto max-w-[960px] space-y-8">
          {currentItems.length === 0 ? (
            <div className="py-20 text-center text-[#7B7B7B]">
              등록된 {config.pageTitle} 글이 없습니다.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {currentItems.map((item) => (
                <motion.article
                  key={item.id}
                  layout
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={tweenSmooth}
                >
                  <Link
                    href={`${config.basePath}/${item.id}`}
                    className="group flex gap-5 rounded-[20px] bg-white p-4 transition-shadow hover:shadow-[0_8px_30px_rgba(0,32,101,0.08)] md:gap-8 md:p-5"
                  >
                    <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[16px] md:h-[180px] md:w-[280px] md:rounded-[20px]">
                      <BlogThumbnail src={item.thumbnailUrl} alt={item.title} />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-1 md:py-2">
                      <div>
                        <h2 className="inline-flex items-start gap-2 text-[18px] font-bold leading-snug text-black transition-colors group-hover:text-[#002065] md:text-[24px] md:leading-[1.35]">
                          {item.pinned ? (
                            <Pin
                              className="mt-1 h-4 w-4 shrink-0 fill-[#002065] text-[#002065] md:h-5 md:w-5"
                              aria-label="상단 고정"
                            />
                          ) : null}
                          <span>{item.title}</span>
                        </h2>
                        {item.summary ? (
                          <p className="mt-3 line-clamp-3 text-[14px] leading-[1.7] text-[#555555] md:mt-4 md:text-[16px] md:leading-[1.75]">
                            {item.summary}
                          </p>
                        ) : null}
                      </div>
                      <p className="mt-4 text-[13px] text-[#C4C4C4] md:mt-6 md:text-[14px]">
                        {formatBlogListDate(item.createdAt)}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          )}
        </div>

        {filteredPosts.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 disabled:opacity-30"
              aria-label="첫 페이지"
            >
              <ChevronsLeft className="h-4 w-4 text-[#C4C4C4]" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-1 disabled:opacity-30"
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-4 w-4 text-[#C4C4C4]" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const pageNumber = index + 1
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={cn(
                    "px-2 text-[14px] font-medium",
                    currentPage === pageNumber ? "text-black" : "text-[#C4C4C4]",
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="p-1 disabled:opacity-30"
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 disabled:opacity-30"
              aria-label="마지막 페이지"
            >
              <ChevronsRight className="h-4 w-4 text-black" />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
