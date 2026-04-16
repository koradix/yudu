'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const filterChips = [
  { label: 'Todos', value: '' },
  { label: 'Exp. Prática', value: 'practical_experience' },
  { label: 'Mentoria', value: 'hourly_mentoring' },
  { label: 'Serviço', value: 'service' },
]

const worldChips = [
  { label: 'Todos', value: '' },
  { label: 'Digital', value: 'digital' },
  { label: 'Presencial', value: 'physical' },
]

interface FiltersProps {
  categories: {
    id: string; name: string; slug: string; type: 'digital' | 'physical'; icon_name: string | null
  }[]
  activeCategoria: string | null
  activeTipo: string | null
  activeMundo: string | null
}

export function ExplorarFilters({ categories, activeCategoria, activeTipo, activeMundo }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/explorar?${params.toString()}`)
  }

  const filteredCategories = activeMundo
    ? categories.filter((c) => c.type === activeMundo)
    : categories

  return (
    <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-3">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full bg-[#F7F8FC] border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#263238] transition"
              placeholder="Qual serviço você procura?"
              type="text"
            />
          </div>

          {/* World filter */}
          <div className="flex gap-2">
            {worldChips.map((w) => {
              const active = (activeMundo ?? '') === w.value
              return (
                <button
                  key={w.value}
                  onClick={() => updateParam('mundo', w.value || null)}
                  className={cn(
                    'text-sm px-3 py-1.5 rounded-full flex items-center gap-1 transition',
                    active
                      ? 'bg-[#263238] text-white border border-[#263238]'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {w.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Type + Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {filterChips.map((f) => {
            const active = (activeTipo ?? '') === f.value
            return (
              <button
                key={f.value}
                onClick={() => updateParam('tipo', f.value || null)}
                className={cn(
                  'whitespace-nowrap text-sm px-3 py-1.5 rounded-full flex items-center gap-1 transition',
                  active
                    ? 'bg-[#263238] text-white border border-[#263238]'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {f.label}
                <ChevronDown className="w-3 h-3" />
              </button>
            )
          })}

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {filteredCategories.map((cat) => {
            const active = activeCategoria === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => updateParam('categoria', active ? null : cat.slug)}
                className={cn(
                  'whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition',
                  active
                    ? 'bg-[#2E7D32] text-white border border-[#2E7D32]'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
