import { Hero } from "@/components/hero"
import { WhatWeDoSection } from "@/components/approach-section"
import { WhoWeServeSection } from "@/components/who-we-serve-section"
import { ImpactSection } from "@/components/studio-section"
import { ProgramsSection } from "@/components/projects-section"
import { DivisionsSection } from "@/components/divisions-section"
import { ManifestoSection } from "@/components/editorial-break"
import { PartnersSection } from "@/components/partners-section"
import { NewsSection } from "@/components/journal-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { FinalCtaSection } from "@/components/contact-section"

export default function Page() {
  return (
    <main>
      <Hero />
      <WhatWeDoSection />
      <WhoWeServeSection />
      <ImpactSection />
      <ProgramsSection />
      <DivisionsSection />
      <ManifestoSection />
      <PartnersSection />
      <NewsSection />
      <NewsletterSection />
      <FinalCtaSection />
    </main>
  )
}
