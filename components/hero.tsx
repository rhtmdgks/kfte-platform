"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/kfte-content"

export function Hero() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={ref}
      data-hero-section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
          alt="청년 창업가들의 협업과 네트워킹"
          className={`w-full h-full object-cover transition-transform duration-[2s] ease-out ${
            visible ? "scale-100" : "scale-110"
          }`}
        />
        <div className="absolute inset-0 bg-primary/75" />
      </div>

      <div className="relative z-10 px-6 pb-16 md:px-12 lg:px-20 md:pb-24">
        <div className="max-w-6xl">
          <div
            className={`mb-6 transition-all duration-1000 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-sm md:text-base tracking-[0.2em] uppercase font-semibold text-primary-foreground/60">
              {site.fullName}
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-primary-foreground">
              {site.tagline.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 text-base md:text-lg leading-[1.8] text-primary-foreground/75 max-w-2xl">
              {site.description}
            </p>
          </div>

          <div
            className={`mt-10 flex flex-col sm:flex-row flex-wrap gap-3 transition-all duration-1000 delay-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-none bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link href="#contact">
                KFTE와 함께하기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="#programs">프로그램 둘러보기</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-none text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="#resources">재단 소개서 보기</Link>
            </Button>
          </div>
        </div>

        <div
          className={`mt-16 md:mt-20 flex items-center gap-6 transition-all duration-1000 delay-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-12 h-px bg-primary-foreground/30" />
          <span className="text-sm tracking-[0.15em] uppercase font-semibold text-primary-foreground/50">
            {site.concept}
          </span>
        </div>
      </div>
    </section>
  )
}
