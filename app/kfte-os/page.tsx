import type { Metadata } from "next"
import { KfteOsPageContent } from "@/components/kfte-os-page-content"

export const metadata: Metadata = {
  title: "KFTE OS | 한국기술창업진흥재단(KFTE)",
}

export default function KfteOsPage() {
  return <KfteOsPageContent />
}
