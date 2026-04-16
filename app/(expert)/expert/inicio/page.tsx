import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ExpertInicioPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const nome = profile?.full_name?.split(' ')[0] ?? 'Expert'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-on-surface">Olá, {nome}! 👋</h1>
      <p className="text-on-surface-variant mt-1">Gerencie suas sessões e propostas</p>
      <div className="mt-6 bg-white rounded-xl border border-outline-variant/30 p-6">
        <p className="text-on-surface-variant">Complete seu perfil para aparecer no marketplace</p>
        <Link href="/expert/perfil" className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-container transition">
          Completar Perfil
        </Link>
      </div>
    </div>
  )
}
