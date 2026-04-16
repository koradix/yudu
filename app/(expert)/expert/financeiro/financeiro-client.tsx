'use client'
import { DollarSign, Clock, Calendar } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

interface Payment {
  id: string; amount: number; platformFee: number; expertPayout: number
  status: string; createdAt: string; payerName: string
}

interface Props {
  totalReceived: number; totalPending: number; totalSessions: number
  payments: Payment[]
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  released: { label: 'Liberado', bg: 'bg-green-100', text: 'text-green-700' },
  pending: { label: 'Pendente', bg: 'bg-amber-100', text: 'text-amber-700' },
  captured: { label: 'Capturado', bg: 'bg-blue-100', text: 'text-blue-700' },
  refunded: { label: 'Reembolsado', bg: 'bg-gray-100', text: 'text-gray-600' },
  failed: { label: 'Falhou', bg: 'bg-red-100', text: 'text-red-600' },
  disputed: { label: 'Disputado', bg: 'bg-red-100', text: 'text-red-600' },
}

export function FinanceiroClient({ totalReceived, totalPending, totalSessions, payments }: Props) {
  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[#718096]">Total Recebido</p>
              <p className="text-xl font-bold text-green-700">{formatPrice(totalReceived)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[#718096]">Pendente Liberação</p>
              <p className="text-xl font-bold text-amber-700">{formatPrice(totalPending)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#263238]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#F7F8FC] flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#263238]" />
            </div>
            <div>
              <p className="text-xs text-[#718096]">Total Sessões</p>
              <p className="text-xl font-bold text-[#263238]">{totalSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <h3 className="font-bold text-[#263238]">Histórico de Pagamentos</h3>
        </div>

        {payments.length === 0 ? (
          <p className="text-sm text-[#718096] px-6 py-8 text-center">
            Nenhum pagamento registrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#F7F8FC]">
                  <th className="text-left text-xs font-medium text-[#718096] px-6 py-3">Data</th>
                  <th className="text-left text-xs font-medium text-[#718096] px-6 py-3">Aprendiz/Cliente</th>
                  <th className="text-right text-xs font-medium text-[#718096] px-6 py-3">Bruto</th>
                  <th className="text-right text-xs font-medium text-[#718096] px-6 py-3">Taxa (15%)</th>
                  <th className="text-right text-xs font-medium text-[#718096] px-6 py-3">Líquido</th>
                  <th className="text-center text-xs font-medium text-[#718096] px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const cfg = statusConfig[p.status] ?? statusConfig.pending
                  return (
                    <tr key={p.id} className="border-b border-[#e5e7eb] last:border-0">
                      <td className="px-6 py-3 text-sm text-[#263238]">
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-3 text-sm text-[#263238]">{p.payerName}</td>
                      <td className="px-6 py-3 text-sm text-right text-[#263238]">{formatPrice(p.amount)}</td>
                      <td className="px-6 py-3 text-sm text-right text-[#718096]">{formatPrice(p.platformFee)}</td>
                      <td className="px-6 py-3 text-sm text-right font-bold text-[#263238]">{formatPrice(p.expertPayout)}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', cfg.bg, cfg.text)}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
