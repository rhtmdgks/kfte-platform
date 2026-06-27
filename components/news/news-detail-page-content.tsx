"use client"

import Link from "next/link"
import { ArrowLeft, Download, Eye, FileIcon } from "lucide-react"
import { MotionReveal } from "@/components/motion"
import { formatNewsDetailDate, type NewsListConfig, type NewsPost } from "@/lib/news-types"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

type NewsDetailPageContentProps = {
  config: Omit<NewsListConfig, "posts">
  post: NewsPost
}

export function NewsDetailPageContent({ config, post }: NewsDetailPageContentProps) {

  const handleDownload = (url: string) => {
    if (url === "#") {
      window.alert("첨부 파일은 추후 연결 예정입니다.")
      return
    }

    window.open(url, "_blank")
  }

  const handleShare = (platform: string) => {
    const url = window.location.href

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "instagram":
        navigator.clipboard.writeText(url)
        window.alert("링크가 복사되었습니다. Instagram에 공유해주세요.")
        break
      case "link":
        navigator.clipboard.writeText(url)
        window.alert("링크가 복사되었습니다.")
        break
    }
  }

  return (
    <main className={cn(pageMainClassName, "bg-[#FBFCFF]")}>
      <div className="relative z-10 px-6 pb-16 md:px-10 lg:px-[72px]">
        <MotionReveal>
          <p className="mb-12 text-center text-[32px] font-medium text-black">
            {config.pageHeading}
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08}>
        <div className="mx-auto max-w-[800px]">
          <Link
            href={config.basePath}
            className="mb-6 inline-flex items-center gap-2 text-[#7B7B7B] transition-colors hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>

          <h1 className="mb-4 text-[32px] font-semibold leading-[1.5] text-black">
            {post.title}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-[16px] text-[#C4C4C4]">
            <time dateTime={post.createdAt}>{formatNewsDetailDate(post.createdAt)}</time>
            <span>·</span>
            <span>{post.author}</span>
            <span>·</span>
            <div className="flex items-center gap-0.5">
              <Eye className="h-5 w-5" />
              <span>{post.views}회</span>
            </div>
          </div>

          <div className="mb-8 h-px w-full bg-[#D9D9D9]" />

          <article className="mb-8 whitespace-pre-wrap text-[16px] leading-[2] text-[#555555]">
            {post.content}
          </article>

          {post.externalUrl ? (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-primary underline-offset-4 hover:underline"
            >
              원문 기사 보기
            </a>
          ) : null}

          {post.attachmentUrl && post.attachmentName ? (
            <button
              type="button"
              onClick={() => handleDownload(post.attachmentUrl!)}
              className="mb-10 inline-flex items-center gap-3 rounded-lg border border-[#D9D9D9] p-3 transition-colors hover:bg-[#F5F5F5]"
            >
              <FileIcon className="h-6 w-6 text-[#7B7B7B]" />
              <div className="flex-1 text-left">
                <p className="text-[14px] font-medium text-black">{post.attachmentName}</p>
                <p className="text-[12px] text-[#7B7B7B]">첨부파일</p>
              </div>
              <Download className="h-4 w-4 text-[#7B7B7B]" />
            </button>
          ) : null}

          <div className="mb-10 h-px w-full bg-[#D9D9D9]" />

          <div className="text-center">
            <h3 className="mb-6 text-[24px] font-bold text-black">SNS에 공유하기</h3>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => handleShare("facebook")}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F5] transition-colors hover:bg-[#E5E5E5]"
                aria-label="Facebook 공유"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleShare("instagram")}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F5] transition-colors hover:bg-[#E5E5E5]"
                aria-label="Instagram 공유"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleShare("link")}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F5] transition-colors hover:bg-[#E5E5E5]"
                aria-label="링크 복사"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        </MotionReveal>
      </div>
    </main>
  )
}
