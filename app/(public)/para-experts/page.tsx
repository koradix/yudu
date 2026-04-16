import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Shield, DollarSign, Clock4, UserCheck } from 'lucide-react'
import { EarningsCalculator } from './earnings-calculator'

export default function ParaExpertsPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center bg-[#263238] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600" alt="" fill className="opacity-20 object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#263238] via-[#263238]/85 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <span className="inline-flex items-center bg-[#B07D05]/20 text-[#B07D05] border border-[#B07D05]/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            Para quem domina um ofício
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            <span className="text-white">Você já sabe fazer.</span><br />
            <span className="text-[#B07D05]">Agora ganhe por ensinar.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
            No YUDU, você ensina enquanto trabalha. Sem montar cursos. Sem gravar vídeos. Só fazendo o que já faz — com um aprendiz ao seu lado.
          </p>
          <Link href="/cadastrar?role=expert" className="bg-[#B07D05] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#8f6604] transition inline-block">
            Quero ser expert YUDU
          </Link>
          <p className="text-sm text-gray-500 mt-4">Média de R$ 120/h · Você define horários · Pagamento em 48h</p>
        </div>
      </section>

      {/* CALCULADORA */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#263238] mb-8">Quanto você pode ganhar por mês?</h2>
          <EarningsCalculator />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-[#F7F8FC] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#263238] text-center mb-12">Como funciona para o Expert</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', t: 'Crie seu perfil em 5 min', d: 'Foto, bio, especialidade e preço. Simples assim.' },
              { n: '2', t: 'Receba solicitações', d: 'Aprendizes escolhem você pelo perfil. Aceite ou proponha.' },
              { n: '3', t: 'Ensine e receba', d: 'Pagamento liberado 48h após a sessão. Via Pix.' },
            ].map((s) => (
              <div key={s.n} className="relative bg-white rounded-xl p-8 border border-gray-200">
                <span className="absolute top-4 right-4 text-6xl font-black text-[#2E7D32]/10">{s.n}</span>
                <h3 className="font-bold text-lg text-[#263238] mb-2">{s.t}</h3>
                <p className="text-sm text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#263238] text-center mb-10">Por que o YUDU?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, t: 'Sem burocracia', d: 'Cadastro em minutos' },
              { icon: DollarSign, t: 'Pagamento garantido', d: 'Via Pix em 48h' },
              { icon: Clock4, t: 'Você define o preço', d: 'Sem tabela fixa' },
              { icon: UserCheck, t: 'Aprendizes verificados', d: 'Perfis reais' },
            ].map((d) => (
              <div key={d.t} className="bg-[#F7F8FC] rounded-xl p-6 text-center">
                <d.icon className="w-8 h-8 text-[#2E7D32] mx-auto mb-3" />
                <h3 className="font-bold text-sm text-[#263238]">{d.t}</h3>
                <p className="text-xs text-gray-500 mt-1">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#2E7D32] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Seu conhecimento vale mais do que você imagina.</h2>
          <p className="text-white/70 mb-8">Cadastre-se grátis e comece a receber solicitações.</p>
          <Link href="/cadastrar?role=expert" className="bg-white text-[#2E7D32] px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-50 transition inline-block">
            Cadastrar como Expert — grátis
          </Link>
        </div>
      </section>
    </div>
  )
}
