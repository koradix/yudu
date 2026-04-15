'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Inbox, Calendar, DollarSign, User } from 'lucide-react'

const navItems = [
  { label: 'Início', icon: Home, href: '/expert/inicio' },
  { label: 'Propostas', icon: Inbox, href: '/expert/propostas' },
  { label: 'Sessões', icon: Calendar, href: '/expert/sessoes' },
  { label: 'Financeiro', icon: DollarSign, href: '/expert/financeiro' },
  { label: 'Perfil', icon: User, href: '/expert/perfil' },
]

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/entrar')
      else setReady(true)
    })
  }, [router])

  if (!ready) return null

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col md:w-56 bg-white border-r border-[#D6DCE8] p-4 gap-1">
        <div className="text-xl font-bold text-[#16213E] mb-6 px-2">YUDU</div>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? 'text-[#1A2B6D] bg-blue-50'
                  : 'text-[#718096] hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          )
        })}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header mobile */}
        <header className="md:hidden flex items-center h-14 px-4 bg-white border-b border-[#D6DCE8]">
          <span className="text-lg font-bold text-[#16213E]">YUDU</span>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>

        {/* Bottom nav mobile */}
        <nav className="md:hidden flex items-center justify-around bg-white border-t border-[#D6DCE8] h-16">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 text-xs font-medium ${
                  active ? 'text-[#1A2B6D]' : 'text-[#718096]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
