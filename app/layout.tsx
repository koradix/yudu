import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-[#F7F8FC] text-[#263238]`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
