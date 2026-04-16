import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import TopAppBar from '@/components/top-app-bar'
import BottomNavBar from '@/components/bottom-nav-bar'
import './globals.css'

export const metadata: Metadata = {
  title: 'YUDU',
  description: 'Aprenda Fazendo. Com Experts Reais.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface-container-low font-body text-on-surface min-h-[100dvh]">
        <TopAppBar />
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
          {children}
        </main>
        <BottomNavBar />
        <Toaster />
      </body>
    </html>
  )
}
