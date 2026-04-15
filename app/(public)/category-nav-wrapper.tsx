'use client'
import { useRouter } from 'next/navigation'
import { CategoryNav } from '@/components/category-nav'

interface HomeCategoryNavProps {
  categories: {
    id: string
    name: string
    slug: string
    type: 'digital' | 'physical'
    icon_name: string | null
  }[]
}

export function HomeCategoryNav({ categories }: HomeCategoryNavProps) {
  const router = useRouter()

  return (
    <CategoryNav
      categories={categories}
      onSelect={(slug) => {
        if (slug) {
          router.push(`/explorar?categoria=${slug}`)
        } else {
          router.push('/explorar')
        }
      }}
    />
  )
}
