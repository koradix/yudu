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
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#16213E] text-center mb-2">YUDU</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Crie sua conta</p>

        {sucesso ? (
          <div className="text-center text-green-700 bg-green-50 rounded-lg p-4">
            Conta criada! Verifique seu e-mail para confirmar o cadastro.
          </div>
        ) : step === 1 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600 text-center mb-2">Escolha seu perfil</p>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => selectRole(role.value)}
                className={`flex items-center gap-4 w-full rounded-lg border-2 p-4 text-left transition hover:shadow-md ${
                  selectedRole === role.value ? role.color : 'border-gray-200'
                }`}
              >
                <role.icon className="h-8 w-8 text-[#16213E] shrink-0" />
                <div>
                  <p className="font-semibold text-[#16213E]">{role.label}</p>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </button>
            ))}
            <p className="text-center text-sm text-gray-500 mt-4">
              Já tem conta?{' '}
              <a href="/entrar" className="text-[#16213E] font-semibold hover:underline">
                Entrar
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 w-fit"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>

            <div>
              <Label>Nome completo</Label>
              <Input {...register('full_name')} placeholder="Seu nome" className="mt-1" />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <Label>E-mail</Label>
              <Input {...register('email')} type="email" placeholder="seu@email.com" className="mt-1" />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Senha</Label>
              <Input {...register('password')} type="password" placeholder="Mínimo 8 caracteres" className="mt-1" />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label>Confirmar senha</Label>
              <Input {...register('confirmPassword')} type="password" placeholder="Repita a senha" className="mt-1" />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Já tem conta?{' '}
              <a href="/entrar" className="text-[#16213E] font-semibold hover:underline">
                Entrar
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
