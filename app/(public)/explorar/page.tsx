import { createClient } from '@/lib/supabase/server'
import { ExpertCard } from '@/components/expert-card'
import { ExplorarFilters } from './filters'

interface PageProps {
  searchParams: { categoria?: string; tipo?: string; preco_max?: string }
}

export default async function ExplorarPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const categoriaSlug = searchParams.categoria ?? null
  const tipoFilter = searchParams.tipo ?? null

  // Fetch categories for nav
  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, slug, type, icon_name')
    .order('name')

  // Build expert query
  let expertQuery = supabase
    .from('expert_profiles')
    .select(`
      id,
      headline,
      rating_avg,
      sessions_count,
      user_id,
      profiles!inner(full_name, avatar_url, is_verified)
    `)
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })

  // If filtering by category, get expert IDs that have skills in that category
  let filteredExpertIds: string[] | null = null

  if (categoriaSlug) {
    const { data: catSkills } = await supabase
      .from('skills')
      .select('id, skill_categories!inner(slug)')
      .eq('skill_categories.slug', categoriaSlug)

    const skillIds = (catSkills ?? []).map((s) => s.id)

    if (skillIds.length > 0) {
      const { data: expertSkillRows } = await supabase
        .from('expert_skills')
        .select('expert_id')
        .in('skill_id', skillIds)

      filteredExpertIds = Array.from(new Set((expertSkillRows ?? []).map((r) => r.expert_id)))
    } else {
      filteredExpertIds = []
    }
  }

  if (filteredExpertIds !== null) {
    if (filteredExpertIds.length === 0) {
      // No experts match — return empty
      return renderPage([], categories ?? [], 0, categoriaSlug, tipoFilter)
    }
    expertQuery = expertQuery.in('id', filteredExpertIds)
  }

  const { data: expertRows } = await expertQuery

  const expertIds = (expertRows ?? []).map((e) => e.id)

  // Fetch offers
  let offersQuery = supabase
    .from('offers')
    .select('expert_id, base_price, offer_type')
    .in('expert_id', expertIds)
    .eq('is_active', true)

  if (tipoFilter) {
    offersQuery = offersQuery.eq('offer_type', tipoFilter)
  }

  const { data: offerRows } = await offersQuery

  // Fetch skills per expert
  const { data: skillRows } = await supabase
    .from('expert_skills')
    .select('expert_id, skills(name, skill_categories(type))')
    .in('expert_id', expertIds)

  // Build expert list — only include experts that have offers matching the filter
  let experts = (expertRows ?? []).map((e) => {
    const profile = e.profiles as any
    const expertOffers = (offerRows ?? []).filter((o) => o.expert_id === e.id)
    const minPrice = expertOffers.length
      ? Math.min(...expertOffers.map((o) => Number(o.base_price)))
      : 0
    const offerTypes = Array.from(new Set(expertOffers.map((o) => o.offer_type)))
    const expertSkills = (skillRows ?? [])
      .filter((s) => s.expert_id === e.id)
      .map((s) => ({
        name: (s.skills as any)?.name ?? '',
        type: ((s.skills as any)?.skill_categories as any)?.type ?? 'digital',
      }))

    return {
      id: e.id,
      name: profile.full_name,
      headline: e.headline ?? '',
      avatarUrl: profile.avatar_url,
      isVerified: profile.is_verified ?? false,
      ratingAvg: Number(e.rating_avg) || 0,
      sessionsCount: e.sessions_count,
      minPrice,
      offerTypes,
      skills: expertSkills,
      hasOffers: expertOffers.length > 0,
    }
  })

  // If filtering by tipo, only show experts that have matching offers
  if (tipoFilter) {
    experts = experts.filter((e) => e.hasOffers)
  }

  return renderPage(experts, categories ?? [], experts.length, categoriaSlug, tipoFilter)
}

function renderPage(
  experts: any[],
  categories: any[],
  count: number,
  categoriaSlug: string | null,
  tipoFilter: string | null
) {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* Header */}
      <div className="bg-white border-b border-[#D6DCE8] px-6 py-4">
        <h1 className="text-xl font-bold text-[#16213E]">Encontre um Expert</h1>
        <p className="text-sm text-[#718096]">{count} experts disponíveis</p>
      </div>

      {/* Filters */}
      <ExplorarFilters
        categories={categories}
        activeCategoria={categoriaSlug}
        activeTipo={tipoFilter}
      />

      {/* Grid */}
      <div className="px-6 py-5">
        {experts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} {...expert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-[#718096] mb-4">
              Nenhum expert encontrado para essa busca.
            </p>
            <a
              href="/explorar"
              className="inline-flex items-center rounded-lg border border-[#D6DCE8] px-5 py-2 text-sm font-medium text-[#16213E] hover:bg-[#EEF1FA] transition"
            >
              Ver todos
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
