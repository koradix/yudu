import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, Star } from 'lucide-react'
import { RatingDisplay } from '@/components/rating-display'
import { SkillBadge } from '@/components/skill-badge'
import { formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS } from '@/lib/constants'

interface PageProps {
  params: { id: string }
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const locationLabels: Record<string, string> = {
  remote: 'Remoto',
  in_person: 'Presencial',
  hybrid: 'Híbrido',
}

export default async function ExpertProfilePage({ params }: PageProps) {
  const supabase = createClient()

  // Fetch expert profile
  const { data: expert } = await supabase
    .from('expert_profiles')
    .select(`
      id,
      headline,
      bio,
      rating_avg,
      sessions_count,
      response_time_hours,
      user_id,
      profiles!inner(full_name, avatar_url, is_verified, created_at)
    `)
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (!expert) notFound()

  const profile = expert.profiles as any

  // Fetch offers, skills, reviews in parallel
  const [offersRes, skillsRes, reviewsRes] = await Promise.all([
    supabase
      .from('offers')
      .select('id, title, description, offer_type, base_price, duration_min, location_type')
      .eq('expert_id', expert.id)
      .eq('is_active', true)
      .order('base_price'),
    supabase
      .from('expert_skills')
      .select('skills(name, skill_categories(type))')
      .eq('expert_id', expert.id),
    supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
      `)
      .eq('reviewee_id', expert.user_id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const offers = offersRes.data ?? []
  const skills = (skillsRes.data ?? []).map((s) => ({
    name: (s.skills as any)?.name ?? '',
    type: ((s.skills as any)?.skill_categories as any)?.type ?? 'digital',
  }))
  const reviews = reviewsRes.data ?? []

  const minPrice = offers.length
    ? Math.min(...offers.map((o) => Number(o.base_price)))
    : 0

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-5xl mx-auto px-4 py-6 md:flex md:gap-6">
        {/* Main column */}
        <div className="flex-1 space-y-2">
          {/* SEÇÃO 1 — Header */}
          <div className="bg-white rounded-xl border border-[#D6DCE8] p-6">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-[#EEF1FA] flex items-center justify-center text-xl font-semibold text-[#1A2B6D]">
                    {getInitials(profile.full_name)}
                  </div>
                )}
                {profile.is_verified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 fill-[#F5A623] stroke-white" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-[22px] font-bold text-[#16213E]">{profile.full_name}</h1>
                <p className="text-sm text-[#718096] mt-0.5">{expert.headline}</p>
                <div className="mt-2">
                  <RatingDisplay
                    rating={Number(expert.rating_avg) || 0}
                    count={expert.sessions_count}
                    size="md"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <SkillBadge key={s.name} name={s.name} type={s.type as 'digital' | 'physical'} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2 — Sobre */}
          {expert.bio && (
            <div className="bg-white rounded-xl border border-[#D6DCE8] p-5">
              <h2 className="text-base font-bold text-[#16213E] mb-2">Sobre</h2>
              <p className="text-sm text-[#718096] leading-relaxed">{expert.bio}</p>
            </div>
          )}

          {/* SEÇÃO 3 — Ofertas */}
          {offers.length > 0 && (
            <div className="bg-white rounded-xl border border-[#D6DCE8] p-5">
              <h2 className="text-base font-bold text-[#16213E] mb-4">O que posso oferecer</h2>
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border border-[#D6DCE8] rounded-xl p-4"
                  >
                    <span className="inline-flex items-center rounded-md bg-[#EEF1FA] px-2 py-0.5 text-[11px] font-medium text-[#1A2B6D]">
                      {OFFER_TYPE_LABELS[offer.offer_type as keyof typeof OFFER_TYPE_LABELS] ?? offer.offer_type}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#16213E] mt-2">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-[13px] text-[#718096] mt-1 line-clamp-2">
                        {offer.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-[13px] text-[#718096]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {offer.duration_min}min
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {locationLabels[offer.location_type ?? 'remote'] ?? offer.location_type}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#16213E] mt-3">
                      {formatPrice(Number(offer.base_price))}
                    </p>
                    <Link
                      href={`/aprendiz/solicitar/${offer.id}`}
                      className="mt-3 flex items-center justify-center w-full rounded-lg bg-[#F5A623] py-2.5 text-sm font-bold text-[#16213E] hover:bg-[#e0951c] transition"
                    >
                      Solicitar →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO 4 — Avaliações */}
          <div className="bg-white rounded-xl border border-[#D6DCE8] p-5">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold text-[#16213E]">Avaliações</h2>
              <span className="text-sm font-bold text-[#F5A623]">
                {(Number(expert.rating_avg) || 0).toFixed(1)}
              </span>
              <span className="text-xs text-[#718096]">({expert.sessions_count})</span>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: any) => {
                  const reviewer = review.profiles
                  return (
                    <div key={review.id} className="border-b border-[#D6DCE8] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        {reviewer?.avatar_url ? (
                          <img
                            src={reviewer.avatar_url}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-[#EEF1FA] flex items-center justify-center text-xs font-semibold text-[#1A2B6D]">
                            {getInitials(reviewer?.full_name ?? '?')}
                          </div>
                        )}
                        <div>
                          <p className="text-[13px] font-bold text-[#16213E]">
                            {reviewer?.full_name}
                          </p>
                          <p className="text-[11px] text-[#718096]">
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? 'fill-[#F5A623] stroke-[#F5A623]'
                                : 'fill-gray-200 stroke-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-[13px] text-[#718096] italic mt-2">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#718096]">Ainda não há avaliações.</p>
            )}
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <aside className="hidden md:block md:w-[300px] shrink-0">
          <div className="sticky top-6 bg-white rounded-xl border border-[#D6DCE8] p-5">
            <div className="flex items-center gap-3">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-[#EEF1FA] flex items-center justify-center text-lg font-semibold text-[#1A2B6D]">
                  {getInitials(profile.full_name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-[#16213E] truncate">{profile.full_name}</p>
                <p className="text-xs text-[#718096] truncate">{expert.headline}</p>
              </div>
            </div>

            <div className="mt-3">
              <RatingDisplay
                rating={Number(expert.rating_avg) || 0}
                count={expert.sessions_count}
              />
            </div>

            {offers.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-[#718096]">a partir de</p>
                <p className="text-xl font-bold text-[#16213E]">
                  {formatPrice(minPrice)}
                </p>
              </div>
            )}

            <hr className="my-4 border-[#D6DCE8]" />

            <Link
              href={offers.length > 0 ? `/aprendiz/solicitar/${offers[0].id}` : '#'}
              className="flex items-center justify-center w-full rounded-lg bg-[#F5A623] py-3 text-sm font-bold text-[#16213E] hover:bg-[#e0951c] transition"
            >
              Solicitar sessão
            </Link>

            <button className="mt-2 flex items-center justify-center w-full rounded-lg border border-[#16213E] py-2 text-sm font-medium text-[#16213E] hover:bg-[#EEF1FA] transition">
              Ver disponibilidade
            </button>

            {expert.response_time_hours && (
              <p className="mt-3 text-xs text-[#718096] text-center flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Responde em ~{expert.response_time_hours}h
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
