'use client';

import { useEffect, useState } from 'react';
// Göreceli (relative) yol kullanıyoruz
import { supabase } from '../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';
import RecipeDetail from '../../components/RecipeDetail'; 

export default function Diary() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  useEffect(() => {
    async function fetchHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('meal_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      setHistory(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  // --- YENİ EKLENEN: SİLME FONKSİYONU ---
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Karta tıklayınca detayın açılmasını engelle
    
    if(!confirm("Bu öğünü günlüğünden silmek istediğine emin misin?")) return;
    
    const { error } = await supabase.from('meal_history').delete().eq('id', id);
    
    if (error) {
      console.error(error);
      alert("Silinirken bir hata oluştu.");
    } else {
      // Listeden silinen öğeyi anında kaldır
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 w-full font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/50 pt-12 pb-4 px-6 shadow-sm mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2">
          <span className="text-orange-500">📊</span> Yemek Günlüğü
        </h1>
        <p className="text-slate-400 text-xs font-bold mt-1 tracking-wide">Beslenme geçmişin</p>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Yükleniyor...</div>
        ) : history.length > 0 ? (
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-6 py-2">
            {history.map((item, i) => (
              <div 
                key={i} 
                onClick={() => item.recipe_data && setSelectedRecipe(item.recipe_data)}
                className={`relative bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group transition-all duration-300 pr-12 ${item.recipe_data ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : ''}`}
              >
                {/* Sol Çizgi Noktası */}
                <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-emerald-400 rounded-full shadow-sm z-10"></div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-black text-slate-800 text-sm uppercase leading-tight max-w-[200px]">
                    {item.name || "İsimsiz Öğün"}
                    {/* Eğer tarifi varsa butonu göster */}
                    {item.recipe_data && (
                      <span className="ml-2 inline-block text-[9px] text-white bg-emerald-500 px-2 py-0.5 rounded-full shadow-sm shadow-emerald-200 animate-pulse">
                        TARİFİ GÖR
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                    <span>🕒 {new Date(item.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-slate-300">•</span>
                    <span>{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="block font-black text-lg text-slate-800">{item.calories} <span className="text-[10px] text-slate-400 font-bold">kcal</span></span>
                </div>

                {/* --- SİLME BUTONU (Sağ Üst Köşe) --- */}
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 w-8 h-8 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm font-bold text-xs active:scale-90"
                  title="Bu öğünü sil"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <span className="text-4xl block mb-2 grayscale opacity-20">🍽️</span>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Henüz yemek yok</p>
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