import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExpertCard } from '@/components/expert-card'

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

  const iconMap: Record<string, string> = {
    Palette: 'palette', Code2: 'code', Video: 'videocam', TrendingUp: 'trending_up',
    Zap: 'bolt', Camera: 'photo_camera', Hammer: 'hardware', Droplets: 'water_drop',
    Scissors: 'content_cut', ChefHat: 'restaurant', Paintbrush: 'brush', Wrench: 'build',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-outline-variant/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-bold italic text-primary tracking-tight">YUDU</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/explorar" className="text-on-surface-variant hover:text-primary transition">Explorar</Link>
            <Link href="/cadastrar" className="text-on-surface-variant hover:text-primary transition">Seja Expert</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/entrar" className="text-sm font-medium text-on-surface-variant hover:text-primary transition">Entrar</Link>
            <Link href="/cadastrar" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-container transition">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-white pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-8">
              Aprenda na prática com{' '}
              <span className="text-primary">experts reais</span>.
            </h1>
            <p className="text-xl text-on-surface-variant mb-12 max-w-xl font-light leading-relaxed">
              Encontre profissionais verificados para aprender habilidades do mundo real. Preços transparentes, qualidade garantida.
            </p>
            <div className="bg-white p-2 rounded-xl shadow-xl border border-outline-variant/30 flex flex-col md:flex-row gap-2 max-w-2xl">
              <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-outline-variant/30">
                <span className="material-symbols-outlined text-primary">search</span>
                <input
                  className="w-full border-none bg-transparent focus:outline-none text-on-surface placeholder:text-outline font-medium text-sm"
                  placeholder="O que você quer aprender?"
                  type="text"
                />
              </div>
              <Link
                href="/explorar"
                className="bg-primary hover:bg-primary-container text-white px-8 py-3 rounded-lg font-bold transition text-sm text-center"
              >
                Buscar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Categorias Populares</h2>
              <div className="w-12 h-1 bg-primary mt-2" />
            </div>
            <Link href="/explorar" className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm">
              Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(categories ?? []).slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/explorar?categoria=${cat.slug}`}
                className="group bg-white p-6 md:p-8 rounded-xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {iconMap[cat.icon_name ?? ''] ?? 'category'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-on-surface">{cat.name}</h3>
                <p className="text-xs text-outline mt-1 capitalize">{cat.type === 'digital' ? 'Digital' : 'Presencial'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Experts */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Experts em Destaque</h2>
              <p className="text-on-surface-variant mt-1 text-sm">Profissionais verificados prontos para ensinar</p>
            </div>
            <Link href="/explorar" className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm">
              Ver todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          {experts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} {...expert} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">person_search</span>
              <p className="text-on-surface-variant">Os experts serão exibidos aqui em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-4">Como funciona</h2>
          <p className="text-on-surface-variant mb-16 max-w-lg mx-auto">Três passos simples para começar a aprender na prática</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-outline-variant/20">
              <div className="w-12 h-12 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">search</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-2">1. Encontre</h3>
              <p className="text-sm text-on-surface-variant">Busque por habilidade ou categoria. Digital ou presencial.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-outline-variant/20">
              <div className="w-12 h-12 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">handshake</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-2">2. Agende</h3>
              <p className="text-sm text-on-surface-variant">Escolha o expert, proponha um valor e agende a sessão.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-outline-variant/20">
              <div className="w-12 h-12 bg-primary-fixed-dim/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">school</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-2">3. Aprenda</h3>
              <p className="text-sm text-on-surface-variant">Aprenda fazendo ao lado de quem já domina o ofício.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-white/70 mb-8">Cadastre-se grátis e agende sua primeira sessão ainda essa semana.</p>
          <Link href="/cadastrar" className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-primary-fixed transition inline-block">
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-xl font-bold italic text-primary tracking-tight">YUDU</span>
            <p className="text-sm text-outline mt-2 max-w-xs">Conectando experts e aprendizes desde 2024. Qualidade verificada.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <h5 className="font-bold text-on-surface mb-3">Marketplace</h5>
              <ul className="text-outline space-y-2">
                <li><Link href="/explorar" className="hover:text-primary transition">Explorar</Link></li>
                <li><Link href="/cadastrar" className="hover:text-primary transition">Seja Expert</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-on-surface mb-3">Legal</h5>
              <ul className="text-outline space-y-2">
                <li><span className="cursor-pointer hover:text-primary transition">Privacidade</span></li>
                <li><span className="cursor-pointer hover:text-primary transition">Termos</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
