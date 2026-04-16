import { NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Only handle payment notifications
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ received: true })
    }

    const mpPaymentId = String(body.data.id)

    // Fetch payment status from Mercado Pago
    const paymentApi = new Payment(mpClient)
    const mpPayment = await paymentApi.get({ id: Number(mpPaymentId) })

    if (!mpPayment) {
      return NextResponse.json({ received: true })
    }

    const supabase = createClient()

    // Find our payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('id, session_id, status')
      .eq('gateway_payment_id', mpPaymentId)
      .single()

    if (!payment) {
      console.error('Payment not found for MP ID:', mpPaymentId)
      return NextResponse.json({ received: true })
    }

    if (mpPayment.status === 'approved') {
      // Update payment to released
      await supabase
        .from('payments')
        .update({
          status: 'released',
          captured_at: new Date().toISOString(),
          released_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      // Get session to find the request_id
      const { data: session } = await supabase
        .from('sessions')
        .select('request_id')
        .eq('id', payment.session_id)
        .single()

      if (session?.request_id) {
        // Update session_request to accepted
        await supabase
          .from('session_requests')
          .update({ status: 'accepted', responded_at: new Date().toISOString() })
          .eq('id', session.request_id)
      }
    } else if (mpPayment.status === 'rejected' || mpPayment.status === 'cancelled') {
      // Update payment to failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id)

      // Cancel the session
      await supabase
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', payment.session_id)
    }

    // Always return 200 so MP doesn't retry
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    // Still return 200 to avoid retries
    return NextResponse.json({ received: true })
  }
}
