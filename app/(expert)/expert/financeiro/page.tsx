import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FinanceiroClient } from './financeiro-client'

export default async function FinanceiroPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: expertProfile } = await supabase
    .from('expert_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!expertProfile) redirect('/entrar')

  // Fetch sessions for this expert
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id')
    .eq('expert_id', expertProfile.id)

  const sessionIds = (sessions ?? []).map((s) => s.id)

  // Fetch payments for those sessions
  const { data: payments } = sessionIds.length > 0
    ? await supabase
        .from('payments')
        .select(`
          id, amount, platform_fee, expert_payout, status, created_at, captured_at, released_at,
          sessions!inner(
            id, scheduled_at,
            learner_profiles(profiles!inner(full_name)),
            client_profiles(profiles!inner(full_name))
          )
        `)
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const paymentList = (payments ?? []).map((p: any) => {
    const learnerName = p.sessions?.learner_profiles?.profiles?.full_name
    const clientName = p.sessions?.client_profiles?.profiles?.full_name
    return {
      id: p.id,
      amount: Number(p.amount),
      platformFee: Number(p.platform_fee),
      expertPayout: Number(p.expert_payout),
      status: p.status as string,
      createdAt: p.created_at,
      payerName: learnerName ?? clientName ?? 'N/A',
    }
  })

  const totalReceived = paymentList
    .filter((p) => p.status === 'released')
    .reduce((sum, p) => sum + p.expertPayout, 0)

  const totalPending = paymentList
    .filter((p) => p.status === 'pending' || p.status === 'captured')
    .reduce((sum, p) => sum + p.expertPayout, 0)

  const totalSessions = paymentList.length

  return (
    <div>
      <h1 className="text-xl font-bold text-[#263238] mb-4">Financeiro</h1>
      <FinanceiroClient
        totalReceived={totalReceived}
        totalPending={totalPending}
        totalSessions={totalSessions}
        payments={paymentList}
      />
    </div>
  )
}
