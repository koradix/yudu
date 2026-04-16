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
      className="group block bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-5 bento-card editorial-shadow"
    >
      {/* Linha 1: Avatar + Nome + Headline */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-14 w-14 rounded-full object-cover border-2 border-surface"
            />
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
          <p className="text-base font-black font-headline text-on-surface truncate tracking-tighter">{name}</p>
          <p className="text-xs text-on-surface-variant font-medium truncate">{headline}</p>
        </div>
      </div>

      {/* Linha 2: Rating + Preço */}
      <div className="mt-4 flex items-center justify-between">
        <RatingDisplay rating={ratingAvg} count={sessionsCount} />
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block leading-none mb-1 text-[8px]">A partir de</span>
          <span className="font-black font-headline text-lg text-primary tracking-tighter">
            {formatPrice(minPrice)}
          </span>
        </div>
      </div>

      {/* Linha 3 & 4: Pills & Skills */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {offerTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center rounded-md bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container"
            >
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

      {/* Rodapé: botão ghost */}
      <div className="mt-5 border border-outline-variant/50 rounded-xl py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
        Ver perfil
      </div>
    </Link>
  )
}
