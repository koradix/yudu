import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDisplayProps {
  rating: number
  count: number
  size?: 'sm' | 'md'
}

export function RatingDisplay({ rating, count, size = 'sm' }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      <Star
        className={cn(
          'fill-[#B07D05] stroke-[#B07D05]',
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
        )}
      />
      <span
        className={cn(
          'font-bold text-[#B07D05]',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className={cn(
          'text-[#718096]',
          size === 'sm' ? 'text-[11px]' : 'text-xs'
        )}
      >
        ({count})
      </span>
    </div>
  )
}
