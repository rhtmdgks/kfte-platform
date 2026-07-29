import { JsonLd } from "@/components/seo/json-ld"
import { homepageWebPageSchema } from "@/lib/seo/website-schema"
import { homepageFaqSchema } from "@/lib/seo/faq-schema"
import { Hero } from "@/components/hero"
import { WhatWeDoSection } from "@/components/approach-section"
import { WhoWeServeSection } from "@/components/who-we-serve-section"
// HIDDEN: Impact placeholders (—) — restore when real metrics ready
// import { ImpactSection } from "@/components/studio-section"
import { ProgramsSection } from "@/components/projects-section"
// HIDDEN: Divisions — restore with nav programs if needed
// import { DivisionsSection } from "@/components/divisions-section"
import { ManifestoSection } from "@/components/editorial-break"
// HIDDEN: Partners — restore when partner logos ready
// import { PartnersSection } from "@/components/partners-section"
import { NewsSection } from "@/components/journal-section"
import { FaqSection } from "@/components/faq-section"
import { NewsletterSection } from "@/components/newsletter-section"
// HIDDEN: FinalCta absorbed into NewsletterSection
// import { FinalCtaSection } from "@/components/contact-section"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kfte.kr'

const ogImage = {
  url: `${siteUrl}/og-default.jpg`,
  width: 1200,
  height: 630,
  alt: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
}

const desc =
  '한국기술창업진흥재단(KFTE)은 청소년과 청년이 기술로 창업에 도전할 수 있도록 교육·멘토링·네트워크·커뮤니티를 운영하는 민간 비영리 기술창업 생태계 재단입니다.'

export const metadata = {
  title: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
  description: desc,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
    description: desc,
    url: siteUrl,
    type: 'website',
    locale: 'ko_KR',
    siteName: '한국기술창업진흥재단(KFTE)',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: '한국기술창업진흥재단(KFTE) — 청소년·청년 기술창업 생태계',
    description: desc,
    images: [ogImage.url],
  },
}

export default function Page() {
  return (
    <main>
      <JsonLd data={homepageWebPageSchema} />
      <JsonLd data={homepageFaqSchema} />
      <Hero />
      <WhatWeDoSection />
      <WhoWeServeSection />
      {/* HIDDEN: <ImpactSection /> */}
      <ProgramsSection />
      {/* HIDDEN: <DivisionsSection /> */}
      <ManifestoSection />
      {/* HIDDEN: <PartnersSection /> */}
      <NewsSection />
      <FaqSection />
      <NewsletterSection />
      {/* HIDDEN: <FinalCtaSection /> — merged into NewsletterSection */}
    </main>
  )
}
