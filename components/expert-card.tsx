import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { RatingDisplay } from '@/components/rating-display'
import { SkillBadge } from '@/components/skill-badge'
import { formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS } from '@/lib/constants'

interface ExpertCardProps {
  id: string
  name: string
  headline: string
  avatarUrl: string | null
  isVerified: boolean
  ratingAvg: number
  sessionsCount: number
  minPrice: number
  offerTypes: string[]
  skills: { name: string; type: 'digital' | 'physical' }[]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function ExpertCard({
  id,
  name,
  headline,
  avatarUrl,
  isVerified,
  ratingAvg,
  sessionsCount,
  minPrice,
  offerTypes,
  skills,
}: ExpertCardProps) {
  return (
    <Link
      href={`/aprendiz/expert/${id}`}
      className="group block bg-white border border-[#D6DCE8] rounded-xl p-4 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(22,33,62,0.10)] hover:-translate-y-0.5"
    >
      {/* Linha 1: Avatar + Nome + Headline */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-[#EEF1FA] flex items-center justify-center text-sm font-semibold text-[#1A2B6D]">
              {getInitials(name)}
            </div>
          )}
          {isVerified && (
            <CheckCircle className="absolute -bottom-0.5 -right-0.5 h-4 w-4 fill-[#F5A623] stroke-white" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#16213E] truncate">{name}</p>
          <p className="text-xs text-[#718096] truncate">{headline}</p>
        </div>
      </div>

      {/* Linha 2: Rating + Preço */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <RatingDisplay rating={ratingAvg} count={sessionsCount} />
        <span className="text-[#D6DCE8]">|</span>
        <span className="text-[#718096] text-xs">a partir de</span>
        <span className="font-bold text-sm text-[#16213E]">
          {formatPrice(minPrice)}
        </span>
      </div>

      {/* Linha 3: Offer type pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {offerTypes.map((type) => (
          <span
            key={type}
            className="inline-flex items-center rounded-md bg-[#EEF1FA] px-2 py-0.5 text-[11px] font-medium text-[#1A2B6D]"
          >
            {OFFER_TYPE_LABELS[type as keyof typeof OFFER_TYPE_LABELS] ?? type}
          </span>
        ))}
      </div>

      {/* Linha 4: Skills */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {skills.slice(0, 2).map((skill) => (
          <SkillBadge key={skill.name} name={skill.name} type={skill.type} />
        ))}
      </div>

      {/* Rodapé: botão ghost */}
      <div className="mt-4 border border-[#D6DCE8] rounded-lg py-2 text-center text-sm font-medium text-[#16213E] group-hover:bg-[#EEF1FA] transition">
        Ver perfil →
      </div>
    </Link>
  )
}
