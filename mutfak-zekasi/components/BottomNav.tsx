'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navs = [
    { n: 'Mutfak', p: '/', i: '🍳' },
    { n: 'Defter', p: '/notebook', i: '📒' },
    { n: 'Günlük', p: '/diary', i: '📊' }
  ];

  return (
    // Container: Yüksekliği artırdık, gölgeyi güçlendirdik, border'ı netleştirdik
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-[100] lg:hidden">
      
      {/* h-24: Daha yüksek bir alan (iPhone Home çubuğu için yer açar) */}
      <nav className="flex justify-around items-start h-24 pt-3">
        {navs.map((n) => {
          const isActive = pathname === n.p;
          return (
            <Link 
              key={n.p} 
              href={n.p} 
              className="group w-full flex flex-col items-center gap-1 active:scale-95 transition-transform"
            >
              {/* İkon Kutusu: Aktifse arkasında hafif bir hare oluşur */}
              <div className={`relative p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-emerald-50 -translate-y-1' : ''}`}>
                <span className={`text-3xl block transition-all ${isActive ? 'scale-110 grayscale-0' : 'grayscale opacity-60'}`}>
                  {n.i}
                </span>
              </div>

              {/* Metin: Çok daha okunaklı, kalın ve belirgin */}
              <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-emerald-800' : 'text-slate-400'}`}>
                {n.n}
              </span>
              
              {/* Aktiflik Noktası (Opsiyonel ama şık durur) */}
              <div className={`w-1.5 h-1.5 rounded-full mt-1 transition-all ${isActive ? 'bg-emerald-600' : 'bg-transparent'}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}