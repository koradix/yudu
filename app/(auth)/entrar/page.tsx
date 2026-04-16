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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error || !data.user) { setErro('E-mail ou senha incorretos'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const redirectMap: Record<string, string> = {
      learner: '/aprendiz/inicio',
      expert: '/expert/inicio',
      client: '/cliente/inicio',
      admin: '/admin',
    }
    const role = profile?.role ?? 'learner'
    router.push(redirectMap[role])
  }

  async function handleReset() {
    if (!email) { setErro('Digite seu e-mail primeiro'); return }
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    setResetSent(true)
  }

  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-[2.5rem] p-10 md:p-12 editorial-shadow bento-card border border-outline-variant/10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black font-headline text-primary tracking-tighter italic leading-none mb-3">
            YUDU
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant font-label">
            Oficina de Aprendizado
          </p>
        </div>

        {resetSent ? (
          <div className="text-center text-primary bg-primary-fixed/30 rounded-2xl p-6 editorial-shadow font-medium animate-in fade-in zoom-in duration-500">
            <span className="material-symbols-outlined text-4xl mb-4 block">mail</span>
            <p>Enviamos um link de redefinição <br /> para seu e-mail.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">E-mail</Label>
              <Input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@oficio.com" 
                className="bg-surface-container-low border-none rounded-2xl p-6 h-14"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Senha</Label>
                <button type="button" onClick={handleReset}
                  className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors">
                  Esqueci a senha
                </button>
              </div>
              <Input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Sua chave de acesso" 
                className="bg-surface-container-low border-none rounded-2xl p-6 h-14"
              />
            </div>

            {erro && (
              <p className="text-error text-xs font-bold text-center bg-error-container/20 py-2 rounded-lg border border-error/10">
                {erro}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-surface-tint text-white h-14 rounded-2xl font-black font-headline uppercase tracking-[0.2em] transition-all duration-300 editorial-shadow hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Acessando...</span>
              ) : (
                <>
                  Entrar na Oficina
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>

            <p className="text-center text-xs font-medium text-on-surface-variant mt-4">
              Ainda não tem conta?{' '}
              <a href="/cadastrar" className="text-primary font-black font-headline hover:underline ml-1">Cadastrar</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
