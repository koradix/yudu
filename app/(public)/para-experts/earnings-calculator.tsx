'use client'
import { useState } from 'react'

export function EarningsCalculator() {
  const [hours, setHours] = useState(8)
  const earnings = hours * 4 * 100

  return (
    <div className="bg-[#F7F8FC] rounded-2xl p-8 max-w-md mx-auto">
      <label className="text-sm font-medium text-gray-600 block mb-3">
        Quantas horas por semana você pode dedicar?
      </label>
      <input
        type="range"
        min={1}
        max={20}
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        className="w-full accent-[#B07D05] mb-2"
      />
      <div className="flex justify-between text-xs text-gray-400 mb-6">
        <span>1h</span>
        <span className="font-bold text-[#263238]">{hours}h/semana</span>
        <span>20h</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">Você pode ganhar</p>
      <p className="text-4xl font-bold text-[#B07D05]">
        R$ {earnings.toLocaleString('pt-BR')}<span className="text-lg font-normal text-gray-400">/mês</span>
      </p>
      <p className="text-xs text-gray-400 mt-2">Sem deixar seu trabalho atual. Média de R$ 100/h.</p>
    </div>
  )
}
