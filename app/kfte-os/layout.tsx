export const metadata = {
  robots: { index: false, follow: false },
  alternates: {},
  openGraph: { images: [] },
}

export default function KfteOsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
