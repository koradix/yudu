import { cn } from '@/lib/utils'

const styles = {
  digital: 'bg-purple-100 text-purple-700 border-purple-200',
  physical: 'bg-teal-100 text-teal-700 border-teal-200',
}

interface SkillBadgeProps {
  name: string
  type: 'digital' | 'physical'
  size?: 'sm' | 'md'
}

export function SkillBadge({ name, type, size = 'sm' }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        styles[type],
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      )}
    >
      {name}
    </span>
  )
}
