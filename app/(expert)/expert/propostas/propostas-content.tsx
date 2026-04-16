'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS } from '@/lib/constants'

interface PropostaItem {
  id: string; status: string; proposedPrice: number
  counterPrice: number | null; message: string | null
  proposedDate: string; createdAt: string
  requesterName: string; requesterAvatar: string | null; requesterId: string
  offerId: string; offerTitle: string; offerType: string
  durationMin: number; locationType: string; basePrice: number
  expertProfileId: string
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function PropostasContent({ requests }: { requests: PropostaItem[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState<string | null>(null)
  const [counterModal, setCounterModal] = useState<string | null>(null)
  const [counterValue, setCounterValue] = useState('')

  async function handleAccept(req: PropostaItem) {
    setLoading(req.id)

    // Update request status
    await supabase
      .from('session_requests')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', req.id)

    // Create session
    await supabase.from('sessions').insert({
      request_id: req.id,
      expert_id: req.expertProfileId,
      offer_id: req.offerId,
      offer_type: req.offerType,
      scheduled_at: req.proposedDate,
      duration_min: req.durationMin,
      price_paid: req.proposedPrice,
      location_type: req.locationType,
      status: 'scheduled',
    } as any)

    setLoading(null)
    router.push('/expert/sessoes')
  }

  async function handleDecline(requestId: string) {
    setLoading(requestId)
    await supabase
      .from('session_requests')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', requestId)
    setLoading(null)
    router.refresh()
  }

  async function handleCounter(requestId: string) {
    if (!counterValue || Number(counterValue) <= 0) return
    setLoading(requestId)
    await supabase
      .from('session_requests')
      .update({
        status: 'counter_proposed',
        counter_price: Number(counterValue),
        responded_at: new Date().toISOString(),
      })
      .eq('id', requestId)
    setLoading(null)
    setCounterModal(null)
    setCounterValue('')
    router.refresh()
  }

  if (requests.length === 0) {
    return <p className="text-sm text-[#718096]">Nenhuma proposta pendente no momento.</p>
  }

  return (
    <>
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="bg-white border border-[#D6DCE8] rounded-xl p-4">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-[11px] font-medium mb-2">
              {r.status === 'pending' ? 'Nova' : 'Pendente'}
            </span>

            <div className="flex items-center gap-3">
              {r.requesterAvatar ? (
                <img src={r.requesterAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#EEF1FA] flex items-center justify-center text-xs font-semibold text-[#1A2B6D]">
                  {getInitials(r.requesterName)}
                </div>
              )}
              <div>
                <p className="font-bold text-sm text-[#16213E]">{r.requesterName}</p>
                <p className="text-xs text-[#718096]">
                  {OFFER_TYPE_LABELS[r.offerType as keyof typeof OFFER_TYPE_LABELS] ?? r.offerType} — {r.offerTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-[#718096]">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(r.proposedDate).toLocaleDateString('pt-BR')} às{' '}
              {new Date(r.proposedDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>

            <p className="text-lg font-bold text-[#16213E] mt-2">{formatPrice(r.proposedPrice)}</p>

            {r.message && (
              <p className="text-[13px] text-[#718096] italic mt-2 border-l-2 border-[#D6DCE8] pl-3">
                {r.message}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                size="sm"
                disabled={loading === r.id}
                onClick={() => handleAccept(r)}
                className="bg-[#276749] hover:bg-[#1e5338] text-white rounded-lg px-4"
              >
                Aceitar
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={loading === r.id}
                onClick={() => handleDecline(r.id)}
                className="border-red-500 text-red-500 hover:bg-red-50 rounded-lg px-4"
              >
                Recusar
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={loading === r.id}
                onClick={() => { setCounterModal(r.id); setCounterValue('') }}
                className="border-[#16213E] text-[#16213E] hover:bg-[#EEF1FA] rounded-lg px-4"
              >
                Contraproposta
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Counter proposal modal */}
      {counterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-[#16213E] text-lg mb-4">Contraproposta</h3>
            <p className="text-sm text-[#718096] mb-3">Informe o valor que deseja propor:</p>
            <Input
              type="number"
              step="0.01"
              value={counterValue}
              onChange={(e) => setCounterValue(e.target.value)}
              placeholder="R$ valor"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setCounterModal(null)} className="flex-1">
                Cancelar
              </Button>
              <Button
                disabled={loading === counterModal}
                onClick={() => handleCounter(counterModal)}
                className="flex-1 bg-[#16213E] hover:bg-[#1A2B6D] text-white font-semibold"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
