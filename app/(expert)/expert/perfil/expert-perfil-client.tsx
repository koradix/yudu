'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SkillBadge } from '@/components/skill-badge'
import { cn, formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS } from '@/lib/constants'

// --- Types ---

interface Profile {
  fullName: string; email: string; avatarUrl: string | null; phone: string | null
}
interface ExpertProfile { id: string; headline: string | null; bio: string | null }
interface Offer {
  id: string; title: string; description: string | null; offerType: string
  basePrice: number; durationMin: number | null; locationType: string | null; isActive: boolean
}
interface ExpertSkill {
  id: string; skillId: string; skillName: string; skillType: string; yearsExp: number | null
}
interface SkillOption { id: string; name: string; type: string }

interface Props {
  userId: string; profile: Profile; expertProfile: ExpertProfile
  offers: Offer[]; expertSkills: ExpertSkill[]; allSkills: SkillOption[]
}

// --- Schemas ---

const profileSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  phone: z.string().optional(),
})

const offerSchema = z.object({
  offer_type: z.enum(['practical_experience', 'hourly_mentoring', 'service']),
  title: z.string().min(2, 'Obrigatório'),
  description: z.string().optional(),
  base_price: z.number().positive('Preço obrigatório'),
  duration_min: z.number().int().min(15, 'Mínimo 15 min'),
})

type ProfileForm = z.infer<typeof profileSchema>
type OfferForm = z.infer<typeof offerSchema>

const tabs = ['Meu Perfil', 'Minhas Offers', 'Habilidades'] as const

