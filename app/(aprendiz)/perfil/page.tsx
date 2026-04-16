'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SkillBadge } from '@/components/skill-badge'

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres'),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface SkillHistory {
  skillName: string
  skillType: string
  totalHours: number
  sessionsCount: number
}

export default function AprendizPerfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [skills, setSkills] = useState<SkillHistory[]>([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', avatar_url: '', bio: '' },
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/entrar'); return }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()

      const { data: learner } = await supabase
        .from('learner_profiles')
        .select('id, bio')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        form.reset({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url ?? '',
          bio: learner?.bio ?? '',
        })
      }

      if (learner) {
        const { data: history } = await supabase
          .from('learner_skill_history')
          .select('total_hours, sessions_count, skills(name, skill_categories(type))')
          .eq('learner_id', learner.id)

        setSkills((history ?? []).map((h: any) => ({
          skillName: h.skills?.name ?? '',
          skillType: h.skills?.skill_categories?.type ?? 'digital',
          totalHours: Number(h.total_hours),
          sessionsCount: h.sessions_count,
        })))
      }

      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: FormData) {
    if (!userId) return
    setMsg('')

    await supabase.from('profiles').update({
      full_name: data.full_name,
      avatar_url: data.avatar_url || null,
    }).eq('id', userId)

    const { data: learner } = await supabase
      .from('learner_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (learner) {
      await supabase.from('learner_profiles').update({
        bio: data.bio || null,
      }).eq('id', learner.id)
    }

    setMsg('Perfil atualizado!')
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="text-sm text-[#718096]">Carregando...</div>

  return (
    <div className="max-w-lg">
      {msg && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-2 text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-[#16213E] text-lg">Meu Perfil</h2>
        <div>
          <Label>Nome completo</Label>
          <Input {...form.register('full_name')} className="mt-1" />
          {form.formState.errors.full_name && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.full_name.message}</p>
          )}
        </div>
        <div>
          <Label>URL do Avatar</Label>
          <Input {...form.register('avatar_url')} placeholder="https://..." className="mt-1" />
        </div>
        <div>
          <Label>Bio</Label>
          <textarea
            {...form.register('bio')}
            rows={3}
            className="mt-1 w-full rounded-lg border border-[#D6DCE8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16213E]/20"
            placeholder="Conte um pouco sobre você..."
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
        >
          {form.formState.isSubmitting ? 'Salvando...' : 'Salvar perfil'}
        </Button>
      </form>

      {/* Habilidades aprendidas */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
        <h2 className="font-bold text-[#16213E] text-lg mb-3">Minhas Habilidades Aprendidas</h2>
        {skills.length === 0 ? (
          <p className="text-sm text-[#718096]">Você ainda não completou sessões de aprendizado.</p>
        ) : (
          <div className="space-y-3">
            {skills.map((s, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[#D6DCE8] pb-2 last:border-0 last:pb-0">
                <SkillBadge name={s.skillName} type={s.skillType as 'digital' | 'physical'} size="md" />
                <div className="text-right">
                  <p className="text-sm font-medium text-[#16213E]">{s.totalHours}h registradas</p>
                  <p className="text-xs text-[#718096]">{s.sessionsCount} sessões</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
