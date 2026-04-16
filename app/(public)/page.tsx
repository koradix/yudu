import Link from 'next/link'
import { GraduationCap, Briefcase, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ExpertCard } from '@/components/expert-card'
import { HomeCategoryNav } from './category-nav-wrapper'

export default async function HomePage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, slug, type, icon_name')
    .order('name')

  const { data: expertRows } = await supabase
    .from('expert_profiles')
    .select(`
      id, headline, rating_avg, sessions_count, user_id,
      profiles!inner(full_name, avatar_url, is_verified)
    `)
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .limit(8)

  const expertIds = expertRows?.map((e) => e.id) ?? []

  const { data: offerRows } = await supabase
    .from('offers')
    .select('expert_id, base_price, offer_type')
    .in('expert_id', expertIds)
    .eq('is_active', true)

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
    }
  })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#263238] px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Aprenda Fazendo.
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-[#B07D05] mt-1">
            Com Experts Reais.
          </p>
          <p className="text-white/70 text-lg mt-4 max-w-lg mx-auto">
            Conectamos aprendizes a experts que ensinam na prática.
          </p>
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <Link href="/cadastrar" className="bg-[#B07D05] hover:bg-[#8f6604] text-white font-bold px-6 py-3 rounded-lg transition">
              Quero Aprender
            </Link>
            <Link href="/cadastrar" className="border border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition">
              Sou Expert
            </Link>
            <Link href="/entrar" className="text-white/60 hover:text-white font-medium px-4 py-3 transition">
              Já tenho conta →
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — Categorias */}
      <section className="bg-surface px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-black font-headline text-on-surface tracking-tighter mb-8 italic">
            Artesãos por Categoria
          </h3>
          <HomeCategoryNav categories={categories ?? []} />
        </div>
      </section>

      {/* SEÇÃO 3 — Experts em Destaque */}
      <section className="bg-surface-container-low px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h3 className="text-3xl font-black font-headline text-on-surface tracking-tighter">
                Mestres em Destaque
              </h3>
              <p className="text-sm text-on-surface-variant font-medium mt-2">
                Profissionais verificados prontos para passar o conhecimento adiante.
              </p>
            </div>
            <Link
              href="/explorar"
              className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
            >
              Ver todos os mestres <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {experts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} {...expert} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center editorial-shadow">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">person_search</span>
              <p className="text-on-surface-variant font-medium">Os mestres serão exibidos aqui em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 4 — Como Funciona */}
      <section className="bg-surface px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-4xl font-black font-headline text-on-surface tracking-tighter mb-4">
              Como o YUDU funciona
            </h3>
            <p className="text-on-surface-variant font-medium">
              Conectamos a sabedoria de quem faz com a vontade de quem quer aprender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/20 p-8 bento-card editorial-shadow text-left">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-primary-fixed text-2xl">school</span>
              </div>
              <h4 className="text-xl font-black font-headline text-on-surface tracking-tighter mb-3">Para Aprendizes</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                Escolha uma habilidade real, encontre um mestre e aprenda fazendo diretamente no campo ou na oficina.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/20 p-8 bento-card editorial-shadow text-left">
              <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-secondary-fixed text-2xl">construction</span>
              </div>
              <h4 className="text-xl font-black font-headline text-on-surface tracking-tighter mb-3">Para Mestres</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                Compartilhe o seu ofício, receba aprendizes em suas sessões de trabalho e valorize ainda mais a sua mão de obra.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/20 p-8 bento-card editorial-shadow text-left">
              <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-tertiary-fixed text-2xl">handshake</span>
              </div>
              <h4 className="text-xl font-black font-headline text-on-surface tracking-tighter mb-3">Parceria & Ética</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                Ambiente seguro com verificação de antecedentes, avaliações reais e foco total no aprendizado prático.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — CTA Final */}
      <section className="bg-surface-container-low px-6 py-20">
        <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden editorial-shadow">
          {/* Elemento Decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-surface-tint opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <h3 className="text-4xl md:text-5xl font-black font-headline text-white tracking-tighter leading-none relative z-10">
            Pronto para sair da teoria e entrar na <span className="italic">oficina?</span>
          </h3>
          <p className="text-on-primary-container/80 text-lg mt-6 mb-10 max-w-xl mx-auto relative z-10 font-body">
            Cadastre-se grátis e conecte-se com o mestre que vai transformar sua forma de trabalhar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              href="/cadastrar"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-lg font-black font-headline text-primary hover:bg-surface-container-lowest transition-all duration-300 editorial-shadow hover:scale-105"
            >
              Criar conta agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
