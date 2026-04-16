import { createClient } from '@/lib/supabase/server'
import { createPixPayment } from '@/lib/mercadopago'
import { NextResponse } from 'next/server'
import { PLATFORM_FEE, EXPERT_PAYOUT } from '@/lib/constants'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const { session_request_id } = body

  if (!session_request_id) {
    return NextResponse.json({ error: 'session_request_id obrigatório' }, { status: 400 })
  }

  // Fetch session_request with offer and requester info
  const { data: sessionRequest, error: reqError } = await supabase
    .from('session_requests')
    .select(`
      id, requester_id, proposed_price, proposed_date, status,
      offers!inner(
        id, title, offer_type, duration_min, location_type,
        expert_profiles!inner(id, user_id)
      )
    `)
    .eq('id', session_request_id)
    .single()

  if (reqError || !sessionRequest) {
    return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
  }

  if (sessionRequest.requester_id !== user.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  if (sessionRequest.status !== 'pending' && sessionRequest.status !== 'accepted') {
    return NextResponse.json({ error: 'Solicitação não está pendente' }, { status: 400 })
  }

  const offer = sessionRequest.offers as any
  const amount = Number(sessionRequest.proposed_price)
  const platformFee = +(amount * PLATFORM_FEE).toFixed(2)
  const expertPayout = +(amount * EXPERT_PAYOUT).toFixed(2)

  // Get payer email
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
  }

  // Get learner profile
  const { data: learnerProfile } = await supabase
    .from('learner_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  // Create Pix payment via Mercado Pago
  let mpPayment
  try {
    mpPayment = await createPixPayment({
      amount,
      description: `YUDU - ${offer.title}`,
      payerEmail: profile.email,
      externalReference: session_request_id,
    })
  } catch (err: any) {
    console.error('MP Error:', err)
    return NextResponse.json({ error: 'Erro ao gerar pagamento' }, { status: 500 })
  }

  // Create session first (payments.session_id is NOT NULL)
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      request_id: sessionRequest.id,
      expert_id: offer.expert_profiles.id,
      learner_id: learnerProfile?.id ?? null,
      offer_id: offer.id,
      offer_type: offer.offer_type,
      scheduled_at: sessionRequest.proposed_date,
      duration_min: offer.duration_min ?? 60,
      price_paid: amount,
      location_type: offer.location_type ?? 'remote',
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (sessionError || !session) {
    console.error('Session Error:', sessionError)
    return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 })
  }

  // Insert payment
  const { data: payment, error: payError } = await supabase
    .from('payments')
    .insert({
      session_id: session.id,
      payer_id: user.id,
      amount,
      platform_fee: platformFee,
      expert_payout: expertPayout,
      status: 'pending',
      gateway: 'mercadopago',
      gateway_payment_id: mpPayment.id,
      pix_code: mpPayment.qr_code,
    })
    .select('id')
    .single()

  if (payError || !payment) {
    console.error('Payment Error:', payError)
    return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 })
  }

  return NextResponse.json({
    payment_id: payment.id,
    qr_code: mpPayment.qr_code,
    qr_code_base64: mpPayment.qr_code_base64,
    ticket_url: mpPayment.ticket_url,
  })
}
