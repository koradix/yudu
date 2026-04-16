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
    <div className="bg-surface-container-lowest editorial-shadow border border-outline-variant/30 rounded-DEFAULT p-2 flex gap-2 max-w-xl">
      <div className="flex items-center gap-3 flex-1 px-4">
        <span className="material-symbols-outlined text-primary text-xl">search</span>
        <input
          className="bg-transparent text-on-surface placeholder-on-surface-variant/50 flex-1 py-3 outline-none text-base font-body"
          placeholder="Ex: marcenaria, design gráfico, elétrica..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-primary text-on-primary px-6 py-3 rounded-DEFAULT font-bold font-headline hover:bg-surface-tint transition shrink-0"
      >
        Buscar
      </button>
    </div>
  )
}
