'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

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
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">📒 TARİF DEFTERİM</h1>
            <p className="text-slate-500 text-sm mt-1">Beğendiğin ve sakladığın özel tarifler.</p>
          </div>
          <Link href="/" className="bg-white border-2 border-slate-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50">
            ← Mutfağa Dön
          </Link>
        </header>

        {loading ? (
          <p className="text-center py-20 font-bold text-slate-400">Defter açılıyor...</p>
        ) : savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-slate-800 text-lg uppercase">{recipe.name}</h3>
                    <button onClick={() => handleDelete(recipe.id)} className="text-red-400 hover:text-red-600 font-bold text-xs">SİL ✕</button>
                 </div>
                 <p className="text-sm text-slate-500 mb-4 line-clamp-2">{recipe.description}</p>
                 
                 <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs font-bold text-slate-500 grid grid-cols-3 gap-2 text-center">
                    <span>🔥 {recipe.calories} kcal</span>
                    <span>🥩 {recipe.protein}g Prot</span>
                    <span>🍞 {recipe.carbs}g Karb</span>
                 </div>

                 <div className="mt-auto">
                    <h4 className="font-bold text-xs uppercase mb-1">Malzemeler:</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{recipe.ingredients?.join(', ')}</p>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span className="text-4xl block mb-4 grayscale opacity-50">📒</span>
            <p className="text-slate-400 font-bold">Defterin şimdilik boş.</p>
            <Link href="/" className="text-emerald-600 font-bold text-sm hover:underline mt-2 inline-block">
              Tarif oluştur ve "Deftere Ekle" butonuna bas!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}