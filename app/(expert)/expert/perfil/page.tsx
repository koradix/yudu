import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ExpertPerfilClient } from './expert-perfil-client'

export default async function ExpertPerfilPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, phone')
    .eq('id', user.id)
    .single()

  const { data: expertProfile } = await supabase
    .from('expert_profiles')
    .select('id, headline, bio, is_active')
    .eq('user_id', user.id)
    .single()

  if (!profile || !expertProfile) redirect('/entrar')

  const { data: offers } = await supabase
    .from('offers')
    .select('id, title, description, offer_type, base_price, duration_min, location_type, is_active')
    .eq('expert_id', expertProfile.id)
    .order('created_at', { ascending: false })

  const { data: expertSkills } = await supabase
    .from('expert_skills')
    .select('id, skill_id, years_exp, skills(id, name, skill_categories(type))')
    .eq('expert_id', expertProfile.id)

  const { data: allSkills } = await supabase
    .from('skills')
    .select('id, name, skill_categories(type)')
    .order('name')

  return (
    <ExpertPerfilClient
      userId={user.id}
      profile={{
        fullName: profile.full_name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        phone: profile.phone,
      }}
      expertProfile={{
        id: expertProfile.id,
        headline: expertProfile.headline,
        bio: expertProfile.bio,
      }}
      offers={(offers ?? []).map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        offerType: o.offer_type,
        basePrice: Number(o.base_price),
        durationMin: o.duration_min,
        locationType: o.location_type,
        isActive: o.is_active,
      }))}
      expertSkills={(expertSkills ?? []).map((es: any) => ({
        id: es.id,
        skillId: es.skill_id,
        skillName: es.skills?.name ?? '',
        skillType: es.skills?.skill_categories?.type ?? 'digital',
        yearsExp: es.years_exp,
      }))}
      allSkills={(allSkills ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        type: s.skill_categories?.type ?? 'digital',
      }))}
    />
  )
}
