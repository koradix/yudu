'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6) // 6h–21h

interface Slot {
  id: string; weekday: number; startTime: string; endTime: string; isActive: boolean
}

function formatHour(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

function slotKey(weekday: number, hour: number) {
  return `${weekday}-${hour}`
}

export function DisponibilidadeClient({ expertId, initialSlots }: {
  expertId: string; initialSlots: Slot[]
}) {
  const supabase = createClient()

  // Build a set of active slots
  const initialActive = new Set<string>()
  initialSlots.forEach((s) => {
    if (s.isActive) {
      const startHour = parseInt(s.startTime.split(':')[0], 10)
      initialActive.add(slotKey(s.weekday, startHour))
    }
  })

  const [activeSlots, setActiveSlots] = useState<Set<string>>(initialActive)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function toggleSlot(weekday: number, hour: number) {
    const key = slotKey(weekday, hour)
    setActiveSlots((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function save() {
    setSaving(true)
    setMsg('')

    // Delete all existing slots
    await supabase.from('availability').delete().eq('expert_id', expertId)

    // Insert active slots
    const rows = Array.from(activeSlots).map((key) => {
      const [weekday, hour] = key.split('-').map(Number)
      return {
        expert_id: expertId,
        weekday,
        start_time: formatHour(hour),
        end_time: formatHour(hour + 1),
        is_active: true,
      }
    })

    if (rows.length > 0) {
      await supabase.from('availability').insert(rows)
    }

    setSaving(false)
    setMsg('Disponibilidade salva!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      {msg && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-2 text-sm">
          {msg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="w-16 text-xs text-[#718096] font-medium text-left py-2" />
              {DAYS.map((d, i) => (
                <th key={i} className="text-xs font-medium text-[#16213E] text-center py-2 px-1">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="text-[11px] text-[#718096] pr-2 py-0.5 text-right">
                  {formatHour(hour)}
                </td>
                {DAYS.map((_, weekday) => {
                  const key = slotKey(weekday, hour)
                  const active = activeSlots.has(key)
                  return (
                    <td key={weekday} className="p-0.5">
                      <button
                        onClick={() => toggleSlot(weekday, hour)}
                        className={cn(
                          'w-full h-8 rounded border transition',
                          active
                            ? 'bg-amber-100 border-amber-400'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        )}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Button
          onClick={save}
          disabled={saving}
          className="bg-[#F5A623] hover:bg-[#e0951c] text-[#16213E] font-semibold"
        >
          {saving ? 'Salvando...' : 'Salvar disponibilidade'}
        </Button>
        <div className="flex items-center gap-2 text-xs text-[#718096]">
          <div className="h-4 w-4 rounded bg-amber-100 border border-amber-400" /> Disponível
          <div className="h-4 w-4 rounded bg-gray-50 border border-gray-200 ml-2" /> Indisponível
        </div>
      </div>
    </div>
  )
}
