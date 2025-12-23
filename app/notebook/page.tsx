'use client';

import { useEffect, useState } from 'react';
// Göreceli (relative) importlar korundu
import { supabase } from '../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';
import RecipeDetail from '../../components/RecipeDetail';

export default function Notebook() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  useEffect(() => {
    async function fetchSaved() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      setSavedRecipes(data || []);
      setLoading(false);
    }
    fetchSaved();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if(!confirm("Bu tarifi defterden silmek istiyor musun?")) return;
    await supabase.from('saved_recipes').delete().eq('id', id);
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 w-full font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/50 pt-12 pb-4 px-6 shadow-sm mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2">
          <span className="text-emerald-500">📒</span> Tarif Defterim
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Yükleniyor...</div>
        ) : savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedRecipes.map((item) => {
              const recipe = item.recipe_data || {};
              const title = item.title || recipe.title || "İsimsiz Tarif";
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                   {/* Başlık ve Silme Butonu */}
                   <div className="flex justify-between items-start mb-4 gap-2">
                      <h3 className="font-black text-slate-800 text-lg uppercase leading-tight">{title}</h3>
                      <button 
                        onClick={(e) => handleDelete(e, item.id)} 
                        className="bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm font-bold text-xs shrink-0"
                      >
                        ✕
                      </button>
                   </div>
                   
                   {/* 1. DEĞİŞİKLİK: Açıklama yoksa bu alan hiç görünmeyecek */}
                   {recipe.description && (
                     <p className="text-sm text-slate-500 mb-6 line-clamp-2 font-medium">
                       {recipe.description}
                     </p>
                   )}
                   
                   {/* 2. DEĞİŞİKLİK: Besin Değerleri Büyütüldü */}
                   <div className="bg-slate-50 p-4 rounded-2xl mb-4 grid grid-cols-3 gap-2 text-center border border-slate-100/50">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl">🔥</span>
                        <span className="text-sm font-black text-slate-800">{recipe.calories || 0}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">kcal</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1 border-l border-slate-100">
                        <span className="text-xl">🥩</span>
                        <span className="text-sm font-black text-slate-800">{recipe.protein || '0g'}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Prot</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1 border-l border-slate-100">
                        <span className="text-xl">🍞</span>
                        <span className="text-sm font-black text-slate-800">{recipe.carbs || '0g'}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Karb</span>
                      </div>
                   </div>
                   
                   <div className="mt-auto pt-2 text-center">
                     <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">
                       Detayları Gör →
                     </span>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <span className="text-5xl block mb-4 grayscale opacity-20">📂</span>
            <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">Defter Boş</p>
          </div>
        )}
      </main>

      {/* DETAY MODALI */}
      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onBookmark={() => {}}
        />
      )}
      
      <BottomNav />
    </div>
  );
}