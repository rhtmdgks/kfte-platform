"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"
import {
  formatNewsListDate,
  type NewsCategory,
  type NewsListConfig,
} from "@/lib/news-types"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

type NewsListPageContentProps = {
  config: NewsListConfig
}

export function NewsListPageContent({ config }: NewsListPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("전체")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = useMemo(() => {
    return config.posts.filter((item) => {
      const matchesCategory =
        selectedCategory === "전체" || item.category === selectedCategory
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [config.posts, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleCategoryChange = (category: NewsCategory) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <main className={cn(pageMainClassName, "bg-[#FBFCFF]")}>
      <div className="relative z-10 px-6 pb-20 md:px-10 lg:px-[72px]">
        <h1 className="mb-12 text-center text-[40px] font-medium text-black">
          {config.pageHeading}
        </h1>

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

        <div className="mb-8 flex flex-wrap justify-center gap-x-9 gap-y-3">
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

        <div className="mx-auto max-w-[800px]">
          <div className="grid grid-cols-[100px_1fr_100px_80px] border-b-2 border-black py-3">
            <span className="pl-4 text-[14px] font-medium text-black">
              {config.authorColumnLabel}
            </span>
            <span className="text-[14px] font-medium text-black">제목</span>
            <span className="text-center text-[14px] font-medium text-black">작성일</span>
            <span className="text-center text-[14px] font-medium text-black">조회</span>
          </div>

          {currentItems.length === 0 ? (
            <div className="py-20 text-center text-[#7B7B7B]">
              등록된 {config.pageTitle}이 없습니다.
            </div>
          ) : (
            currentItems.map((item) => (
              <Link
                key={item.id}
                href={`${config.basePath}/${item.id}`}
                className="grid grid-cols-[100px_1fr_100px_80px] border-b border-[#D9D9D9] py-3 transition-colors hover:bg-black/5"
              >
                <span className="pl-4 text-[14px] font-medium text-[#7B7B7B]">
                  {item.author}
                </span>
                <span className="text-[14px] font-medium text-[#7B7B7B]">{item.title}</span>
                <span className="text-center text-[14px] font-medium text-[#7B7B7B]">
                  {formatNewsListDate(item.createdAt)}
                </span>
                <span className="text-center text-[14px] font-medium text-[#7B7B7B]">
                  {item.views}
                </span>
              </Link>
            ))
          )}
        </div>

        {filteredPosts.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-2">
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
            {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
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
