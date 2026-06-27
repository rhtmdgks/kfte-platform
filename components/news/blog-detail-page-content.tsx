"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Eye } from "lucide-react"
import { MotionReveal } from "@/components/motion"
import {
  formatBlogDetailDate,
  formatBlogListDate,
  type BlogListConfig,
  type BlogPost,
} from "@/lib/blog-types"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

type BlogDetailPageContentProps = {
  config: Omit<BlogListConfig, "posts">
  post: BlogPost
}

export function BlogDetailPageContent({ config, post }: BlogDetailPageContentProps) {
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
          <h1 className="mb-12 text-center text-[32px] font-medium text-black">
            {config.pageHeading}
          </h1>
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

            {post.thumbnailUrl ? (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[20px]">
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 800px) 100vw, 800px"
                />
              </div>
            ) : null}

            <h2 className="mb-4 text-[32px] font-semibold leading-[1.5] text-black">
              {post.title}
            </h2>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-[16px] text-[#C4C4C4]">
              <span>{formatBlogListDate(post.createdAt)}</span>
              <span>·</span>
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.category}</span>
              <span>·</span>
              <div className="flex items-center gap-0.5">
                <Eye className="h-5 w-5" />
                <span>{post.views}회</span>
              </div>
            </div>

            {post.summary ? (
              <p className="mb-6 text-[17px] leading-[1.8] text-[#555555]">{post.summary}</p>
            ) : null}

            <div className="mb-8 h-px w-full bg-[#D9D9D9]" />

            <div className="mb-10 whitespace-pre-wrap text-[16px] leading-[2] text-[#555555]">
              {post.content}
            </div>

            <p className="mb-10 text-right text-[14px] text-[#C4C4C4]">
              {formatBlogDetailDate(post.createdAt)}
            </p>

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
