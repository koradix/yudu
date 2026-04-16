'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SUGGESTIONS_LIST = [
  'Instalação de ar-condicionado',
  'Energia solar',
  'Elétrica residencial',
  'Marcenaria',
  'Encanamento',
  'Design gráfico',
  'Desenvolvimento web',
  'Barbearia',
]

export default function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (value.trim()) {
        const filtered = SUGGESTIONS_LIST.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredSuggestions(filtered)
        setShowDropdown(filtered.length > 0)
      } else {
        setFilteredSuggestions([])
        setShowDropdown(false)
      }
    }, 300)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowDropdown(false)
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/explorar')
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-10" ref={dropdownRef}>
      <div className="bg-white rounded-2xl shadow-xl p-2 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() && filteredSuggestions.length > 0) {
              setShowDropdown(true)
            }
          }}
          placeholder="O que você quer aprender?"
          className="flex-1 px-4 py-3 text-gray-800 outline-none rounded-xl"
        />
        <button
          onClick={handleSearch}
          className="bg-[#B07D05] hover:bg-[#8f6604] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Buscar
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg divide-y z-50 overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-[#F7F8FC] cursor-pointer text-left text-sm text-gray-700 transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
