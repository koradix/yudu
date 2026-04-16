import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full">
        <h1 className="text-4xl font-bold text-[#263238] mb-2">YUDU</h1>
        <p className="text-6xl font-bold text-[#B07D05] mb-4">404</p>
        <p className="text-[#718096] mb-6">Página não encontrada</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[#263238] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a2327] transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
