'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
// 1. BottomNav'ı içe aktar
import BottomNav from '@/components/BottomNav';

export default function Notebook() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      const { data } = await supabase.from('saved_recipes').select('*').order('created_at', { ascending: false });
      setSavedRecipes(data || []);
      setLoading(false);
    }
    fetchSaved();
  }, []);

  const handleDelete = async (id: number) => {
    if(!confirm("Bu tarifi defterden silmek istiyor musun?")) return;
    await supabase.from('saved_recipes').delete().eq('id', id);
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    // 2. pb-32 ekleyerek alt menü için yer aç
    <div className="min-h-screen bg-slate-50 pb-32 w-full overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 pt-12 pb-4 px-6 shadow-sm mb-6">
         <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">📒 TARİF DEFTERİM</h1>
            <p className="text-slate-500 text-xs font-bold mt-1">Sakladığın özel tarifler.</p>
          </div>
          <Link href="/" className="hidden lg:block bg-white border-2 border-slate-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50">
            ← Mutfağa Dön
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="animate-spin text-3xl mb-2">📒</div>
             <p className="font-bold text-slate-400">Defter açılıyor...</p>
          </div>
        ) : savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full relative group hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-black text-slate-800 text-base uppercase leading-tight">{recipe.name}</h3>
                    <button onClick={() => handleDelete(recipe.id)} className="text-slate-300 hover:text-red-500 font-bold text-xs transition-colors px-2 py-1">SİL ✕</button>
                 </div>
                 <p className="text-sm text-slate-500 mb-5 line-clamp-2 font-medium">{recipe.description}</p>
                 
                 <div className="bg-slate-50 p-3 rounded-2xl mb-5 text-xs font-bold text-slate-500 grid grid-cols-3 gap-2 text-center border border-slate-100">
                    <span className="flex flex-col"><span className="text-lg">🔥</span> {recipe.calories} kcal</span>
                    <span className="flex flex-col"><span className="text-lg">🥩</span> {recipe.protein}g P</span>
                    <span className="flex flex-col"><span className="text-lg">🍞</span> {recipe.carbs}g K</span>
                 </div>

                 <div className="mt-auto">
                    <h4 className="font-black text-xs uppercase mb-2 text-emerald-600">Malzemeler Özet:</h4>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2">{recipe.ingredients?.join(', ')}</p>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 mx-2">
            <span className="text-5xl block mb-4 grayscale opacity-30">📒</span>
            <p className="text-slate-400 font-black uppercase tracking-wider mb-2">Defterin Boş</p>
            <Link href="/" className="text-emerald-600 font-bold text-sm hover:underline bg-emerald-50 px-4 py-2 rounded-full inline-block transition-all active:scale-95">
              Ana sayfaya git ve tarif ekle ✨
            </Link>
          </div>
        )}
      </main>

      {/* 3. BottomNav'ı en alta ekle */}
      <BottomNav />
    </div>
  );
}