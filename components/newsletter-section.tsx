"use client"

import { useState } from "react"
import Link from "next/link"
import { MotionReveal } from "@/components/motion"
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
import { newsletter as newsletterContent } from "@/lib/kfte-content"

export function NewsletterSection() {
  const [agreed, setAgreed] = useState(false)

  return (
    <section id="newsletter" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-secondary/30">
      <MotionReveal className="max-w-xl mx-auto">
        <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-3 text-center">
          {newsletterContent.eyebrow}
        </p>
        <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-tight text-foreground text-balance mb-6 text-center">
          {newsletterContent.title}
        </h2>
        <p className="text-base leading-[1.75] text-muted-foreground mb-10 text-center">
          {newsletterContent.description}
        </p>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="newsletter-name">이름</Label>
            <Input
              id="newsletter-name"
              placeholder="홍길동"
              className="rounded-none h-11 bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-email">이메일</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="email@example.com"
              className="rounded-none h-11 bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-interest">관심 분야</Label>
            <Select>
              <SelectTrigger id="newsletter-interest" className="rounded-none h-11 bg-background">
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
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="newsletter-privacy"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
            />
            <Label
              htmlFor="newsletter-privacy"
              className="text-base leading-[1.6] text-muted-foreground font-normal cursor-pointer"
            >
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">개인정보처리방침</Link>에 따른 수집·이용에 동의합니다 (필수)
            </Label>
          </div>
          <Button type="submit" className="rounded-none w-full h-11" disabled={!agreed}>
            {newsletterContent.cta}
          </Button>
        </form>
      </MotionReveal>
    </section>
  )
}
