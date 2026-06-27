"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { Globe, MapPin, Phone } from "lucide-react"
import subwayIcon from "@/assets/icons/subway.svg"
import busIcon from "@/assets/icons/bus.svg"
import { NaverMap } from "@/components/naver-map"
import { MotionReveal } from "@/components/motion"
import { locationPage } from "@/lib/location-content"
import { pageMainClassName } from "@/lib/page-layout"
import { cn } from "@/lib/utils"

function TransitIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={20}
      className="mt-0.5 h-5 w-5 shrink-0 opacity-80"
      aria-hidden
    />
  )
}

function InfoRow({
  icon,
  children,
  className,
}: {
  icon: LucideIcon | "subway" | "bus"
  children: ReactNode
  className?: string
}) {
  const iconNode =
    icon === "subway" ? (
      <TransitIcon src={subwayIcon.src} />
    ) : icon === "bus" ? (
      <TransitIcon src={busIcon.src} />
    ) : (
      (() => {
        const Icon = icon
        return (
          <Icon
            className="mt-0.5 h-5 w-5 shrink-0 text-foreground/80"
            strokeWidth={1.5}
            aria-hidden
          />
        )
      })()
    )

  return (
    <div className={cn("flex gap-4 md:gap-5", className)}>
      {iconNode}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function LocationPageContent() {
  return (
    <main className={pageMainClassName}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 xl:px-20">
        <MotionReveal>
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.15] tracking-tight text-foreground">
            {locationPage.pageTitle}
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.06}>
        <div className="mt-14 md:mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          <div className="space-y-10 md:space-y-12">
            <InfoRow icon={Phone}>
              <a
                href={`tel:${locationPage.phone.replace(/-/g, "")}`}
                className="text-base md:text-lg text-foreground hover:text-primary transition-colors"
              >
                {locationPage.phone}
              </a>
            </InfoRow>

            <InfoRow icon={Globe}>
              <div className="flex flex-wrap gap-2.5">
                {locationPage.social.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {link.label.toLowerCase()}
                  </a>
                ))}
              </div>
            </InfoRow>
          </div>

          <div className="space-y-10 md:space-y-12">
            <InfoRow icon={MapPin}>
              <div className="space-y-2 text-base md:text-lg leading-relaxed">
                {locationPage.address.lines.map((line) => (
                  <p key={line} className="text-foreground">
                    {line}
                  </p>
                ))}
                <p className="pt-1 text-base md:text-lg lg:text-xl font-bold text-foreground">
                  {locationPage.address.visitNote}
                </p>
              </div>
            </InfoRow>

            <InfoRow icon="subway">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {locationPage.subway}
              </p>
            </InfoRow>

            <InfoRow icon="bus">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {locationPage.bus}
              </p>
            </InfoRow>
          </div>
        </div>
        </MotionReveal>

        <MotionReveal delay={0.12}>
        <NaverMap
          className="mt-14 md:mt-20"
          address={locationPage.map.searchAddress}
          markerTitle={locationPage.map.markerTitle}
          zoom={locationPage.map.zoom}
          fallbackLat={locationPage.map.lat}
          fallbackLng={locationPage.map.lng}
        />
        </MotionReveal>
      </div>
    </main>
  )
}
