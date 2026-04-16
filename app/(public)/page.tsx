import Link from 'next/link'
import { CheckCircle, Users, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ExpertCard } from '@/components/expert-card'
import { DynamicWord } from '@/components/dynamic-word'
import { HeroSearchBar } from '@/components/hero-search-bar'
import { HomeCategoryNav } from './category-nav-wrapper'

export default async function HomePage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, slug, type, icon_name')
    .order('name')

  const { data: expertRows } = await supabase
    .from('expert_profiles')
    .select(`id, headline, rating_avg, sessions_count, user_id, profiles!inner(full_name, avatar_url, is_verified)`)
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .limit(6)

  const expertIds = expertRows?.map((e) => e.id) ?? []
  const { data: offerRows } = await supabase.from('offers').select('expert_id, base_price, offer_type').in('expert_id', expertIds).eq('is_active', true)
  const { data: skillRows } = await supabase.from('expert_skills').select('expert_id, skills(name, skill_categories(type))').in('expert_id', expertIds)

  const experts = (expertRows ?? []).map((e) => {
    const profile = e.profiles as any
    const eo = (offerRows ?? []).filter((o) => o.expert_id === e.id)
    const minPrice = eo.length ? Math.min(...eo.map((o) => Number(o.base_price))) : 0
    const offerTypes = Array.from(new Set(eo.map((o) => o.offer_type)))
    const sk = (skillRows ?? []).filter((s) => s.expert_id === e.id).map((s) => ({ name: (s.skills as any)?.name ?? '', type: ((s.skills as any)?.skill_categories as any)?.type ?? 'digital' }))
    return { id: e.id, name: profile.full_name, headline: e.headline ?? '', avatarUrl: profile.avatar_url, isVerified: profile.is_verified ?? false, ratingAvg: Number(e.rating_avg) || 0, sessionsCount: e.sessions_count, minPrice, offerTypes, skills: sk }
  })

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-black italic text-primary font-headline tracking-tighter">YUDU</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-body">
            <Link href="/explorar" className="text-on-surface-variant hover:text-primary transition">Explorar</Link>
            <Link href="/cadastrar" className="text-on-surface-variant hover:text-primary transition">Seja Expert</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/entrar" className="text-sm font-medium text-on-surface-variant hover:text-primary transition">Entrar</Link>
            <Link href="/cadastrar" className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-surface-tint transition font-headline">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — clean, no image */}
      <section className="bg-surface-container-low py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-tertiary-fixed/30 text-tertiary border border-tertiary-fixed-dim/30 rounded-full px-4 py-1.5 text-sm font-bold font-headline mb-6">
            ✦ Plataforma de aprendizado prático
          </span>

          <h1 className="text-5xl md:text-7xl font-black font-headline text-on-surface tracking-tighter leading-[1.05] mb-6">
            O que você quer<br />
            <DynamicWord /><br />
            hoje?
          </h1>

          <p className="text-lg text-on-surface-variant max-w-xl font-body leading-relaxed mb-10">
            Conectamos você a profissionais reais. Aprenda instalando, construindo e criando — não apenas assistindo.
          </p>

          <HeroSearchBar />

          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
            <span className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Users className="w-4 h-4 text-tertiary" /> 2.000+ aprendizes
            </span>
            <span className="flex items-center gap-2 text-sm text-on-surface-variant">
              <CheckCircle className="w-4 h-4 text-primary" /> Experts verificados
            </span>
            <span className="flex items-center gap-2 text-sm text-on-surface-variant">
              <MapPin className="w-4 h-4 text-tertiary" /> Digital e presencial
            </span>
          </div>

          <div className="mt-6">
            <Link href="/cadastrar" className="text-tertiary hover:underline text-sm font-bold font-headline">
              Sou expert →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter">Categorias</h2>
              <div className="w-12 h-1 bg-primary mt-2 rounded-full" />
            </div>
            <Link href="/explorar" className="text-primary font-bold text-sm hover:underline font-headline">Ver todas →</Link>
          </div>
          <HomeCategoryNav categories={categories ?? []} />
        </div>
      </section>

      {/* Experts */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter">Experts em Destaque</h2>
              <p className="text-sm text-on-surface-variant mt-1 font-body">Profissionais verificados prontos para ensinar</p>
            </div>
            <Link href="/explorar" className="text-primary font-bold text-sm hover:underline font-headline">Ver todos →</Link>
          </div>
          {experts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => <ExpertCard key={expert.id} {...expert} />)}
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-DEFAULT p-12 text-center editorial-shadow">
              <p className="text-on-surface-variant">Experts serão exibidos aqui em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter">Planos de Aprendizado</h2>
          <p className="text-on-surface-variant mt-2 font-body">Horas práticas em campo com experts reais.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
            {/* Starter */}
            <div className="bg-surface-container-lowest border-2 border-outline-variant/30 rounded-lg p-8 editorial-shadow">
              <h3 className="text-xl font-black font-headline text-on-surface">Starter</h3>
              <p className="text-3xl font-black font-headline text-on-surface mt-3">R$ 197<span className="text-base font-normal text-on-surface-variant">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-on-surface-variant font-body">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />4h de aprendizado prático</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />1 área de conhecimento</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />Expert verificado</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />Chat com o expert</li>
              </ul>
              <Link href="/cadastrar" className="mt-8 block w-full text-center border-2 border-on-surface text-on-surface font-black font-headline text-xs uppercase tracking-widest py-3 rounded-DEFAULT hover:bg-on-surface hover:text-surface-container-lowest transition">
                Começar
              </Link>
            </div>
            {/* Pro */}
            <div className="relative bg-surface-container-lowest border-2 border-tertiary rounded-lg p-8 editorial-shadow">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary text-tertiary-foreground text-xs font-black font-headline rounded-full px-4 py-1 uppercase tracking-wider">
                Mais Popular
              </span>
              <h3 className="text-xl font-black font-headline text-on-surface">Pro</h3>
              <p className="text-3xl font-black font-headline text-on-surface mt-3">R$ 397<span className="text-base font-normal text-on-surface-variant">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-on-surface-variant font-body">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />12h de aprendizado prático</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />Até 3 áreas diferentes</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />Experts ilimitados</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />Acompanhamento de progresso</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />Certificado de horas</li>
              </ul>
              <Link href="/cadastrar" className="mt-8 block w-full text-center bg-tertiary text-tertiary-foreground font-black font-headline text-xs uppercase tracking-widest py-3 rounded-DEFAULT hover:bg-tertiary-container transition">
                Começar
              </Link>
            </div>
            {/* Master */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-lg p-8 editorial-shadow">
              <h3 className="text-xl font-black font-headline text-on-surface">Master</h3>
              <p className="text-3xl font-black font-headline text-on-surface mt-3">R$ 697<span className="text-base font-normal text-on-surface-variant">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-on-surface-variant font-body">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-on-surface mt-0.5 shrink-0" />30h de aprendizado prático</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-on-surface mt-0.5 shrink-0" />Áreas ilimitadas</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-on-surface mt-0.5 shrink-0" />Expert dedicado</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-on-surface mt-0.5 shrink-0" />Jornada com IA (em breve)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-on-surface mt-0.5 shrink-0" />Certificado reconhecido</li>
              </ul>
              <Link href="/cadastrar" className="mt-8 block w-full text-center bg-on-surface text-surface-container-lowest font-black font-headline text-xs uppercase tracking-widest py-3 rounded-DEFAULT hover:opacity-90 transition">
                Começar
              </Link>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant text-center mt-6 font-body">Sem contrato. Cancele quando quiser. Horas acumulam por 30 dias.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-DEFAULT border border-outline-variant/20 editorial-shadow bento-card">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-on-primary-fixed text-2xl">search</span>
              </div>
              <h3 className="font-black font-headline text-lg text-on-surface mb-2">1. Escolha</h3>
              <p className="text-sm text-on-surface-variant font-body">Digital ou presencial. Técnico ou criativo. Você decide.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-DEFAULT border border-outline-variant/20 editorial-shadow bento-card">
              <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-on-tertiary-fixed text-2xl">handshake</span>
              </div>
              <h3 className="font-black font-headline text-lg text-on-surface mb-2">2. Conecte</h3>
              <p className="text-sm text-on-surface-variant font-body">Profissional verificado que já faz no dia a dia.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-DEFAULT border border-outline-variant/20 editorial-shadow bento-card">
              <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-on-surface text-2xl">school</span>
              </div>
              <h3 className="font-black font-headline text-lg text-on-surface mb-2">3. Aprenda</h3>
              <p className="text-sm text-on-surface-variant font-body">Você vai junto, faz junto, aprende junto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black font-headline text-on-primary mb-4 tracking-tighter">Pronto para começar?</h2>
          <p className="text-on-primary/70 mb-8 font-body">Cadastre-se grátis e agende sua primeira sessão.</p>
          <Link href="/cadastrar" className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full text-lg font-black font-headline hover:bg-primary-fixed transition inline-block tracking-tight">
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-xl font-black italic text-primary font-headline tracking-tighter">YUDU</span>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xs font-body">Conectando experts e aprendizes. Qualidade verificada.</p>
          </div>
          <div className="flex gap-12 text-sm font-body">
            <div>
              <h5 className="font-bold text-on-surface mb-3">Marketplace</h5>
              <ul className="text-on-surface-variant space-y-2">
                <li><Link href="/explorar" className="hover:text-primary transition">Explorar</Link></li>
                <li><Link href="/cadastrar" className="hover:text-primary transition">Seja Expert</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-on-surface mb-3">Legal</h5>
              <ul className="text-on-surface-variant space-y-2">
                <li><span className="hover:text-primary transition cursor-pointer">Privacidade</span></li>
                <li><span className="hover:text-primary transition cursor-pointer">Termos</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
