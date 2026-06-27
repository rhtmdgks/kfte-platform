import type { Metadata } from "next"
import { KfteOsSection } from "@/components/kfte-os-section"

export const metadata: Metadata = {
  title: "KFTE OS | 한국기술창업진흥재단(KFTE)",
}

export default function KfteOsPage() {
  return <KfteOsSection variant="page" />
}
