'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EntrarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setErro('E-mail ou senha incorretos'); return }
    router.push('/auth/callback')
  }

  async function handleReset() {
    if (!email) { setErro('Digite seu e-mail primeiro'); return }
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#16213E] text-center mb-2">YUDU</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Bem-vindo de volta</p>

        {resetSent ? (
          <div className="text-center text-green-700 bg-green-50 rounded-lg p-4">
            Enviamos um link de redefinição para seu e-mail.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" className="mt-1" />
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Sua senha" className="mt-1" />
            </div>
            <button type="button" onClick={handleReset}
              className="text-sm text-gray-400 hover:text-gray-600 text-right -mt-2">
              Esqueci minha senha
            </button>
            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
            <Button type="submit" disabled={loading}
              className="w-full bg-[#16213E] hover:bg-[#1A2B6D] text-white font-semibold">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-center text-sm text-gray-500">
              Não tem conta?{' '}
              <a href="/cadastrar" className="text-[#16213E] font-semibold hover:underline">Cadastrar</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
