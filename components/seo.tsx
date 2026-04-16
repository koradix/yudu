import type { Metadata } from 'next'

const defaultImage = '/og-image.png'
const defaultUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yudu-navy.vercel.app'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

export function generateSEO({ title, description, image, url }: SEOProps): Metadata {
  const fullTitle = `${title} | YUDU`
  const ogImage = image ?? `${defaultUrl}${defaultImage}`
  const pageUrl = url ?? defaultUrl

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: 'YUDU',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}
