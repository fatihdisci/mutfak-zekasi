'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BottomNav from '@/components/BottomNav';
import { getUserId } from '@/lib/auth';

export default function Notebook() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      const uId = getUserId();
      const { data } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', uId) // 👈 Sadece benim sakladıklarım
        .order('created_at', { ascending: false });
      
      setSavedRecipes(data || []);
      setLoading(false);
    }
    fetchSaved();
  }, []);

  // Silme işlemine dokunmuyoruz, id bazlı zaten.

  return (
    <div className="min-h-screen bg-slate-50 pb-32 w-full">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 pt-12 pb-4 px-6 shadow-sm mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">📒 TARİF DEFTERİM</h1>
        <p className="text-slate-500 text-xs font-bold mt-1">Sana Özel Saklananlar</p>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {/* ... (Daha önceki notebook tasarımı aynı kalıyor, sadece filtreleme eklendi) ... */}
      </main>
      <BottomNav />
    </div>
  );
}