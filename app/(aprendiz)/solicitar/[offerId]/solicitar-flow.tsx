'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, MapPin, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS, PLATFORM_FEE, EXPERT_PAYOUT } from '@/lib/constants'

const locationLabels: Record<string, string> = {
  remote: 'Remoto',
  in_person: 'Presencial',
  hybrid: 'Híbrido',
}

interface Props {
  offerId: string
  title: string
  offerType: string
  basePrice: number
  minPrice: number
  durationMin: number
  locationType: string
  expertName: string
  expertHeadline: string
  expertAvatarUrl: string | null
  userId: string
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function SolicitarFlow({
  offerId,
  title,
  offerType,
  basePrice,
  minPrice,
  durationMin,
  locationType,
  expertName,
  expertHeadline,
  expertAvatarUrl,
  userId,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [priceOption, setPriceOption] = useState<'base' | 'custom'>('base')
  const [customPrice, setCustomPrice] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const finalPrice = priceOption === 'base' ? basePrice : Number(customPrice) || 0
  const minAllowed = basePrice * 0.5
  const platformFee = finalPrice * PLATFORM_FEE
  const expertPayout = finalPrice * EXPERT_PAYOUT

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  function validateStep1() {
    if (priceOption === 'custom') {
      if (!customPrice || Number(customPrice) < minAllowed) {
        setErro(`Valor mínimo: ${formatPrice(minAllowed)}`)
        return false
      }
    }
    setErro('')
    return true
  }

  function validateStep2() {
    if (!date || !time) {
      setErro('Escolha data e horário')
      return false
    }
    setErro('')
    return true
  }

  async function handleConfirm() {
    setErro('')
    setLoading(true)

    const proposedDate = new Date(`${date}T${time}:00`)

    const { data: request, error } = await supabase.from('session_requests').insert({
      offer_id: offerId,
      requester_id: userId,
      proposed_price: finalPrice,
      message: message || null,
      proposed_date: proposedDate.toISOString(),
      status: 'pending',
    }).select('id').single()

    setLoading(false)

    if (error || !request) {
      setErro('Erro ao enviar solicitação. Tente novamente.')
      return
    }

    router.push(`/aprendiz/pagar/${request.id}`)
  }

  return (
    <>
      {step === 1 && (
        <div className="bg-white rounded-xl border border-[#D6DCE8] p-6">
          {/* Expert info */}
          <div className="flex items-center gap-3 mb-4">
            {expertAvatarUrl ? (
              <img src={expertAvatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-[#EEF1FA] flex items-center justify-center text-sm font-semibold text-[#1A2B6D]">
                {getInitials(expertName)}
              </div>
            )}
            <div>
              <p className="font-bold text-[#16213E] text-sm">{expertName}</p>
              <p className="text-xs text-[#718096]">{expertHeadline}</p>
            </div>
          </div>

          <span className="inline-flex items-center rounded-md bg-[#EEF1FA] px-2 py-0.5 text-[11px] font-medium text-[#1A2B6D]">
            {OFFER_TYPE_LABELS[offerType as keyof typeof OFFER_TYPE_LABELS] ?? offerType}
          </span>

          <h2 className="text-lg font-bold text-[#16213E] mt-2">{title}</h2>

          <div className="flex items-center gap-4 mt-3 text-sm text-[#718096]">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{durationMin}min</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{locationLabels[locationType] ?? locationType}</span>
          </div>

          <p className="text-2xl font-bold text-[#16213E] mt-4">{formatPrice(basePrice)}</p>

          {/* Proposta de preço */}
          <div className="mt-6 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceOption === 'base'}
                onChange={() => { setPriceOption('base'); setErro('') }}
                className="accent-[#16213E]"
              />
              <span className="text-sm text-[#16213E]">Aceitar preço base ({formatPrice(basePrice)})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceOption === 'custom'}
                onChange={() => setPriceOption('custom')}
                className="accent-[#16213E]"
              />
              <span className="text-sm text-[#16213E]">Propor outro valor</span>
            </label>
            {priceOption === 'custom' && (
              <Input
                type="number"
                step="0.01"
                min={minAllowed}
                value={customPrice}
                onChange={(e) => { setCustomPrice(e.target.value); setErro('') }}
                placeholder={`Mínimo ${formatPrice(minAllowed)}`}
                className="mt-1"
              />
            )}
          </div>

          {/* Mensagem */}
          <div className="mt-4">
            <Label className="text-sm text-[#718096]">Mensagem para o expert (opcional)</Label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Gostaria de aprender sobre..."
              className="mt-1 w-full rounded-lg border border-[#D6DCE8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16213E]/20"
            />
          </div>

          {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}

          <Button
            onClick={() => validateStep1() && setStep(2)}
            className="mt-4 w-full bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
          >
            Continuar →
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-[#D6DCE8] p-6">
          <h2 className="text-lg font-bold text-[#16213E] mb-4">Quando você quer a sessão?</h2>

          <div className="space-y-4">
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => { setDate(e.target.value); setErro('') }}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => { setTime(e.target.value); setErro('') }}
                className="mt-1"
              />
            </div>
          </div>

          <p className="text-xs text-[#718096] mt-4">
            O expert confirmará a disponibilidade após a solicitação.
          </p>

          {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <Button
              onClick={() => validateStep2() && setStep(3)}
              className="flex-1 bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
            >
              Confirmar →
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl border border-[#D6DCE8] p-6">
          <h2 className="text-lg font-bold text-[#16213E] mb-4">Revisão da solicitação</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#718096]">Expert</span>
              <span className="font-medium text-[#16213E]">{expertName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#718096]">Tipo</span>
              <span className="font-medium text-[#16213E]">
                {OFFER_TYPE_LABELS[offerType as keyof typeof OFFER_TYPE_LABELS] ?? offerType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#718096]">Data</span>
              <span className="font-medium text-[#16213E]">
                {date ? new Date(date + 'T00:00:00').toLocaleDateString('pt-BR') : ''} às {time}
              </span>
            </div>
            <hr className="border-[#D6DCE8]" />
            <div className="flex justify-between">
              <span className="text-[#718096]">Valor a pagar</span>
              <span className="text-2xl font-bold text-[#16213E]">{formatPrice(finalPrice)}</span>
            </div>
            <p className="text-[13px] text-green-700">Expert recebe {formatPrice(expertPayout)}</p>
            <p className="text-xs text-[#718096]">Taxa YUDU: {formatPrice(platformFee)}</p>
          </div>

          <div className="mt-4 border border-[#F5A623] bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-[#16213E]">
              Após confirmar, você receberá instruções de pagamento via Pix.
            </p>
          </div>

          {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
            >
              {loading ? 'Enviando...' : 'Confirmar e Pagar'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
