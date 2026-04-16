import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { paymentId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: payment } = await supabase
    .from('payments')
    .select('id, status, payer_id')
    .eq('id', params.paymentId)
    .single()

  if (!payment) {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
  }

  if (payment.payer_id !== user.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  return NextResponse.json({ status: payment.status })
}
