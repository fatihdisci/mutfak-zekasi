'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// --- DÜZELTME: @ yerine göreceli (relative) yollar ---
import { supabase } from '../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';

export default function Notebook() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      // Auth kontrolü
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const uId = session.user.id;

      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', uId)
        .order('created_at', { ascending: false });
        
      if (error) console.error("Veri çekme hatası:", error);
      setSavedRecipes(data || []);
      setLoading(false);
    }
    fetchSaved();
  }, []);

  const handleDelete = async (id: number) => {
    if(!confirm("Bu tarifi silmek istediğine emin misin?")) return;
    await supabase.from('saved_recipes').delete().eq('id', id);
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 w-full font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/50 pt-12 pb-4 px-6 shadow-sm mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2">
          <span className="text-emerald-500">📒</span> Tarif Defterim
        </h1>
        <p className="text-slate-400 text-xs font-bold mt-1 tracking-wide">Favori lezzet arşivin</p>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Yükleniyor...</div>
        ) : savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedRecipes.map((item) => {
              // Veritabanı uyumluluğu için veri işleme
              const recipe = item.recipe_data || {};
              const title = item.title || recipe.title || recipe.name || "İsimsiz Tarif";
              const desc = recipe.description || "Açıklama yok.";
              
              return (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative group hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                   
                   <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="font-black text-slate-800 text-lg uppercase leading-tight tracking-tight">{title}</h3>
                      <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm font-bold text-xs">✕</button>
                   </div>
                   
                   <p className="text-sm text-slate-500 mb-5 line-clamp-2 font-medium leading-relaxed">{desc}</p>
                   
                   <div className="bg-slate-50/80 p-3 rounded-2xl mb-5 text-[10px] font-black text-slate-400 grid grid-cols-3 gap-1 text-center border border-slate-100">
                      <span className="flex flex-col items-center"><span className="text-lg mb-1">🔥</span>{recipe.calories || 0}</span>
                      <span className="flex flex-col items-center"><span className="text-lg mb-1">🥩</span>{recipe.protein || '0g'}</span>
                      <span className="flex flex-col items-center"><span className="text-lg mb-1">🍞</span>{recipe.carbs || '0g'}</span>
                   </div>

                   <div className="mt-auto pt-4 border-t border-slate-50">
                      <h4 className="font-black text-[10px] uppercase mb-1 text-emerald-600 tracking-widest">İçindekiler</h4>
                      <p className="text-xs text-slate-600 font-medium line-clamp-1">
                        {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : 'Malzeme detayı yok'}
                      </p>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 mx-2">
            <span className="text-5xl block mb-4 grayscale opacity-20">📂</span>
            <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">Defter Boş</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}