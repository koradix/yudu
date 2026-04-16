'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Monitor, Wrench, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryNav } from '@/components/category-nav'

const offerChips = [
  { label: 'Todos', value: '' },
  { label: 'Experiência Prática', value: 'practical_experience' },
  { label: 'Mentoria', value: 'hourly_mentoring' },
  { label: 'Serviço', value: 'service' },
]

interface Category {
  id: string
  name: string
  slug: string
  type: 'digital' | 'physical'
  icon_name: string | null
}

interface FiltersProps {
  categories: Category[]
  activeJourney: string | null
  activeCategoria: string | null
  activeTipo: string | null
}

export function ExplorarFilters({ categories, activeJourney, activeCategoria, activeTipo }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Save journey preference to localStorage
  useEffect(() => {
    if (activeJourney) {
      localStorage.setItem('yudu_journey', activeJourney)
    }
  }, [activeJourney])

  // On mount, if no journey param, try to read from localStorage
  useEffect(() => {
    if (!activeJourney) {
      const saved = localStorage.getItem('yudu_journey')
      if (saved === 'digital' || saved === 'physical') {
        updateParam('journey', saved)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset categoria when changing journey
    if (key === 'journey') {
      params.delete('categoria')
    }
    router.push(`/explorar?${params.toString()}`)
  }

  const filteredCategories = activeJourney
    ? categories.filter((c) => c.type === activeJourney)
    : categories

  return (
    <div className="space-y-0">
      {/* NÍVEL 1 — Tipo de Jornada */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-4">
            {/* Digital */}
            <button
              onClick={() => updateParam('journey', activeJourney === 'digital' ? null : 'digital')}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-8 py-4 border-2 text-left transition-all min-w-[200px]',
                activeJourney === 'digital'
                  ? 'bg-[#263238] text-white border-[#263238] shadow-lg'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              )}
            >
              <Monitor className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-base font-semibold">Digital</p>
                <p className={cn(
                  'text-xs mt-0.5',
                  activeJourney === 'digital' ? 'text-white/60' : 'text-gray-400'
                )}>
                  Online · Remoto · Tech
                </p>
              </div>
            </button>

            {/* Presencial */}
            <button
              onClick={() => updateParam('journey', activeJourney === 'physical' ? null : 'physical')}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-8 py-4 border-2 text-left transition-all min-w-[200px]',
                activeJourney === 'physical'
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-lg'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              )}
            >
              <Wrench className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-base font-semibold">Presencial</p>
                <p className={cn(
                  'text-xs mt-0.5',
                  activeJourney === 'physical' ? 'text-white/60' : 'text-gray-400'
                )}>
                  Campo real · Oficina · Obra
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* NÍVEL 2 — Categorias (aparece após selecionar jornada) */}
      {activeJourney && (
        <div className="bg-[#F7F8FC] border-b border-gray-100 px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <CategoryNav
              categories={filteredCategories}
              selectedSlug={activeCategoria}
              onSelect={(slug) => updateParam('categoria', slug)}
              activeColor={activeJourney === 'digital' ? '#263238' : '#2E7D32'}
            />
          </div>
        </div>
      )}

      {/* NÍVEL 3 — Offer Type */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {offerChips.map((f) => {
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
        </div>
      </div>
    </div>
  )
}
