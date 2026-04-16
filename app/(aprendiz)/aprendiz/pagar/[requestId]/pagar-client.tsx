'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS } from '@/lib/constants'

interface Props {
  requestId: string
  expertName: string
  expertAvatar: string | null
  expertHeadline: string
  offerTitle: string
  offerType: string
  amount: number
  platformFee: number
  proposedDate: string | null
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const EXPIRY_MINUTES = 30

export function PagarClient({
  requestId, expertName, expertAvatar, expertHeadline,
  offerTitle, offerType, amount, platformFee, proposedDate,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState('')
  const [qrCodeBase64, setQrCodeBase64] = useState('')
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_MINUTES * 60)
  const [paid, setPaid] = useState(false)

  // Generate Pix
  async function handleGeneratePix() {
    setLoading(true)
    setErro('')

    try {
      const res = await fetch('/api/pagamento/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_request_id: requestId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErro(data.error ?? 'Erro ao gerar pagamento')
        setLoading(false)
        return
      }

      setPaymentId(data.payment_id)
      setQrCode(data.qr_code)
      setQrCodeBase64(data.qr_code_base64)
    } catch {
      setErro('Erro de conexão')
    }
    setLoading(false)
  }

  // Countdown timer
  useEffect(() => {
    if (!paymentId || paid) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [paymentId, paid])

  // Poll payment status
  const checkStatus = useCallback(async () => {
    if (!paymentId || paid) return
    try {
      const res = await fetch(`/api/pagamento/status/${paymentId}`)
      const data = await res.json()
      if (data.status === 'released') {
        setPaid(true)
        setTimeout(() => router.push('/aprendiz/sessoes'), 2000)
      }
    } catch { /* ignore polling errors */ }
  }, [paymentId, paid, router])

  useEffect(() => {
    if (!paymentId || paid) return
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [paymentId, paid, checkStatus])

  async function handleCopy() {
    await navigator.clipboard.writeText(qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  // Paid state
  if (paid) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <CheckCircle className="h-16 w-16 text-[#2E7D32] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#263238] mb-2">Pagamento confirmado!</h2>
        <p className="text-sm text-[#718096]">Redirecionando para suas sessões...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#263238] mb-4">Resumo do pagamento</h2>

        <div className="flex items-center gap-3 mb-4">
          {expertAvatar ? (
            <img src={expertAvatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-[#EEF1FA] flex items-center justify-center text-sm font-semibold text-[#263238]">
              {getInitials(expertName)}
            </div>
          )}
          <div>
            <p className="font-bold text-sm text-[#263238]">{expertName}</p>
            <p className="text-xs text-[#718096]">{expertHeadline}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#718096]">Oferta</span>
            <span className="font-medium text-[#263238]">{offerTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#718096]">Tipo</span>
            <span className="text-[#263238]">
              {OFFER_TYPE_LABELS[offerType as keyof typeof OFFER_TYPE_LABELS] ?? offerType}
            </span>
          </div>
          {proposedDate && (
            <div className="flex justify-between">
              <span className="text-[#718096]">Data</span>
              <span className="text-[#263238]">
                {new Date(proposedDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
          <hr className="border-[#D6DCE8]" />
          <div className="flex justify-between">
            <span className="text-[#718096]">Subtotal</span>
            <span className="text-[#263238]">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#718096] text-xs">Taxa incluída (15%)</span>
            <span className="text-xs text-[#718096]">{formatPrice(platformFee)}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="font-bold text-[#263238]">Total</span>
            <span className="text-2xl font-bold text-[#263238]">{formatPrice(amount)}</span>
          </div>
        </div>
      </div>

      {/* QR Code section */}
      {!paymentId ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}
          <Button
            onClick={handleGeneratePix}
            disabled={loading}
            className="w-full bg-[#B07D05] hover:bg-[#8f6604] text-white font-semibold py-3"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Gerando Pix...</>
            ) : (
              'Gerar Pix'
            )}
          </Button>
          <p className="text-xs text-[#718096] text-center mt-2">
            Você receberá um QR Code para pagamento via Pix
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-[#B07D05]" />
            <span className="text-sm font-medium text-[#B07D05]">
              Expira em {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {secondsLeft === 0 ? (
            <div className="text-center">
              <p className="text-red-500 font-medium mb-3">QR Code expirado</p>
              <Button
                onClick={() => { setPaymentId(null); setSecondsLeft(EXPIRY_MINUTES * 60) }}
                variant="outline"
              >
                Gerar novo Pix
              </Button>
            </div>
          ) : (
            <>
              {/* QR Code image */}
              {qrCodeBase64 && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48 rounded-lg border border-[#D6DCE8]"
                  />
                </div>
              )}

              {/* Copy code */}
              {qrCode && (
                <div className="mb-4">
                  <label className="text-xs text-[#718096] block mb-1">Código Pix (copia e cola)</label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={qrCode}
                      rows={3}
                      className="w-full rounded-lg border border-[#D6DCE8] px-3 py-2 text-xs font-mono pr-12"
                    />
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 p-1.5 rounded bg-[#EEF1FA] hover:bg-gray-200 transition"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                      ) : (
                        <Copy className="h-4 w-4 text-[#263238]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Check button */}
              <Button
                onClick={checkStatus}
                variant="outline"
                className="w-full border-[#263238] text-[#263238]"
              >
                Já paguei — verificar
              </Button>

              <p className="text-xs text-[#718096] text-center mt-3">
                O status é verificado automaticamente a cada 5 segundos
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
