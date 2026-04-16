import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle, Shield, UserCheck, Award } from 'lucide-react'

export default async function ParaClientesPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, slug, type')
    .order('name')

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center bg-[#1C2B30] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600" alt="" fill className="opacity-20 object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C2B30] via-[#1C2B30]/85 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <span className="inline-flex items-center bg-[#B07D05]/20 text-[#B07D05] border border-[#B07D05]/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            Para quem precisa contratar bem
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            <span className="text-white">Currículo não garante entrega.</span><br />
            <span className="text-[#B07D05]">Campo real, sim.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
            Todo expert YUDU foi avaliado por aprendizes reais em projetos concretos. Você contrata quem já provou que sabe fazer.
          </p>
          <Link href="/explorar" className="bg-[#B07D05] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#8f6604] transition inline-block">
            Encontrar profissional
          </Link>
          <p className="text-sm text-gray-500 mt-4">Verificação em campo · Avaliações reais · Suporte na contratação</p>
        </div>
      </section>

      {/* COMO VERIFICAMOS */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#263238] text-center mb-12">Como garantimos a qualidade?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-[#F7F8FC] rounded-xl p-8 border border-gray-200 text-center">
              <span className="absolute top-4 right-4 text-6xl font-black text-[#2E7D32]/10">1</span>
              <Shield className="w-10 h-10 text-[#2E7D32] mx-auto mb-4" />
              <h3 className="font-bold text-[#263238] mb-2">Expert se cadastra</h3>
              <p className="text-sm text-gray-500">Com portfólio, especialidade e preço definido</p>
            </div>
            <div className="relative bg-[#F7F8FC] rounded-xl p-8 border border-gray-200 text-center">
              <span className="absolute top-4 right-4 text-6xl font-black text-[#2E7D32]/10">2</span>
              <UserCheck className="w-10 h-10 text-[#B07D05] mx-auto mb-4" />
              <h3 className="font-bold text-[#263238] mb-2">Aprendizes avaliam</h3>
              <p className="text-sm text-gray-500">Durante sessões práticas reais, não em teoria</p>
            </div>
            <div className="relative bg-[#F7F8FC] rounded-xl p-8 border border-gray-200 text-center">
              <span className="absolute top-4 right-4 text-6xl font-black text-[#2E7D32]/10">3</span>
              <Award className="w-10 h-10 text-[#263238] mx-auto mb-4" />
              <h3 className="font-bold text-[#263238] mb-2">Selo verificado</h3>
              <p className="text-sm text-gray-500">Só experts com média ≥ 4.5 recebem o selo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-[#F7F8FC] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#263238] text-center mb-10">Categorias disponíveis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(categories ?? []).map((cat) => (
              <Link
                key={cat.id}
                href={`/explorar?categoria=${cat.slug}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#2E7D32]/40 hover:shadow-md transition text-center"
              >
                <p className="font-bold text-sm text-[#263238]">{cat.name}</p>
                <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  cat.type === 'digital' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {cat.type === 'digital' ? 'Digital' : 'Presencial'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#263238] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Chega de contratar no escuro.</h2>
          <p className="text-gray-400 mb-8">Experts verificados em campo. Avaliações de quem aprendeu de verdade.</p>
          <Link href="/explorar" className="bg-[#B07D05] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#8f6604] transition inline-block">
            Encontrar expert verificado
          </Link>
        </div>
      </section>
    </div>
  )
}
