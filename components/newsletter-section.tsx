"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MotionEnter } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { finalCta, newsletter as newsletterContent, site } from "@/lib/kfte-content"

/** Newsletter + CTA — navy + white glass only */
export function NewsletterSection() {
  const [agreed, setAgreed] = useState(false)

  return (
    <section
      id="newsletter"
      className="bg-primary px-5 py-12 text-primary-foreground sm:px-6 md:px-12 md:py-20 lg:px-20"
    >
      <div className="mx-auto grid max-w-5xl gap-3 lg:grid-cols-2 lg:gap-4">
        <MotionEnter className="rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl md:p-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 md:text-sm">
            {finalCta.eyebrow}
          </p>
          <h2 className="break-keep text-[clamp(1.35rem,2.8vw,1.875rem)] font-extrabold leading-[1.45] tracking-tight text-white">
            기술창업의 다음 세대를
            <br />
            함께 만들 사람을 찾습니다
          </h2>
          <p className="mt-3 max-w-md text-sm leading-[1.65] text-white/55">
            {finalCta.description}
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {finalCta.actions
              .filter((a) => a.href !== "#contact")
              .map((action) => (
                <Button
                  key={action.label}
                  asChild
                  size="sm"
                  className="rounded-lg bg-white text-primary hover:bg-white/90"
                >
                  <Link href={action.href}>
                    {action.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/35">
                Email
              </p>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {site.email}
              </a>
            </div>
            <div>
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/35">
                Tel
              </p>
              <a
                href={`tel:${site.phone.replace(/-/g, "")}`}
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {site.phone}
              </a>
            </div>
          </div>
        </MotionEnter>

        <MotionEnter
          delay={0.08}
          className="rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl md:p-7"
        >
          <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
            {newsletterContent.eyebrow}
          </p>
          <h3 className="mb-2 text-lg font-bold tracking-tight text-white md:text-xl">
            {newsletterContent.title}
          </h3>
          <p className="mb-5 break-keep text-sm leading-[1.65] text-white/50">
            {newsletterContent.description}
          </p>

          <form
            id="contact"
            className="flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-1">
              <Label htmlFor="newsletter-name" className="text-xs text-white/60">
                이름
              </Label>
              <Input
                id="newsletter-name"
                placeholder="홍길동"
                className="h-9 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="newsletter-email" className="text-xs text-white/60">
                이메일
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="email@example.com"
                className="h-9 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="newsletter-interest" className="text-xs text-white/60">
                관심 분야
              </Label>
              <Select>
                <SelectTrigger
                  id="newsletter-interest"
                  className="h-9 rounded-lg border-white/15 bg-white/5 text-white"
                >
                  <SelectValue placeholder="관심 분야를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {newsletterContent.interests.map((interest) => (
                    <SelectItem key={interest} value={interest}>
                      {interest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-2 pt-0.5">
              <Checkbox
                id="newsletter-privacy"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5 border-white/40 data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <Label
                htmlFor="newsletter-privacy"
                className="cursor-pointer text-xs font-normal leading-snug text-white/50"
              >
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 transition-colors hover:text-white"
                >
                  개인정보처리방침
                </Link>
                에 동의합니다 (필수)
              </Label>
            </div>

            <Button
              type="submit"
              size="sm"
              className="mt-1 h-9 w-full rounded-lg bg-white text-primary hover:bg-white/90"
              disabled={!agreed}
            >
              {newsletterContent.cta}
            </Button>
          </form>
        </MotionEnter>
      </div>
    </section>
  )
}
