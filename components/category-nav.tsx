'use client'
import { cn } from '@/lib/utils'
import {
  LayoutGrid,
  Palette,
  Code2,
  Video,
  TrendingUp,
  Zap,
  Camera,
  Hammer,
  Droplets,
  Scissors,
  ChefHat,
  Paintbrush,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Code2,
  Video,
  TrendingUp,
  Zap,
  Camera,
  Hammer,
  Droplets,
  Scissors,
  ChefHat,
  Paintbrush,
  Wrench,
}

interface Category {
  id: string
  name: string
  slug: string
  type: 'digital' | 'physical'
  icon_name: string | null
}

interface CategoryNavProps {
  categories: Category[]
  selectedSlug?: string | null
  onSelect: (slug: string | null) => void
  activeColor?: string
}

export function CategoryNav({ categories, selectedSlug, onSelect, activeColor }: CategoryNavProps) {
  const activeBg = activeColor ?? '#263238'
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Item "Todos" */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex flex-col items-center gap-2 min-w-[72px] p-2 rounded-lg cursor-pointer transition',
          !selectedSlug ? 'bg-[#F7F8FC]' : 'hover:bg-[#F7F8FC]'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-full transition',
            !selectedSlug ? 'text-white' : 'bg-gray-100 text-gray-600'
          )}
          style={!selectedSlug ? { backgroundColor: activeBg } : undefined}
        >
          <LayoutGrid className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-medium text-[#263238] text-center leading-tight">
          Todos
        </span>
      </button>

      {categories.map((cat) => {
        const Icon = iconMap[cat.icon_name ?? ''] ?? Zap
        const active = selectedSlug === cat.slug
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug)}
            className={cn(
              'flex flex-col items-center gap-2 min-w-[72px] p-2 rounded-lg cursor-pointer transition',
              active ? 'bg-[#F7F8FC]' : 'hover:bg-[#F7F8FC]'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center h-10 w-10 rounded-full transition',
                active
                  ? 'text-white'
                  : cat.type === 'digital'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-teal-100 text-teal-700'
              )}
              style={active ? { backgroundColor: activeBg } : undefined}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-[#263238] text-center leading-tight line-clamp-2">
              {cat.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
