'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Briefcase, Building2, ArrowLeft } from 'lucide-react'

const roles = [
  {
    value: 'learner' as const,
    label: 'Quero Aprender',
    description: 'Aprenda habilidades práticas ao lado de experts reais',
    icon: GraduationCap,
    color: 'border-amber-400 bg-amber-50',
  },
  {
    value: 'expert' as const,
    label: 'Sou Expert',
    description: 'Ensine, preste serviço e ganhe mais',
    icon: Briefcase,
    color: 'border-purple-400 bg-purple-50',
  },
  {
    value: 'client' as const,
    label: 'Quero Contratar',
    description: 'Contrate serviços com qualidade verificada',
    icon: Building2,
    color: 'border-teal-400 bg-teal-50',
  },
] as const

type Role = (typeof roles)[number]['value']

const schema = z
  .object({
    full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function CadastrarPage() {
  const supabase = createClient()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function selectRole(role: Role) {
    setSelectedRole(role)
    setStep(2)
  }

  async function onSubmit(data: FormData) {
    if (!selectedRole) return
    setErro('')
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, role: selectedRole },
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    })
    if (error) {
      setErro(error.message)
      return
    }
    setSucesso(true)
  }

  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-[2.5rem] p-10 md:p-12 editorial-shadow bento-card border border-outline-variant/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black font-headline text-primary tracking-tighter italic leading-none mb-3">
            YUDU
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant font-label">
            Inicie sua Jornada
          </p>
        </div>

        {sucesso ? (
          <div className="text-center text-primary bg-primary-fixed/30 rounded-2xl p-6 editorial-shadow font-medium animate-in fade-in zoom-in duration-500">
            <span className="material-symbols-outlined text-4xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <p className="text-lg font-black font-headline tracking-tighter mb-2">Conta criada com sucesso!</p>
            <p className="text-sm font-medium">Verifique seu e-mail para confirmar seu ingresso na oficina.</p>
          </div>
        ) : step === 1 ? (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center mb-2">Seu papel na oficina</p>
            
            <button
              onClick={() => selectRole('learner')}
              className={`group flex items-center gap-5 w-full rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                selectedRole === 'learner' 
                  ? 'border-primary bg-primary-fixed/20 shadow-lg scale-[1.02]' 
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="h-14 w-14 rounded-full bg-primary-fixed/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl">school</span>
              </div>
              <div>
                <p className="font-black font-headline text-on-surface tracking-tighter leading-none italic">Quero Aprender</p>
                <p className="text-[11px] font-medium text-on-surface-variant leading-tight mt-1.5">Habilidades práticas com experts reais</p>
              </div>
            </button>

            <button
              onClick={() => selectRole('expert')}
              className={`group flex items-center gap-5 w-full rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                selectedRole === 'expert' 
                  ? 'border-secondary bg-secondary-fixed/20 shadow-lg scale-[1.02]' 
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="h-14 w-14 rounded-full bg-secondary-fixed/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-3xl">workspace_premium</span>
              </div>
              <div>
                <p className="font-black font-headline text-on-surface tracking-tighter leading-none italic">Sou Expert</p>
                <p className="text-[11px] font-medium text-on-surface-variant leading-tight mt-1.5">Ensine seu ofício e monetize seu mestre</p>
              </div>
            </button>

            <button
              onClick={() => selectRole('client')}
              className={`group flex items-center gap-5 w-full rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                selectedRole === 'client' 
                  ? 'border-tertiary bg-tertiary-fixed/20 shadow-lg scale-[1.02]' 
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="h-14 w-14 rounded-full bg-tertiary-fixed/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-3xl">business_center</span>
              </div>
              <div>
                <p className="font-black font-headline text-on-surface tracking-tighter leading-none italic">Quero Contratar</p>
                <p className="text-[11px] font-medium text-on-surface-variant leading-tight mt-1.5">Serviços executados com mestria</p>
              </div>
            </button>

            <p className="text-center text-xs font-medium text-on-surface-variant mt-6">
              Já tem conta?{' '}
              <a href="/entrar" className="text-primary font-black font-headline hover:underline ml-1 leading-none italic">Entrar</a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> 
              Voltar aos Perfis
            </button>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Nome Completo</Label>
              <Input 
                {...register('full_name')} 
                placeholder="Como quer ser chamado?" 
                className="bg-surface-container-low border-none rounded-2xl p-6 h-12"
              />
              {errors.full_name && (
                <p className="text-error text-[10px] font-bold ml-1">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">E-mail</Label>
              <Input 
                {...register('email')} 
                type="email" 
                placeholder="seu@oficio.com" 
                className="bg-surface-container-low border-none rounded-2xl p-6 h-12"
              />
              {errors.email && (
                <p className="text-error text-[10px] font-bold ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Senha</Label>
                <Input 
                  {...register('password')} 
                  type="password" 
                  placeholder="8+ chars" 
                  className="bg-surface-container-low border-none rounded-2xl p-6 h-12"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Repetir</Label>
                <Input 
                  {...register('confirmPassword')} 
                  type="password" 
                  placeholder="Confirme" 
                  className="bg-surface-container-low border-none rounded-2xl p-6 h-12"
                />
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-error text-[10px] font-bold ml-1 -mt-2">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            {erro && (
              <p className="text-error text-xs font-bold text-center bg-error-container/20 py-2 rounded-lg border border-error/10">
                {erro}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-surface-tint text-white h-14 rounded-2xl font-black font-headline uppercase tracking-[0.2em] transition-all duration-300 editorial-shadow hover:scale-[1.02] mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Criando Oficina...</span>
              ) : (
                'Iniciar Minha Jornada'
              )}
            </button>

            <p className="text-center text-[11px] font-medium text-on-surface-variant mt-4 leading-relaxed">
              Ao se cadastrar, você concorda com os <br />
              <a href="#" className="font-bold border-b border-on-surface-variant/20">Termos da Oficina</a> e <a href="#" className="font-bold border-b border-on-surface-variant/20">Ética do Mestre</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
