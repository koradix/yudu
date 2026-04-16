'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Search, Calendar, GraduationCap, User } from 'lucide-react'

const navItems = [
  { label: 'Início', icon: Home, href: '/aprendiz/inicio' },
  { label: 'Explorar', icon: Search, href: '/explorar' },
  { label: 'Sessões', icon: Calendar, href: '/aprendiz/sessoes' },
  { label: 'Habilidades', icon: GraduationCap, href: '/aprendiz/perfil' },
  { label: 'Perfil', icon: User, href: '/aprendiz/perfil' },
]

export default function AprendizLayout({ children }: { children: React.ReactNode }) {
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
      <aside className="hidden md:flex md:flex-col md:w-56 bg-white border-r border-outline-variant/30 p-4 gap-1">
        <div className="text-xl font-bold italic text-primary mb-6 px-2">YUDU</div>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <a key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active ? 'text-primary bg-primary-fixed/20' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          )
        })}
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center h-14 px-4 bg-white border-b border-outline-variant/30">
          <span className="text-lg font-bold italic text-primary">YUDU</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <nav className="md:hidden flex items-center justify-around bg-white border-t border-outline-variant/30 h-16">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <a key={item.href} href={item.href}
                className={`flex flex-col items-center gap-0.5 text-xs font-medium ${
                  active ? 'text-primary' : 'text-on-surface-variant'
                }`}>
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
