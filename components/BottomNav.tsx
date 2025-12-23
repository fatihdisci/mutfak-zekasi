'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Profesyonel Mobil & PC Uyumlu Navbar
 * - Turuncu nokta kaldırıldı.
 * - Karakter hataları düzeltildi.
 * - Glassmorphism efekti eklendi.
 */
export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Mutfak', path: '/', icon: '🍳' },
    { name: 'Defter', path: '/notebook', icon: '📖' },
    { name: 'Günlük', path: '/diary', icon: '📓' },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 px-8 z-50">
      <nav className="max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-3 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
        {navItems.map((item) => {
          const active = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className="relative flex flex-col items-center py-2 px-6 transition-all duration-300"
            >
              {/* Aktiflik Arka Planı (Yumuşak dolgu) */}
              {active && (
                <div className="absolute inset-0 bg-slate-100/90 rounded-2xl -z-10 animate-in fade-in zoom-in duration-300" />
              )}
              
              {/* İkon - Turuncu nokta yok, sadece boyut ve opaklık değişimi */}
              <span className={`text-2xl transition-all duration-300 ${active ? 'scale-110 -translate-y-0.5' : 'grayscale opacity-40 hover:opacity-70'}`}>
                {item.icon}
              </span>
              
              {/* Yazı */}
              <span className={`text-[10px] mt-1 font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}