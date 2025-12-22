'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
// 1. BottomNav'ı içe aktar
import BottomNav from '@/components/BottomNav';

export default function Diary() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('meal_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setHistory(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    // 2. Sayfaya pb-32 ekleyerek navbar için boşluk bırakıyoruz
    <div className="min-h-screen bg-slate-50 pb-32 w-full overflow-x-hidden font-sans">
      
      {/* MODERN HEADER - Safe Area (pt-12) eklenmiş hali */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 pt-12 pb-4 px-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] mb-6">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">📊 YEMEK GÜNLÜĞÜM</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Beslenme Geçmişin</p>
          </div>
          <Link href="/" className="hidden lg:block bg-white border-2 border-slate-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
            ← Mutfağa Dön
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="animate-spin text-3xl mb-2 text-emerald-600">📊</div>
             <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Günlük Okunuyor...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
                <div className="flex flex-col gap-1">
                  <h3 className="font-black text-slate-800 text-base uppercase leading-tight">{item.recipe_name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(item.created_at).toLocaleDateString('tr-TR')} • {new Date(item.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="bg-orange-50 text-orange-600 font-black px-4 py-1.5 rounded-full text-xs border border-orange-100 shadow-sm">
                    {item.calories} kcal
                  </span>
                  
                  {/* Makro Değerler Kutusu */}
                  <div className="flex gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">P: {item.protein}g</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">K: {item.carbs}g</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">Y: {item.fats}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 mx-2">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto grayscale opacity-40">📊</div>
            <h3 className="text-slate-400 font-black text-sm uppercase tracking-widest mb-2">Henüz Kayıt Yok</h3>
            <Link href="/" className="text-emerald-600 font-bold text-xs hover:underline bg-emerald-50 px-5 py-2.5 rounded-full inline-block uppercase tracking-wider transition-all active:scale-95">
              Hadi bir şeyler pişir ✨
            </Link>
          </div>
        )}
      </main>

      {/* 3. BottomNav'ı en alta ekle */}
      <BottomNav />
    </div>
  );
}