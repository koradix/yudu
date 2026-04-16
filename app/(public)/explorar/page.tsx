import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExpertCard } from '@/components/expert-card'
import { ExplorarFilters } from './filters'

interface PageProps {
  searchParams: { categoria?: string; tipo?: string; mundo?: string }
}

export default async function ExplorarPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const categoriaSlug = searchParams.categoria ?? null
  const tipoFilter = searchParams.tipo ?? null
  const mundoFilter = searchParams.mundo ?? null

  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, slug, type, icon_name')
    .order('name')

  // Filter by mundo (digital/physical) → get category IDs
  let categoryIds: string[] | null = null
  if (mundoFilter) {
    categoryIds = (categories ?? [])
      .filter((c) => c.type === mundoFilter)
      .map((c) => c.id)
  }

  // Filter by categoria slug → get skill IDs → get expert IDs
  let filteredExpertIds: string[] | null = null

  if (categoriaSlug) {
    const { data: catSkills } = await supabase
      .from('skills')
      .select('id, skill_categories!inner(slug)')
      .eq('skill_categories.slug', categoriaSlug)

    const skillIds = (catSkills ?? []).map((s) => s.id)
    if (skillIds.length > 0) {
      const { data: rows } = await supabase
        .from('expert_skills')
        .select('expert_id')
        .in('skill_id', skillIds)
      filteredExpertIds = Array.from(new Set((rows ?? []).map((r) => r.expert_id)))
    } else {
      filteredExpertIds = []
    }
  } else if (mundoFilter && categoryIds) {
    // Filter by mundo → get skills in those categories → expert IDs
    const { data: worldSkills } = await supabase
      .from('skills')
      .select('id')
      .in('category_id', categoryIds)

    const skillIds = (worldSkills ?? []).map((s) => s.id)
    if (skillIds.length > 0) {
      const { data: rows } = await supabase
        .from('expert_skills')
        .select('expert_id')
        .in('skill_id', skillIds)
      filteredExpertIds = Array.from(new Set((rows ?? []).map((r) => r.expert_id)))
    } else {
      filteredExpertIds = []
    }
  }

  let expertQuery = supabase
    .from('expert_profiles')
    .select(`id, headline, rating_avg, sessions_count, user_id, profiles!inner(full_name, avatar_url, is_verified)`)
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })

  if (filteredExpertIds !== null) {
    if (filteredExpertIds.length === 0) {
      return renderPage([], categories ?? [], 0, categoriaSlug, tipoFilter, mundoFilter)
    }
    expertQuery = expertQuery.in('id', filteredExpertIds)
  }

  const { data: expertRows } = await expertQuery
  const expertIds = (expertRows ?? []).map((e) => e.id)

  let offersQuery = supabase
    .from('offers')
    .select('expert_id, base_price, offer_type')
    .in('expert_id', expertIds)
    .eq('is_active', true)

  if (tipoFilter) {
    offersQuery = offersQuery.eq('offer_type', tipoFilter as any)
  }

  const { data: offerRows } = await offersQuery

  const { data: skillRows } = await supabase
    .from('expert_skills')
    .select('expert_id, skills(name, skill_categories(type))')
    .in('expert_id', expertIds)

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
      id: e.id, name: profile.full_name, headline: e.headline ?? '',
      avatarUrl: profile.avatar_url, isVerified: profile.is_verified ?? false,
      ratingAvg: Number(e.rating_avg) || 0, sessionsCount: e.sessions_count,
      minPrice, offerTypes, skills: expertSkills, hasOffers: expertOffers.length > 0,
    }
  })

  if (tipoFilter) experts = experts.filter((e) => e.hasOffers)

  return renderPage(experts, categories ?? [], experts.length, categoriaSlug, tipoFilter, mundoFilter)
}

function renderPage(
  experts: any[], categories: any[], count: number,
  categoriaSlug: string | null, tipoFilter: string | null, mundoFilter: string | null
) {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-[#263238]">Descobrir Mestres</h1>
          <p className="text-sm text-gray-500 mt-1">
            Conecte-se com profissionais verificados para elevar o nível dos seus projetos.
            {count > 0 && <span className="font-medium"> {count} encontrados.</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ExplorarFilters
        categories={categories}
        activeCategoria={categoriaSlug}
        activeTipo={tipoFilter}
        activeMundo={mundoFilter}
      />

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {experts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} {...expert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-gray-400">person_search</span>
            </div>
            <h3 className="text-lg font-semibold text-[#263238] mb-2">Nenhum mestre encontrado</h3>
            <p className="text-gray-500 text-sm mb-6">Tente ajustar os filtros ou explorar outras categorias.</p>
            <Link
              href="/explorar"
              className="inline-flex items-center border border-gray-200 px-5 py-2 rounded-lg text-sm font-medium text-[#263238] hover:bg-gray-50 transition"
            >
              Limpar filtros
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
