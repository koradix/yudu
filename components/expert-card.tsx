import Link from 'next/link'
import { Star, Bookmark } from 'lucide-react'
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
  id, name, headline, avatarUrl, isVerified, ratingAvg, minPrice, skills,
}: ExpertCardProps) {
  const mainSkill = skills[0]?.name ?? headline.split('·')[0]?.trim() ?? ''

  return (
    <Link
      href={`/expert/${id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Photo */}
      <div className="relative w-full h-48 bg-gray-100">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary/60">{getInitials(name)}</span>
          </div>
        )}
        {isVerified && (
          <span className="absolute top-3 left-3 bg-white text-[#2E7D32] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#2E7D32]">
            VERIFICADO
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5">
          <Bookmark className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        {/* Name + Rating */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[#263238] text-base truncate">{name}</p>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-[#B07D05] text-[#B07D05]" />
            <span className="text-sm font-medium text-[#263238]">{ratingAvg.toFixed(1)}</span>
          </div>
        </div>

        {/* Specialty */}
        <p className="text-sm text-[#2E7D32] font-medium">{mainSkill}</p>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{headline}</p>

        {/* Separator + Price */}
        <div className="border-t border-gray-100 mt-2 pt-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">A partir de</p>
          <p className="text-base font-bold text-[#263238]">{formatPrice(minPrice)}/h</p>
        </div>

        {/* Button */}
        <button className="mt-2 w-full bg-[#2E7D32] hover:bg-[#1b5e20] text-white text-sm font-semibold py-2 rounded-lg transition">
          Ver Perfil
        </button>
      </div>
    </Link>
  )
}
