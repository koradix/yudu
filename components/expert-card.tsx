import Link from 'next/link'
import { Star } from 'lucide-react'
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
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function ExpertCard({
  id, name, headline, avatarUrl, isVerified, ratingAvg, sessionsCount, minPrice, offerTypes, skills,
}: ExpertCardProps) {
  return (
    <Link
      href={`/expert/${id}`}
      className="group block bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Avatar + Name + Headline */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-[#263238]">
              {getInitials(name)}
            </div>
          )}
          {isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-px">
              <div className="h-4 w-4 rounded-full bg-[#2E7D32] flex items-center justify-center">
                <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#263238] truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">{headline}</p>
        </div>
      </div>

      {/* Rating + Price */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-[#B07D05] text-[#B07D05]" />
          <span className="font-bold text-[#B07D05]">{ratingAvg.toFixed(1)}</span>
          <span className="text-gray-400">({sessionsCount})</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="text-right">
          <span className="text-gray-400 text-[10px] uppercase tracking-wide">A partir de</span>
          <span className="font-bold text-sm text-[#263238] ml-1">{formatPrice(minPrice)}</span>
        </div>
      </div>

      {/* Offer type pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {offerTypes.map((type) => (
          <span key={type} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
            {OFFER_TYPE_LABELS[type as keyof typeof OFFER_TYPE_LABELS] ?? type}
          </span>
        ))}
      </div>

      {/* Skills */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {skills.slice(0, 2).map((skill) => (
          <SkillBadge key={skill.name} name={skill.name} type={skill.type} />
        ))}
      </div>

      {/* Button */}
      <div className="mt-4 border border-gray-200 rounded-lg py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:bg-[#2E7D32] group-hover:text-white group-hover:border-[#2E7D32] transition">
        Ver Perfil
      </div>
    </Link>
  )
}
