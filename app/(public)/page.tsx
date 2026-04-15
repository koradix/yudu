import Link from 'next/link'
import { GraduationCap, Briefcase, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ExpertCard } from '@/components/expert-card'
import { HomeCategoryNav } from './category-nav-wrapper'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, slug, type, icon_name')
    .order('name')

  const { data: expertRows } = await supabase
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
    .limit(8)

  // Fetch min price per expert from offers
  const expertIds = expertRows?.map((e) => e.id) ?? []
  const { data: offerRows } = await supabase
    .from('offers')
    .select('expert_id, base_price, offer_type')
    .in('expert_id', expertIds)
    .eq('is_active', true)

  // Fetch skills per expert
  const { data: skillRows } = await supabase
    .from('expert_skills')
    .select('expert_id, skills(name, skill_categories(type))')
    .in('expert_id', expertIds)

  const experts = (expertRows ?? []).map((e) => {
    const profile = e.profiles as any
    const expertOffers = (offerRows ?? []).filter((o) => o.expert_id === e.id)
    const minPrice = expertOffers.length
      ? Math.min(...expertOffers.map((o) => Number(o.base_price)))
      : 0
    const offerTypes = [...new Set(expertOffers.map((o) => o.offer_type))]
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
    }
  })

  return (
    <div className="min-h-screen">
      {/* SEÇÃO 1 — Hero */}
      <section className="bg-gradient-to-br from-[#16213E] to-[#1A2B6D] px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Aprenda Fazendo.
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5A623] mt-1">
            Com Experts Reais.
          </h2>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-md">
            Conectamos aprendizes a experts que ensinam na prática.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/cadastrar"
              className="inline-flex items-center justify-center rounded-lg bg-[#F5A623] px-6 py-3 text-sm font-bold text-[#16213E] hover:bg-[#e0951c] transition"
            >
              Quero Aprender
            </Link>
            <Link
              href="/cadastrar"
              className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Sou Expert
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — Categorias */}
      <section className="bg-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-[#16213E] mb-4">
            Explore por categoria
          </h3>
          <HomeCategoryNav categories={categories ?? []} />
        </div>
      </section>

      {/* SEÇÃO 3 — Experts em Destaque */}
      <section className="bg-[#F7F8FC] px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-[#16213E]">
            Experts em destaque
          </h3>
          <p className="text-sm text-[#718096] mt-1">
            Profissionais verificados prontos para ensinar
          </p>
          {experts.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} {...expert} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#718096]">
              Experts serão exibidos aqui em breve.
            </p>
          )}
          <div className="mt-6 text-center">
            <Link
              href="/explorar"
              className="inline-flex items-center text-sm font-medium text-[#16213E] hover:underline"
            >
              Ver todos os experts →
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — Como Funciona */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-[22px] font-bold text-[#16213E] text-center mb-8">
            Como o YUDU funciona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F7F8FC] rounded-xl border border-[#D6DCE8] p-6">
              <GraduationCap className="h-8 w-8 text-[#F5A623] mb-3" />
              <h4 className="font-bold text-[#16213E] mb-2">Para Aprendizes</h4>
              <p className="text-sm text-[#718096]">
                Escolha uma habilidade, encontre um expert e aprenda fazendo na prática.
              </p>
            </div>
            <div className="bg-[#F7F8FC] rounded-xl border border-[#D6DCE8] p-6">
              <Briefcase className="h-8 w-8 text-[#1A2B6D] mb-3" />
              <h4 className="font-bold text-[#16213E] mb-2">Para Experts</h4>
              <p className="text-sm text-[#718096]">
                Ensine o que você sabe, aceite aprendizes e ganhe mais por sessão.
              </p>
            </div>
            <div className="bg-[#F7F8FC] rounded-xl border border-[#D6DCE8] p-6">
              <Building2 className="h-8 w-8 text-teal-600 mb-3" />
              <h4 className="font-bold text-[#16213E] mb-2">Para Clientes</h4>
              <p className="text-sm text-[#718096]">
                Contrate experts verificados com transparência de preço e qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — CTA Final */}
      <section className="bg-[#16213E] px-6 py-16 text-center">
        <h3 className="text-[28px] font-bold text-white">
          Pronto para começar?
        </h3>
        <p className="text-[#94A3B8] text-base mt-2 mb-8">
          Cadastre-se grátis e faça sua primeira sessão ainda essa semana.
        </p>
        <Link
          href="/cadastrar"
          className="inline-flex items-center justify-center rounded-lg bg-[#F5A623] px-8 py-4 text-lg font-bold text-[#16213E] hover:bg-[#e0951c] transition"
        >
          Criar conta grátis
        </Link>
      </section>
    </div>
  )
}
