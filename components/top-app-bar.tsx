import Link from 'next/link'

export default function TopAppBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md editorial-shadow">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100/50 transition-colors scale-95 duration-200">
            <span className="material-symbols-outlined text-emerald-800">menu</span>
          </button>
          <Link href="/">
            <h1 className="text-2xl font-black text-emerald-900 italic font-headline tracking-tighter">
              YUDU
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link 
              href="/" 
              className="text-primary font-bold font-headline"
            >
              Visão Geral
            </Link>
            <Link 
              href="#" 
              className="text-zinc-500 hover:bg-zinc-100/50 px-2 rounded transition-colors"
            >
              Oficina
            </Link>
            <Link 
              href="/explorar" 
              className="text-zinc-500 hover:bg-zinc-100/50 px-2 rounded transition-colors"
            >
              Mentores
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-surface overflow-hidden">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWu7cH55fE-cxLPXBpaWKYp-bQJDkAJt-VziyM-BuJipKKcre1hefr7aD3GJThwKupPD5IpN6zpiZ4iDCNLOI_rYpc-ymVyNVEbgauNl-peJN900OzXZiaxB6It1xsFCVk9Er49xRF_ANN8h1di08KgERg2xcvWAIUooz0f6RztFczw84px-JaZauwavSF1E40E9W0zjQmJ0AXyDZF7uRFGseASBIhxdukPpHWE35JZZDKw4Sdp4uPCVH5YROaxtZOvdwHnRtYHsiV"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
