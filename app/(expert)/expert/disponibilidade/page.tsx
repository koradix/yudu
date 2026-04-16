import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DisponibilidadeClient } from './disponibilidade-client'

export default async function DisponibilidadePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: expertProfile } = await supabase
    .from('expert_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!expertProfile) redirect('/entrar')

  const { data: slots } = await supabase
    .from('availability')
    .select('id, weekday, start_time, end_time, is_active')
    .eq('expert_id', expertProfile.id)
    .order('weekday')
    .order('start_time')

  return (
    <div>
      <h1 className="text-xl font-bold text-[#263238] mb-4">Disponibilidade</h1>
      <DisponibilidadeClient
        expertId={expertProfile.id}
        initialSlots={(slots ?? []).map((s) => ({
          id: s.id,
          weekday: s.weekday,
          startTime: s.start_time,
          endTime: s.end_time,
          isActive: s.is_active,
        }))}
      />
    </div>
  )
}
