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
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant shrink-0">Filtrar por:</span>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {offerFilters.map((f) => {
              const active = (activeTipo ?? '') === f.value
              return (
                <button
                  key={f.value}
                  onClick={() => updateParam('tipo', f.value || null)}
                  className={cn(
                    'whitespace-nowrap rounded-xl px-5 py-2 text-xs font-black font-headline uppercase tracking-wider transition-all duration-300',
                    active
                      ? 'bg-primary text-white editorial-shadow'
                      : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
                  )}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <CategoryNav
            categories={categories}
            selectedSlug={activeCategoria}
            onSelect={(slug) => updateParam('categoria', slug)}
          />
        </div>
      </div>
    </>
  )
}
