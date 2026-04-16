import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, BookX, Clock, CheckCircle, Star } from 'lucide-react'

const testimonials = [
  { name: 'Pedro', age: 23, text: 'Aprendi elétrica residencial em 3 semanas. Hoje faço freelas.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Camila', age: 26, text: 'Era designer de papel. Agora tenho portfólio real.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Gabriel', age: 24, text: 'Saí da faculdade sem saber nada útil. Aqui aprendi de verdade.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' },
]

export default function ParaAprendizesPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center bg-[#1C2B30] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600" alt="" fill className="opacity-20 object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C2B30] via-[#1C2B30]/85 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <span className="inline-flex items-center bg-[#B07D05]/20 text-[#B07D05] border border-[#B07D05]/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            Para quem quer sair da teoria
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            <span className="text-white">Todo mundo pede experiência.</span><br />
            <span className="text-[#B07D05]">Ninguém te dá a primeira.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
            YUDU conecta você a um profissional real. Você aprende instalando, construindo e criando — não só assistindo.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/cadastrar?role=learner" className="bg-[#B07D05] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#8f6604] transition">
              Quero aprender fazendo
            </Link>
            <a href="#como-funciona" className="text-gray-400 hover:text-white px-4 py-3 transition font-medium">
              Ver como funciona ↓
            </a>
          </div>
          <p className="text-sm text-gray-500">Sem experiência prévia necessária · A partir de R$ 70/h · Cancele quando quiser</p>
        </div>
      </section>

      {/* A DOR */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#263238] text-center mb-10">Reconhece alguma dessas situações?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFF8F0] border border-[#B07D05]/20 rounded-xl p-6">
              <AlertCircle className="w-8 h-8 text-[#B07D05] mb-3" />
              <p className="text-[#263238] font-medium">Me formei mas não consigo emprego por falta de experiência</p>
            </div>
            <div className="bg-[#FFF8F0] border border-[#B07D05]/20 rounded-xl p-6">
              <BookX className="w-8 h-8 text-[#B07D05] mb-3" />
              <p className="text-[#263238] font-medium">Fiz cursos online mas na hora de fazer de verdade, travo</p>
            </div>
            <div className="bg-[#FFF8F0] border border-[#B07D05]/20 rounded-xl p-6">
              <Clock className="w-8 h-8 text-[#B07D05] mb-3" />
              <p className="text-[#263238] font-medium">Fico estudando teoria enquanto vejo outros avançando na prática</p>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm">Se você se identificou com pelo menos um, o YUDU foi feito para você.</p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-[#F7F8FC] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#263238] text-center mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', t: 'Escolha o que quer aprender', d: 'Digital ou presencial. Tech, artes, ofícios. Você decide o ritmo.' },
              { n: '2', t: 'Vá ao campo com um expert', d: 'Profissional verificado. Você faz junto, não só observa.' },
              { n: '3', t: 'Saia com habilidade real', d: 'Experiência comprovada. Certificado de horas práticas.' },
            ].map((s) => (
              <div key={s.n} className="relative bg-white rounded-xl p-8 border border-gray-200">
                <span className="absolute top-4 right-4 text-6xl font-black text-[#B07D05]/10">{s.n}</span>
                <h3 className="font-bold text-lg text-[#263238] mb-2">{s.t}</h3>
                <p className="text-sm text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#263238]">Planos de Aprendizado</h2>
          <p className="text-gray-500 mt-2 mb-10">Horas práticas em campo com experts reais.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#263238]">Starter</h3>
              <p className="text-3xl font-extrabold text-[#263238] mt-3">R$ 197<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />4h práticas · 1 área</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />Expert verificado + chat</li>
              </ul>
              <Link href="/cadastrar?role=learner" className="mt-6 block text-center border-2 border-[#263238] text-[#263238] font-semibold py-3 rounded-xl hover:bg-[#263238] hover:text-white transition">Começar</Link>
            </div>
            <div className="relative border-2 border-[#B07D05] rounded-2xl p-8">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B07D05] text-white text-xs font-bold rounded-full px-3 py-1">MAIS POPULAR</span>
              <h3 className="text-xl font-bold text-[#263238]">Pro</h3>
              <p className="text-3xl font-extrabold text-[#263238] mt-3">R$ 397<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] shrink-0 mt-0.5" />12h práticas · 3 áreas</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-[#B07D05] shrink-0 mt-0.5" />Experts ilimitados + certificado</li>
              </ul>
              <Link href="/cadastrar?role=learner" className="mt-6 block text-center bg-[#B07D05] text-white font-semibold py-3 rounded-xl hover:bg-[#8f6604] transition">Começar</Link>
            </div>
            <div className="border-2 border-[#263238] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#263238]">Master</h3>
              <p className="text-3xl font-extrabold text-[#263238] mt-3">R$ 697<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-[#263238] shrink-0 mt-0.5" />30h práticas · ilimitadas</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-[#263238] shrink-0 mt-0.5" />Expert dedicado + IA (em breve)</li>
              </ul>
              <Link href="/cadastrar?role=learner" className="mt-6 block text-center bg-[#263238] text-white font-semibold py-3 rounded-xl hover:bg-[#1a2327] transition">Começar</Link>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-6">Sem contrato. Cancele quando quiser.</p>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="bg-[#F7F8FC] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#263238] text-center mb-10">Quem já aprendeu fazendo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[#263238] text-sm">{t.name}, {t.age} anos</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-[#B07D05] text-[#B07D05]" />)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#263238] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pare de esperar a primeira chance. Crie ela.</h2>
          <p className="text-gray-400 mb-8">Agende sua primeira sessão ainda essa semana.</p>
          <Link href="/cadastrar?role=learner" className="bg-[#B07D05] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#8f6604] transition inline-block">
            Começar agora — grátis
          </Link>
          <p className="text-sm text-gray-500 mt-4">⚡ 12 aprendizes entraram essa semana</p>
        </div>
      </section>
    </div>
  )
}
