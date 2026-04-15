import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const redirectMap: Record<string, string> = {
        learner: '/aprendiz/inicio',
        expert: '/expert/inicio',
        client: '/cliente/inicio',
        admin: '/admin',
      }

      const role = profile?.role ?? 'learner'
      return NextResponse.redirect(`${origin}${redirectMap[role]}`)
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth`)
}
