'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HeroSearchBar() {
  const router = useRouter()
  const [value, setValue] = useState('')

  function handleSearch() {
    if (value.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(value.trim())}`)
    } else {
      router.push('/explorar')
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2 flex gap-2 max-w-xl">
      <input
        className="bg-transparent text-white placeholder-gray-400 flex-1 px-4 py-3 outline-none text-base"
        placeholder="Ex: marcenaria, design gráfico, elétrica..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-[#B07D05] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#8f6604] transition shrink-0"
      >
        Buscar
      </button>
    </div>
  )
}
