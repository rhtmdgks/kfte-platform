import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isVercelPreview =
  process.env.VERCEL_ENV != null && process.env.VERCEL_ENV !== 'production'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
    // 행사 폼 multipart(썸네일·본문) — proxy가 body를 버퍼링하므로 한도 맞춤
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/middlewareClientMaxBodySize
    proxyClientMaxBodySize: "25mb",
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    const base = [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
    // Vercel preview/development 배포 전체 noindex
    if (isVercelPreview) {
      base[0].headers = [
        ...base[0].headers,
        { key: 'X-Robots-Tag', value: 'noindex' },
      ]
    }
    return base
  },
}

export default nextConfig