export function ExpertPerfilClient({
  userId, profile, expertProfile, offers: initialOffers,
  expertSkills: initialSkills, allSkills,
}: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState<(typeof tabs)[number]>('Meu Perfil')
  const [msg, setMsg] = useState('')
  const [offers, setOffers] = useState(initialOffers)
  const [skills, setSkills] = useState(initialSkills)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // --- Profile Form ---
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.fullName,
      headline: expertProfile.headline ?? '',
      bio: expertProfile.bio ?? '',
      avatar_url: profile.avatarUrl ?? '',
      phone: profile.phone ?? '',
    },
  })

  async function saveProfile(data: ProfileForm) {
    setMsg('')
    await supabase.from('profiles').update({
      full_name: data.full_name,
      avatar_url: data.avatar_url || null,
      phone: data.phone || null,
    }).eq('id', userId)

    await supabase.from('expert_profiles').update({
      headline: data.headline || null,
      bio: data.bio || null,
    }).eq('id', expertProfile.id)

    setMsg('Perfil atualizado!')
    setTimeout(() => setMsg(''), 3000)
  }

  // --- Offer Form ---
  const offerForm = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    defaultValues: { offer_type: 'practical_experience', title: '', description: '', base_price: 0, duration_min: 60 },
  })

  async function createOffer(data: OfferForm) {
    // pick first skill for now
    const skillId = skills[0]?.skillId
    if (!skillId) { setMsg('Adicione pelo menos uma habilidade primeiro.'); return }

    const { data: newOffer, error } = await supabase.from('offers').insert({
      expert_id: expertProfile.id,
      skill_id: skillId,
      offer_type: data.offer_type,
      title: data.title,
      description: data.description || null,
      base_price: data.base_price,
      duration_min: data.duration_min,
      is_active: true,
    }).select().single()

    if (error) { setMsg('Erro ao criar offer.'); return }
    if (newOffer) {
      setOffers((prev) => [{
        id: newOffer.id, title: newOffer.title, description: newOffer.description,
        offerType: newOffer.offer_type, basePrice: Number(newOffer.base_price),
        durationMin: newOffer.duration_min, locationType: newOffer.location_type,
        isActive: newOffer.is_active,
      }, ...prev])
    }
    setShowOfferModal(false)
    offerForm.reset()
    setMsg('Offer criada!')
    setTimeout(() => setMsg(''), 3000)
  }

  async function toggleOffer(offerId: string, currentActive: boolean) {
    setTogglingId(offerId)
    await supabase.from('offers').update({ is_active: !currentActive }).eq('id', offerId)
    setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, isActive: !currentActive } : o))
    setTogglingId(null)
  }

  // --- Skills ---
  const existingSkillIds = new Set(skills.map((s) => s.skillId))
  const filteredSkills = allSkills.filter(
    (s) => !existingSkillIds.has(s.id) && s.name.toLowerCase().includes(skillSearch.toLowerCase())
  )

  async function addSkill(skill: SkillOption) {
    const { data: inserted } = await supabase.from('expert_skills').insert({
      expert_id: expertProfile.id,
      skill_id: skill.id,
    }).select().single()

    if (inserted) {
      setSkills((prev) => [...prev, {
        id: inserted.id, skillId: skill.id, skillName: skill.name,
        skillType: skill.type, yearsExp: null,
      }])
    }
    setSkillSearch('')
  }

  async function removeSkill(expertSkillId: string) {
    await supabase.from('expert_skills').delete().eq('id', expertSkillId)
    setSkills((prev) => prev.filter((s) => s.id !== expertSkillId))
  }

  return (
    <div>
      {msg && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-2 text-sm">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e5e7eb] mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition',
              tab === t ? 'border-[#263238] text-[#263238]' : 'border-transparent text-[#718096] hover:text-[#263238]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* === Meu Perfil === */}
      {tab === 'Meu Perfil' && (
        <form onSubmit={profileForm.handleSubmit(saveProfile)} className="bg-white rounded-xl shadow-sm p-6 space-y-4 max-w-lg">
          <div>
            <Label>Nome completo</Label>
            <Input {...profileForm.register('full_name')} className="mt-1" />
            {profileForm.formState.errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.full_name.message}</p>
            )}
          </div>
          <div>
            <Label>Headline</Label>
            <Input {...profileForm.register('headline')} placeholder="Ex: Designer UI/UX com 5 anos" className="mt-1" />
          </div>
          <div>
            <Label>Bio</Label>
            <textarea
              {...profileForm.register('bio')}
              rows={4}
              className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#263238]/20"
              placeholder="Fale sobre sua experiência..."
            />
          </div>
          <div>
            <Label>URL do Avatar</Label>
            <Input {...profileForm.register('avatar_url')} placeholder="https://..." className="mt-1" />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input {...profileForm.register('phone')} placeholder="(11) 99999-9999" className="mt-1" />
          </div>
          <Button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="bg-[#2E7D32] hover:bg-[#1b5e20] text-[#263238] font-semibold"
          >
            {profileForm.formState.isSubmitting ? 'Salvando...' : 'Salvar perfil'}
          </Button>
        </form>
      )}

      {/* === Minhas Offers === */}
      {tab === 'Minhas Offers' && (
        <div>
          <Button
            onClick={() => setShowOfferModal(true)}
            className="mb-4 bg-[#263238] hover:bg-[#263238] text-white font-semibold"
          >
            + Nova Offer
          </Button>

          {offers.length === 0 && <p className="text-sm text-[#718096]">Nenhuma offer criada ainda.</p>}

          <div className="space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center rounded-md bg-[#F7F8FC] px-2 py-0.5 text-[11px] font-medium text-[#263238]">
                      {OFFER_TYPE_LABELS[o.offerType as keyof typeof OFFER_TYPE_LABELS] ?? o.offerType}
                    </span>
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                      o.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    )}>
                      {o.isActive ? 'Ativa' : 'Pausada'}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-[#263238]">{o.title}</p>
                  {o.description && <p className="text-xs text-[#718096] mt-0.5 line-clamp-1">{o.description}</p>}
                  <p className="text-sm font-bold text-[#263238] mt-1">{formatPrice(o.basePrice)}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={togglingId === o.id}
                  onClick={() => toggleOffer(o.id, o.isActive)}
                  className={o.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}
                >
                  {o.isActive ? 'Pausar' : 'Ativar'}
                </Button>
              </div>
            ))}
          </div>

          {/* Modal Nova Offer */}
          {showOfferModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-[#263238] text-lg mb-4">Nova Offer</h3>
                <form onSubmit={offerForm.handleSubmit(createOffer)} className="space-y-4">
                  <div>
                    <Label>Tipo</Label>
                    <select
                      {...offerForm.register('offer_type')}
                      className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
                    >
                      <option value="practical_experience">Experiência Prática</option>
                      <option value="hourly_mentoring">Mentoria por Hora</option>
                      <option value="service">Serviço</option>
                    </select>
                  </div>
                  <div>
                    <Label>Título</Label>
                    <Input {...offerForm.register('title')} className="mt-1" />
                    {offerForm.formState.errors.title && <p className="text-red-500 text-xs mt-1">{offerForm.formState.errors.title.message}</p>}
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <textarea
                      {...offerForm.register('description')}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Preço (R$)</Label>
                      <Input type="number" step="0.01" {...offerForm.register('base_price')} className="mt-1" />
                      {offerForm.formState.errors.base_price && <p className="text-red-500 text-xs mt-1">{offerForm.formState.errors.base_price.message}</p>}
                    </div>
                    <div>
                      <Label>Duração (min)</Label>
                      <Input type="number" {...offerForm.register('duration_min')} className="mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowOfferModal(false)} className="flex-1">Cancelar</Button>
                    <Button type="submit" disabled={offerForm.formState.isSubmitting} className="flex-1 bg-[#2E7D32] hover:bg-[#1b5e20] text-[#263238] font-semibold">
                      {offerForm.formState.isSubmitting ? 'Salvando...' : 'Criar Offer'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === Habilidades === */}
      {tab === 'Habilidades' && (
        <div className="max-w-lg">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#263238] mb-3">Minhas Habilidades</h3>
            {skills.length === 0 && <p className="text-sm text-[#718096] mb-3">Nenhuma habilidade adicionada.</p>}
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-medium text-[#263238]">
                  <SkillBadge name={s.skillName} type={s.skillType as 'digital' | 'physical'} size="sm" />
                  <button onClick={() => removeSkill(s.id)} className="text-red-400 hover:text-red-600 ml-1">×</button>
                </span>
              ))}
            </div>

            <div className="relative">
              <Label>Adicionar habilidade</Label>
              <Input
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Buscar habilidade..."
                className="mt-1"
              />
              {skillSearch.length >= 2 && filteredSkills.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {filteredSkills.slice(0, 8).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => addSkill(s)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#F7F8FC] flex items-center gap-2"
                    >
                      {s.name}
                      <span className={cn(
                        'text-[10px] rounded-full px-1.5',
                        s.type === 'digital' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'
                      )}>
                        {s.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
