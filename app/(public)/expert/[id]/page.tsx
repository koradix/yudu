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
    <div className="min-h-screen bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 py-12 md:flex md:gap-12">
        {/* Main column */}
        <div className="flex-1 space-y-8">
          {/* SEÇÃO 1 — Profile Header Block */}
          <div className="bg-surface-container-lowest rounded-[3rem] p-8 md:p-12 editorial-shadow bento-card relative overflow-hidden active-theme-transition">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-surface"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-fixed flex items-center justify-center text-3xl font-black font-headline text-on-primary-fixed">
                    {getInitials(profile.full_name)}
                  </div>
                )}
                {profile.is_verified && (
                  <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md">
                    <span className="material-symbols-outlined text-primary text-[28px] block" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center md:text-left min-w-0">
                <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tighter leading-none mb-2">
                  {profile.full_name}
                </h1>
                <p className="text-lg text-on-surface-variant font-medium tracking-tight mb-4">
                  {expert.headline}
                </p>
                <div className="flex justify-center md:justify-start">
                  <RatingDisplay
                    rating={Number(expert.rating_avg) || 0}
                    count={expert.sessions_count}
                    size="md"
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                  {skills.map((s) => (
                    <SkillBadge key={s.name} name={s.name} type={s.type as 'digital' | 'physical'} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2 — Sobre (Editorial Style) */}
          {expert.bio && (
            <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 editorial-shadow">
              <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter mb-4 italic">
                O Legado e o Ofício
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed font-body">
                {expert.bio}
              </p>
            </div>
          )}

          {/* SEÇÃO 3 — Ofertas (Bento Grid) */}
          {offers.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter mb-4 px-4">
                Programas de Mentoria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-surface-container-lowest rounded-[2rem] p-8 editorial-shadow bento-card border border-outline-variant/10 flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center rounded-lg bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">
                        {OFFER_TYPE_LABELS[offer.offer_type as keyof typeof OFFER_TYPE_LABELS] ?? offer.offer_type}
                      </span>
                      <span className="font-black font-headline text-xl text-primary tracking-tighter">
                        {formatPrice(Number(offer.base_price))}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black font-headline text-on-surface tracking-tighter mb-2">
                      {offer.title}
                    </h3>
                    
                    {offer.description && (
                      <p className="text-sm text-on-surface-variant leading-relaxed flex-1">
                        {offer.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 mt-6 pb-6 border-b border-outline-variant/20 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {offer.duration_min}min
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {locationLabels[offer.location_type ?? 'remote'] ?? offer.location_type}
                      </span>
                    </div>

                    <Link
                      href={`/aprendiz/solicitar/${offer.id}`}
                      className="mt-6 flex items-center justify-center w-full rounded-xl bg-primary py-4 text-xs font-black font-headline uppercase tracking-[0.2em] text-white hover:bg-surface-tint transition-all duration-300 editorial-shadow hover:scale-[1.02]"
                    >
                      Solicitar Sessão
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO 4 — Avaliações */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 editorial-shadow">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter">Depoimentos Reais</h2>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-headline text-primary">
                  {(Number(expert.rating_avg) || 0).toFixed(1)}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  ({expert.sessions_count} sessões)
                </span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review: any) => {
                  const reviewer = review.profiles
                  return (
                    <div key={review.id} className="border-b border-outline-variant/10 pb-8 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4 mb-3">
                        {reviewer?.avatar_url ? (
                          <img
                            src={reviewer.avatar_url}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover border border-outline-variant/20"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-xs font-black font-headline text-on-surface-variant">
                            {getInitials(reviewer?.full_name ?? '?')}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-black font-headline text-on-surface tracking-tight leading-none">
                            {reviewer?.full_name}
                          </p>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`material-symbols-outlined text-[16px] ${i < review.rating ? 'text-primary' : 'text-outline-variant'}`}
                            style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </div>

                      {review.comment && (
                        <p className="text-sm text-on-surface-variant font-medium leading-relaxed italic">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Ainda não há avaliações de oficina.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block lg:w-[350px] shrink-0">
          <div className="sticky top-28 bg-surface-container-lowest rounded-[2.5rem] p-8 editorial-shadow border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-6">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-surface"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-fixed flex items-center justify-center text-xl font-black font-headline text-on-primary-fixed">
                  {getInitials(profile.full_name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-black font-headline text-on-surface tracking-tighter truncate">{profile.full_name}</p>
                <p className="text-xs font-bold text-on-surface-variant tracking-tight truncate">{expert.headline}</p>
              </div>
            </div>

            <div className="mb-6">
              <RatingDisplay
                rating={Number(expert.rating_avg) || 0}
                count={expert.sessions_count}
              />
            </div>

            {offers.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">A partir de</p>
                <p className="text-3xl font-black font-headline text-primary tracking-tighter leading-none">
                  {formatPrice(minPrice)}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Link
                href={offers.length > 0 ? `/aprendiz/solicitar/${offers[0].id}` : '#'}
                className="flex items-center justify-center w-full rounded-2xl bg-primary py-5 text-sm font-black font-headline uppercase tracking-[0.2em] text-white hover:bg-surface-tint transition-all duration-300 editorial-shadow"
              >
                Solicitar Sessão
              </Link>

              <button className="flex items-center justify-center w-full rounded-2xl border-2 border-on-surface/10 py-4 text-xs font-black font-headline uppercase tracking-[0.2em] text-on-surface hover:bg-surface-container-low transition-all duration-300">
                Ver Disponibilidade
              </button>
            </div>

            {expert.response_time_hours && (
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Responde em ~{expert.response_time_hours}h
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
