import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const journey = body.journey as string | null

  if (journey && journey !== 'digital' && journey !== 'physical') {
    return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
  }

  // For now, store in user metadata (no schema change needed)
  await supabase.auth.updateUser({
    data: { preferred_journey: journey },
  })

  return NextResponse.json({ ok: true })
}
