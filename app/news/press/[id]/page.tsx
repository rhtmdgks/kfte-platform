import type { Metadata } from "next"
import { NewsDetailPageContent } from "@/components/news/news-detail-page-content"
import { getNewsPostById } from "@/lib/news-types"
import { pressPage } from "@/lib/press-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return pressPage.posts.map((post) => ({ id: post.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = getNewsPostById(pressPage.posts, id)

  if (!post) {
    return { title: "언론보도 | 한국기술창업진흥재단(KFTE)" }
  }

  return {
    title: `${post.title} | 언론보도 | KFTE`,
    description: post.content.slice(0, 120),
  }
}

export default async function PressDetailPage({ params }: PageProps) {
  const { id } = await params
  return <NewsDetailPageContent config={pressPage} postId={id} />
}
