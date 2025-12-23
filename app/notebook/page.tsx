'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';
import RecipeDetail from '../../components/RecipeDetail'; // Detay Modalı Eklendi

export default function Notebook() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null); // Seçili tarif state'i

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
    e.stopPropagation(); // Karta tıklamayı engelle
    if(!confirm("Silinsin mi?")) return;
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
                  onClick={() => setSelectedRecipe(recipe)} // Tıklayınca detayı aç
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                   <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="font-black text-slate-800 text-lg uppercase leading-tight">{title}</h3>
                      <button onClick={(e) => handleDelete(e, item.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm font-bold text-xs">✕</button>
                   </div>
                   
                   <p className="text-sm text-slate-500 mb-5 line-clamp-2 font-medium">{recipe.description || "Açıklama yok."}</p>
                   
                   <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-[10px] font-black text-slate-400 grid grid-cols-3 gap-1 text-center">
                      <span>🔥 {recipe.calories || 0}</span>
                      <span>🥩 {recipe.protein || '0g'}</span>
                      <span>🍞 {recipe.carbs || '0g'}</span>
                   </div>
                   
                   <div className="mt-auto pt-4 border-t border-slate-50 text-center">
                     <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">Detayları Gör →</span>
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
          onBookmark={() => {}} // Zaten kayıtlı olduğu için boş fonksiyon
        />
      )}
      
      <BottomNav />
    </div>
  );
}