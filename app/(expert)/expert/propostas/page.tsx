import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PropostasContent } from './propostas-content'

export default async function PropostasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: expertProfile } = await supabase
    .from('expert_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!expertProfile) redirect('/entrar')

  // Get all offers by this expert
  const { data: offers } = await supabase
    .from('offers')
    .select('id')
    .eq('expert_id', expertProfile.id)

  const offerIds = (offers ?? []).map((o) => o.id)

  // Fetch pending/counter_proposed requests for these offers
  const { data: requests } = offerIds.length > 0
    ? await supabase
        .from('session_requests')
        .select(`
          id, status, proposed_price, counter_price, message, proposed_date, created_at,
          profiles!session_requests_requester_id_fkey(id, full_name, avatar_url),
          offers!inner(id, title, offer_type, duration_min, location_type, base_price,
            expert_profiles!inner(id)
          )
        `)
        .in('offer_id', offerIds)
        .in('status', ['pending', 'counter_proposed'])
        .order('created_at', { ascending: false })
    : { data: [] }

  const pendingCount = (requests ?? []).filter((r) => r.status === 'pending').length

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold text-[#263238]">Propostas Recebidas</h1>
        {pendingCount > 0 && (
          <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#2E7D32] px-2 text-xs font-bold text-[#263238]">
            {pendingCount}
          </span>
        )}
      </div>
      <PropostasContent
        requests={(requests ?? []).map((r: any) => ({
          id: r.id,
          status: r.status,
          proposedPrice: Number(r.proposed_price),
          counterPrice: r.counter_price ? Number(r.counter_price) : null,
          message: r.message,
          proposedDate: r.proposed_date,
          createdAt: r.created_at,
          requesterName: r.profiles.full_name,
          requesterAvatar: r.profiles.avatar_url,
          requesterId: r.profiles.id,
          offerId: r.offers.id,
          offerTitle: r.offers.title,
          offerType: r.offers.offer_type,
          durationMin: r.offers.duration_min,
          locationType: r.offers.location_type,
          basePrice: Number(r.offers.base_price),
          expertProfileId: r.offers.expert_profiles.id,
        }))}
      />
    </div>
  )
}
