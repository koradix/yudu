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
      className="group block bg-surface-container-lowest border border-outline-variant/30 rounded-DEFAULT p-5 editorial-shadow bento-card"
    >
      {/* Avatar + Name + Headline */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-14 w-14 rounded-full object-cover border-2 border-surface" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-black font-headline text-on-primary-fixed">
              {getInitials(name)}
            </div>
          )}
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[18px] block" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-base font-black font-headline text-on-surface truncate tracking-tight">{name}</p>
          <p className="text-xs text-on-surface-variant font-medium truncate">{headline}</p>
        </div>
      </div>

      {/* Rating + Price */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-tertiary text-tertiary" />
          <span className="font-bold text-tertiary text-sm">{ratingAvg.toFixed(1)}</span>
          <span className="text-on-surface-variant text-xs">({sessionsCount})</span>
        </div>
        {minPrice > 0 && (
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant block leading-none mb-0.5">A partir de</span>
            <span className="font-black font-headline text-lg text-primary tracking-tight">{formatPrice(minPrice)}</span>
          </div>
        )}
      </div>

      {/* Offer types + Skills */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {offerTypes.map((type) => (
            <span key={type} className="inline-flex items-center rounded-full bg-surface-container text-on-surface-variant px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {OFFER_TYPE_LABELS[type as keyof typeof OFFER_TYPE_LABELS] ?? type}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 2).map((skill) => (
            <SkillBadge key={skill.name} name={skill.name} type={skill.type} />
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="mt-5 border-2 border-primary text-primary rounded-DEFAULT py-3 text-center text-[10px] font-black font-headline uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-on-primary transition-all duration-200">
        Ver Perfil
      </div>
    </Link>
  )
}
