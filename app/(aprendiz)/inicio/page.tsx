import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AprendizInicioPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const nome = profile?.full_name?.split(' ')[0] ?? 'Aprendiz'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#16213E]">
        Olá, {nome}! 👋
      </h1>
      <p className="text-gray-500 mt-1">Pronto para aprender algo novo hoje?</p>

      <div className="mt-6 bg-white rounded-xl border border-[#D6DCE8] p-6">
        <p className="text-gray-600">Explore experts e comece sua primeira sessão</p>
        <Link
          href="/aprendiz/explorar"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-[#16213E] hover:bg-[#e0951c] transition"
        >
          Explorar Experts
        </Link>
      </div>
    </div>
  )
}
