import Link from 'next/link'
import { Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

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
  id, name, headline, avatarUrl, isVerified, ratingAvg, sessionsCount, minPrice, skills,
}: ExpertCardProps) {
  const mainSkill = skills[0]?.name ?? headline.split('·')[0]?.trim() ?? ''

  return (
    <Link
      href={`/expert/${id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all"
    >
      {/* Photo */}
      <div className="relative h-52 w-full bg-gray-100">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#263238]/20 to-[#263238]/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#263238]/30">{getInitials(name)}</span>
          </div>
        )}
        {isVerified && (
          <span className="absolute top-3 left-3 bg-white text-[#2E7D32] text-xs font-bold px-2.5 py-1 rounded-full border border-[#2E7D32]/30">
            VERIFICADO
          </span>
        )}
        {minPrice > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
            A partir de {formatPrice(minPrice)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-bold text-[#263238] text-base">{name}</p>
        <p className="text-sm text-[#2E7D32] font-medium mt-0.5">{mainSkill}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2 text-sm">
          <Star className="h-4 w-4 fill-[#B07D05] text-[#B07D05]" />
          <span className="font-bold text-[#B07D05]">{ratingAvg.toFixed(1)}</span>
          <span className="text-gray-400">({sessionsCount})</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mt-3">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill.name} className="bg-[#F7F8FC] text-[#263238] text-[11px] px-2 py-0.5 rounded-full border border-gray-200">
              {skill.name}
            </span>
          ))}
        </div>

        {/* Button */}
        <div className="mt-4 w-full bg-white border-2 border-[#263238] text-[#263238] font-semibold py-2.5 rounded-xl text-sm uppercase tracking-wide text-center group-hover:bg-[#263238] group-hover:text-white transition">
          Ver Perfil
        </div>
      </div>
    </Link>
  )
}
