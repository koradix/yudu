'use client'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full">
        <h1 className="text-4xl font-bold text-[#263238] mb-2">YUDU</h1>
        <p className="text-xl font-bold text-red-500 mb-2">Algo deu errado</p>
        <p className="text-sm text-[#718096] mb-6">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="w-full rounded-lg bg-[#263238] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a2327] transition"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="w-full inline-flex items-center justify-center rounded-lg border border-[#263238] px-6 py-3 text-sm font-semibold text-[#263238] hover:bg-gray-50 transition"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}
