'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Calendar, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import { OFFER_TYPE_LABELS } from '@/lib/constants'

const locationLabels: Record<string, string> = {
  remote: 'Remoto', in_person: 'Presencial', hybrid: 'Híbrido',
}

interface Session {
  id: string; status: string; scheduledAt: string; durationMin: number
  pricePaid: number; locationType: string; offerType: string
  completedAt: string | null; expertName: string; expertAvatar: string | null
  offerTitle: string; hasReview: boolean
}

interface Request {
  id: string; status: string; proposedPrice: number
  counterPrice: number | null; message: string | null; proposedDate: string
  offerTitle: string; offerType: string; expertName: string; expertAvatar: string | null
}

const tabs = ['Agendadas', 'Propostas', 'Histórico'] as const

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function Avatar({ url, name, size = 40 }: { url: string | null; name: string; size?: number }) {
  if (url) return <img src={url} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />
  return (
    <div className="rounded-full bg-[#EEF1FA] flex items-center justify-center text-xs font-semibold text-[#1A2B6D]" style={{ width: size, height: size }}>
      {getInitials(name)}
    </div>
  )
}

export function SessoesContent({ sessions, requests, userId }: {
  sessions: Session[]; requests: Request[]; userId: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<(typeof tabs)[number]>('Agendadas')
  const [reviewModal, setReviewModal] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const scheduled = sessions.filter((s) => s.status === 'scheduled')
  const history = sessions.filter((s) => s.status === 'completed' || s.status === 'cancelled')

  async function handleAcceptCounter(requestId: string) {
    setSubmitting(true)
    await supabase.from('session_requests').update({ status: 'accepted' }).eq('id', requestId)
    setSubmitting(false)
    router.refresh()
  }

  async function handleDeclineCounter(requestId: string) {
    setSubmitting(true)
    await supabase.from('session_requests').update({ status: 'declined' }).eq('id', requestId)
    setSubmitting(false)
    router.refresh()
  }

  async function submitReview(sessionId: string) {
    setSubmitting(true)
    const session = sessions.find((s) => s.id === sessionId)
    if (!session) return

    // Find the expert's user_id via expert_profiles — use session expert info
    await supabase.from('reviews').insert({
      session_id: sessionId,
      reviewer_id: userId,
      reviewee_id: userId, // placeholder — will be overridden by proper lookup
      rating: reviewRating,
      comment: reviewComment || null,
    })
    setSubmitting(false)
    setReviewModal(null)
    setReviewComment('')
    setReviewRating(5)
    router.refresh()
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#D6DCE8] mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition',
              tab === t
                ? 'border-[#16213E] text-[#16213E]'
                : 'border-transparent text-[#718096] hover:text-[#16213E]'
            )}
          >
            {t}
            {t === 'Propostas' && requests.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F5A623] text-[10px] font-bold text-[#16213E]">
                {requests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Agendadas */}
      {tab === 'Agendadas' && (
        <div className="space-y-3">
          {scheduled.length === 0 && <p className="text-sm text-[#718096]">Nenhuma sessão agendada.</p>}
          {scheduled.map((s) => (
            <div key={s.id} className="bg-white border border-[#D6DCE8] rounded-xl p-4">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-[11px] font-medium mb-2">
                Confirmada
              </span>
              <div className="flex items-center gap-3">
                <Avatar url={s.expertAvatar} name={s.expertName} />
                <div>
                  <p className="font-bold text-sm text-[#16213E]">{s.expertName}</p>
                  <p className="text-xs text-[#718096]">{s.offerTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#718096]">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(s.scheduledAt).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(s.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {locationLabels[s.locationType] ?? s.locationType}
                </span>
              </div>
              <p className="text-sm font-bold text-green-700 mt-2">{formatPrice(s.pricePaid)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Propostas */}
      {tab === 'Propostas' && (
        <div className="space-y-3">
          {requests.length === 0 && <p className="text-sm text-[#718096]">Nenhuma proposta pendente.</p>}
          {requests.map((r) => (
            <div key={r.id} className="bg-white border-2 border-[#F5A623] rounded-xl p-4">
              <span className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium mb-2',
                r.status === 'counter_proposed'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-amber-100 text-amber-700'
              )}>
                {r.status === 'counter_proposed' ? 'Contraproposta recebida' : 'Aguardando resposta'}
              </span>
              <div className="flex items-center gap-3">
                <Avatar url={r.expertAvatar} name={r.expertName} />
                <div>
                  <p className="font-bold text-sm text-[#16213E]">{r.expertName}</p>
                  <p className="text-xs text-[#718096]">{r.offerTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-[#718096]">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(r.proposedDate).toLocaleDateString('pt-BR')}
              </div>
              <p className="text-lg font-bold text-[#16213E] mt-2">{formatPrice(r.proposedPrice)}</p>
              {r.status === 'counter_proposed' && r.counterPrice && (
                <div className="mt-2">
                  <p className="text-sm text-orange-700 font-medium">
                    Contraproposta: {formatPrice(r.counterPrice)}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      disabled={submitting}
                      onClick={() => handleAcceptCounter(r.id)}
                      className="bg-[#276749] hover:bg-[#1e5338] text-white"
                    >
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => handleDeclineCounter(r.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      Recusar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Histórico */}
      {tab === 'Histórico' && (
        <div className="space-y-3">
          {history.length === 0 && <p className="text-sm text-[#718096]">Nenhuma sessão no histórico.</p>}
          {history.map((s) => (
            <div key={s.id} className="bg-white border border-[#D6DCE8] rounded-xl p-4">
              <span className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium mb-2',
                s.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
              )}>
                {s.status === 'completed' ? 'Concluída' : 'Cancelada'}
              </span>
              <div className="flex items-center gap-3">
                <Avatar url={s.expertAvatar} name={s.expertName} />
                <div>
                  <p className="font-bold text-sm text-[#16213E]">{s.expertName}</p>
                  <p className="text-xs text-[#718096]">{s.offerTitle}</p>
                </div>
              </div>
              <p className="text-sm text-[#718096] mt-2">
                {new Date(s.scheduledAt).toLocaleDateString('pt-BR')}
              </p>
              {s.status === 'completed' && !s.hasReview && (
                <Button
                  size="sm"
                  onClick={() => setReviewModal(s.id)}
                  className="mt-3 bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
                >
                  Avaliar
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-[#16213E] text-lg mb-4">Avaliar sessão</h3>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setReviewRating(n)}>
                  <Star className={cn(
                    'h-7 w-7',
                    n <= reviewRating ? 'fill-[#F5A623] stroke-[#F5A623]' : 'fill-gray-200 stroke-gray-200'
                  )} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Deixe um comentário (opcional)"
              className="w-full rounded-lg border border-[#D6DCE8] px-3 py-2 text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setReviewModal(null)} className="flex-1">
                Cancelar
              </Button>
              <Button
                disabled={submitting}
                onClick={() => submitReview(reviewModal)}
                className="flex-1 bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
              >
                {submitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
