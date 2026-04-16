import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SessoesContent } from './sessoes-content'

export default async function SessoesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  // Get learner profile
  const { data: learnerProfile } = await supabase
    .from('learner_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  // Fetch sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      id, status, scheduled_at, duration_min, price_paid, location_type, offer_type, completed_at,
      expert_profiles!inner(id, profiles!inner(full_name, avatar_url)),
      offers!inner(title)
    `)
    .eq('learner_id', learnerProfile?.id ?? '')
    .order('scheduled_at', { ascending: false })

  // Fetch session requests
  const { data: requests } = await supabase
    .from('session_requests')
    .select(`
      id, status, proposed_price, counter_price, message, proposed_date, created_at,
      offers!inner(
        title, offer_type,
        expert_profiles!inner(id, profiles!inner(full_name, avatar_url))
      )
    `)
    .eq('requester_id', user.id)
    .in('status', ['pending', 'counter_proposed'])
    .order('created_at', { ascending: false })

  // Fetch reviews already written by this user
  const sessionIds = (sessions ?? []).map((s) => s.id)
  const { data: existingReviews } = sessionIds.length > 0
    ? await supabase
        .from('reviews')
        .select('session_id')
        .eq('reviewer_id', user.id)
        .in('session_id', sessionIds)
    : { data: [] }

  const reviewedSessionIds = new Set((existingReviews ?? []).map((r) => r.session_id))

  return (
    <div>
      <h1 className="text-xl font-bold text-[#16213E] mb-4">Minhas Sessões</h1>
      <SessoesContent
        sessions={(sessions ?? []).map((s: any) => ({
          id: s.id,
          status: s.status,
          scheduledAt: s.scheduled_at,
          durationMin: s.duration_min,
          pricePaid: Number(s.price_paid),
          locationType: s.location_type,
          offerType: s.offer_type,
          completedAt: s.completed_at,
          expertName: s.expert_profiles.profiles.full_name,
          expertAvatar: s.expert_profiles.profiles.avatar_url,
          offerTitle: s.offers.title,
          hasReview: reviewedSessionIds.has(s.id),
        }))}
        requests={(requests ?? []).map((r: any) => ({
          id: r.id,
          status: r.status,
          proposedPrice: Number(r.proposed_price),
          counterPrice: r.counter_price ? Number(r.counter_price) : null,
          message: r.message,
          proposedDate: r.proposed_date,
          offerTitle: r.offers.title,
          offerType: r.offers.offer_type,
          expertName: r.offers.expert_profiles.profiles.full_name,
          expertAvatar: r.offers.expert_profiles.profiles.avatar_url,
        }))}
        userId={user.id}
      />
    </div>
  )
}
