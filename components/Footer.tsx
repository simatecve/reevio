import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-16 px-6">
      <div className="w-full">
        {/* Logo principal - ancho completo */}
        <div className="text-center mb-12">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-black text-white tracking-tight leading-none">
            reevio
          </h1>
        </div>
        
        {/* Información del creador y enlaces */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <span>
                By Nocodeveloper — maker of Vibe Prompts, NocodeShip, Koonetxa, and + others.
              </span>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}