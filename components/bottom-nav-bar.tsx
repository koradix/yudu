import Link from 'next/link'

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/90 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] md:hidden">
      {/* Início (Active) */}
      <Link 
        href="/" 
        className="flex flex-col items-center justify-center text-emerald-800 bg-emerald-50 rounded-full px-4 py-1 scale-110 duration-300 ease-out"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          home
        </span>
        <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">
          Início
        </span>
      </Link>

      {/* Projetos */}
      <Link 
        href="#" 
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-emerald-600 transition-colors"
      >
        <span className="material-symbols-outlined">handyman</span>
        <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">
          Projetos
        </span>
      </Link>

      {/* Mensagens */}
      <Link 
        href="#" 
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-emerald-600 transition-colors"
      >
        <span className="material-symbols-outlined">chat_bubble</span>
        <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">
          Mensagens
        </span>
      </Link>

      {/* Perfil */}
      <Link 
        href="#" 
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-emerald-600 transition-colors"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">
          Perfil
        </span>
      </Link>
    </nav>
  )
}
