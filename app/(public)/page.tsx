import Link from 'next/link'
import Image from 'next/image'
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
    const minPrice = expertOffers.length ? Math.min(...expertOffers.map((o) => Number(o.base_price))) : 0
    const offerTypes = Array.from(new Set(expertOffers.map((o) => o.offer_type)))
    const expertSkills = (skillRows ?? [])
      .filter((s) => s.expert_id === e.id)
      .map((s) => ({ name: (s.skills as any)?.name ?? '', type: ((s.skills as any)?.skill_categories as any)?.type ?? 'digital' }))
    return {
      id: e.id, name: profile.full_name, headline: e.headline ?? '', avatarUrl: profile.avatar_url,
      isVerified: profile.is_verified ?? false, ratingAvg: Number(e.rating_avg) || 0,
      sessionsCount: e.sessions_count, minPrice, offerTypes, skills: expertSkills,
    }
  })

  const iconMap: Record<string, string> = {
    Palette: 'palette', Code2: 'code', Video: 'videocam', TrendingUp: 'trending_up',
    Zap: 'bolt', Camera: 'photo_camera', Hammer: 'hardware', Droplets: 'water_drop',
    Scissors: 'content_cut', ChefHat: 'restaurant', Paintbrush: 'brush', Wrench: 'build',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-bold italic text-[#2E7D32] tracking-tight">YUDU</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/explorar" className="text-gray-500 hover:text-[#263238] transition">Explorar</Link>
            <Link href="/cadastrar" className="text-gray-500 hover:text-[#263238] transition">Seja Expert</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/entrar" className="text-sm font-medium text-gray-500 hover:text-[#263238] transition">Entrar</Link>
            <Link href="/cadastrar" className="bg-[#2E7D32] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1b5e20] transition">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1C2B30]">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"
          alt="Workshop profissional"
          fill
          className="opacity-30 object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C2B30] via-[#1C2B30]/80 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <span className="inline-flex items-center gap-2 bg-[#B07D05]/20 text-[#B07D05] border border-[#B07D05]/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            ✦ Plataforma de aprendizado prático
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
            O que você quer<br />
            <DynamicWord /><br />
            hoje?
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed">
            Conectamos você a profissionais reais. Aprenda instalando, construindo e criando — não apenas assistindo.
          </p>

          <HeroSearchBar />

          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4 text-[#B07D05]" /> 2.000+ aprendizes
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-[#B07D05]" /> Experts verificados
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-[#B07D05]" /> Digital e presencial
            </span>
          </div>

          <div className="mt-8">
            <Link href="/cadastrar" className="text-[#B07D05] hover:underline text-sm font-medium">
              Sou expert →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-[#263238]">Categorias Populares</h2>
              <div className="w-12 h-1 bg-[#2E7D32] mt-2" />
            </div>
            <Link href="/explorar" className="text-[#2E7D32] font-semibold text-sm hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(categories ?? []).slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/explorar?categoria=${cat.slug}`}
                className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2E7D32]/40 hover:shadow-md transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#2E7D32] text-xl">
                    {iconMap[cat.icon_name ?? ''] ?? 'category'}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#263238]">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{cat.type === 'digital' ? 'Digital' : 'Presencial'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Experts */}
      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-[#263238]">Experts em Destaque</h2>
              <p className="text-sm text-gray-500 mt-1">Profissionais verificados prontos para ensinar</p>
            </div>
            <Link href="/explorar" className="text-[#2E7D32] font-semibold text-sm hover:underline">
              Ver todos →
            </Link>
          </div>
          {experts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} {...expert} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-500">Experts serão exibidos aqui em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#263238] text-center">Planos de Aprendizado</h2>
          <p className="text-gray-500 text-center mt-2">Horas práticas em campo com experts reais. Escolha seu plano.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Starter */}
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#263238]">Starter</h3>
              <p className="text-3xl font-extrabold text-[#263238] mt-3">R$ 197<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5 shrink-0" />4h de aprendizado prático</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5 shrink-0" />1 área de conhecimento</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5 shrink-0" />Acesso ao expert verificado</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5 shrink-0" />Chat com o expert</li>
              </ul>
              <Link href="/cadastrar" className="mt-8 block w-full text-center border-2 border-[#263238] text-[#263238] font-semibold py-3 rounded-xl hover:bg-[#263238] hover:text-white transition">
                Começar
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-white border-2 border-[#B07D05] rounded-2xl p-8">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B07D05] text-white text-xs font-bold rounded-full px-3 py-1">
                MAIS POPULAR
              </span>
              <h3 className="text-xl font-bold text-[#263238]">Pro</h3>
              <p className="text-3xl font-extrabold text-[#263238] mt-3">R$ 397<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] mt-0.5 shrink-0" />12h de aprendizado prático</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] mt-0.5 shrink-0" />Até 3 áreas diferentes</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] mt-0.5 shrink-0" />Experts ilimitados</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] mt-0.5 shrink-0" />Acompanhamento de progresso</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] mt-0.5 shrink-0" />Certificado de horas práticas</li>
              </ul>
              <Link href="/cadastrar" className="mt-8 block w-full text-center bg-[#B07D05] text-white font-semibold py-3 rounded-xl hover:bg-[#8f6604] transition">
                Começar
              </Link>
            </div>

            {/* Master */}
            <div className="relative bg-white border-2 border-[#263238] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#263238]">Master</h3>
              <p className="text-3xl font-extrabold text-[#263238] mt-3">R$ 697<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#263238] mt-0.5 shrink-0" />30h de aprendizado prático</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#263238] mt-0.5 shrink-0" />Áreas ilimitadas</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#263238] mt-0.5 shrink-0" />Expert dedicado</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#263238] mt-0.5 shrink-0" />Jornada personalizada com IA (em breve)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#263238] mt-0.5 shrink-0" />Certificado reconhecido</li>
              </ul>
              <Link href="/cadastrar" className="mt-8 block w-full text-center bg-[#263238] text-white font-semibold py-3 rounded-xl hover:bg-[#1a2327] transition">
                Começar
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-400 text-center mt-6">
            Sem contrato. Cancele quando quiser. Horas não usadas acumulam por 30 dias.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#F7F8FC]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#263238] mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-[#2E7D32] text-2xl">search</span>
              </div>
              <h3 className="font-bold text-lg text-[#263238] mb-2">1. Escolha o que quer aprender</h3>
              <p className="text-sm text-gray-500">Digital ou presencial. Técnico ou criativo. Você decide.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-[#B07D05]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-[#B07D05] text-2xl">handshake</span>
              </div>
              <h3 className="font-bold text-lg text-[#263238] mb-2">2. Conecte com um expert real</h3>
              <p className="text-sm text-gray-500">Profissional verificado que já faz no dia a dia.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-[#263238]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-[#263238] text-2xl">school</span>
              </div>
              <h3 className="font-bold text-lg text-[#263238] mb-2">3. Aprenda na prática</h3>
              <p className="text-sm text-gray-500">Não apenas teoria. Você vai junto, faz junto, aprende junto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#263238]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 mb-8">Cadastre-se grátis e agende sua primeira sessão ainda essa semana.</p>
          <Link href="/cadastrar" className="bg-[#B07D05] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#8f6604] transition inline-block">
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-xl font-bold italic text-[#2E7D32]">YUDU</span>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">Conectando experts e aprendizes. Qualidade verificada, aprendizado real.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <h5 className="font-bold text-[#263238] mb-3">Marketplace</h5>
              <ul className="text-gray-400 space-y-2">
                <li><Link href="/explorar" className="hover:text-[#2E7D32] transition">Explorar</Link></li>
                <li><Link href="/cadastrar" className="hover:text-[#2E7D32] transition">Seja Expert</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-[#263238] mb-3">Legal</h5>
              <ul className="text-gray-400 space-y-2">
                <li><span className="hover:text-[#2E7D32] transition cursor-pointer">Privacidade</span></li>
                <li><span className="hover:text-[#2E7D32] transition cursor-pointer">Termos</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
