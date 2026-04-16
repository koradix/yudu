import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PagarClient } from './pagar-client'
import { PLATFORM_FEE } from '@/lib/constants'

interface PageProps {
  params: { requestId: string }
}

export default async function PagarPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: sessionRequest } = await supabase
    .from('session_requests')
    .select(`
      id, requester_id, proposed_price, proposed_date, status,
      offers!inner(
        id, title, offer_type, duration_min,
        expert_profiles!inner(
          id, headline,
          profiles!inner(full_name, avatar_url)
        )
      )
    `)
    .eq('id', params.requestId)
    .single()

  if (!sessionRequest) notFound()
  if (sessionRequest.requester_id !== user.id) redirect('/aprendiz/sessoes')

  const offer = sessionRequest.offers as any
  const expert = offer.expert_profiles
  const profile = expert.profiles
  const amount = Number(sessionRequest.proposed_price)

  return (
    <div className="max-w-lg mx-auto py-6">
      <PagarClient
        requestId={sessionRequest.id}
        expertName={profile.full_name}
        expertAvatar={profile.avatar_url}
        expertHeadline={expert.headline ?? ''}
        offerTitle={offer.title}
        offerType={offer.offer_type}
        amount={amount}
        platformFee={+(amount * PLATFORM_FEE).toFixed(2)}
        proposedDate={sessionRequest.proposed_date}
      />
    </div>
  )
}
