'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CategoryNav } from '@/components/category-nav'

const offerFilters = [
  { label: 'Todos', value: '' },
  { label: 'Experiência Prática', value: 'practical_experience' },
  { label: 'Mentoria', value: 'hourly_mentoring' },
  { label: 'Serviço', value: 'service' },
]

interface FiltersProps {
  categories: {
    id: string
    name: string
    slug: string
    type: 'digital' | 'physical'
    icon_name: string | null
  }[]
  activeCategoria: string | null
  activeTipo: string | null
}

export function ExplorarFilters({ categories, activeCategoria, activeTipo }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/explorar?${params.toString()}`)
  }

  return (
    <>
      {/* Filtro por tipo de oferta */}
      <div className="bg-white border-b border-[#D6DCE8] px-6 py-3">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {offerFilters.map((f) => {
            const active = (activeTipo ?? '') === f.value
            return (
              <button
                key={f.value}
                onClick={() => updateParam('tipo', f.value || null)}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition',
                  active
                    ? 'bg-[#16213E] text-white'
                    : 'border border-[#D6DCE8] text-[#718096] hover:bg-gray-50'
                )}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="bg-[#F7F8FC] px-6 py-4">
        <CategoryNav
          categories={categories}
          selectedSlug={activeCategoria}
          onSelect={(slug) => updateParam('categoria', slug)}
        />
      </div>
    </>
  )
}
