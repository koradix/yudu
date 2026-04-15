import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { SolicitarFlow } from './solicitar-flow'

interface PageProps {
  params: { offerId: string }
}

export default async function SolicitarPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: offer } = await supabase
    .from('offers')
    .select(`
      id,
      title,
      description,
      offer_type,
      base_price,
      min_price,
      duration_min,
      location_type,
      expert_profiles!inner(
        id,
        headline,
        profiles!inner(full_name, avatar_url)
      )
    `)
    .eq('id', params.offerId)
    .eq('is_active', true)
    .single()

  if (!offer) notFound()

  const expert = offer.expert_profiles as any
  const profile = expert.profiles

  return (
    <div className="max-w-lg mx-auto py-6">
      <SolicitarFlow
        offerId={offer.id}
        title={offer.title}
        offerType={offer.offer_type}
        basePrice={Number(offer.base_price)}
        minPrice={Number(offer.min_price ?? offer.base_price) * 0.5}
        durationMin={offer.duration_min ?? 60}
        locationType={offer.location_type ?? 'remote'}
        expertName={profile.full_name}
        expertHeadline={expert.headline ?? ''}
        expertAvatarUrl={profile.avatar_url}
        userId={user.id}
      />
    </div>
  )
}
