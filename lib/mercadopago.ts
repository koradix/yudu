import { MercadoPagoConfig, Payment } from 'mercadopago'

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

interface CreatePixParams {
  amount: number
  description: string
  payerEmail: string
  externalReference: string
}

export async function createPixPayment({
  amount,
  description,
  payerEmail,
  externalReference,
}: CreatePixParams) {
  const payment = new Payment(mpClient)

  const result = await payment.create({
    body: {
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
      },
      external_reference: externalReference,
    },
  })

  return {
    id: String(result.id),
    qr_code: result.point_of_interaction?.transaction_data?.qr_code ?? '',
    qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64 ?? '',
    ticket_url: result.point_of_interaction?.transaction_data?.ticket_url ?? '',
  }
}
