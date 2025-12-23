'use client';

interface RecipeCardProps {
  recipe: any;
  onSave: () => void;      // "Bu yemeği yaptım" (Günlüğe ekler)
  onBookmark: () => void;  // "Defterime ekle"
  onDetail: () => void;    // Karta tıklayınca detay açar
}

export default function RecipeCard({ 
  recipe, 
  onSave, 
  onBookmark, 
  onDetail 
}: RecipeCardProps) {
  // Başlık verisini garantiye alalım
  const title = recipe.title || recipe.name || "İsimsiz Tarif";

  return (
    <div 
      className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 transition-all hover:-translate-y-1 cursor-pointer group flex flex-col h-full"
      onClick={onDetail}
    >
      {/* BAŞLIK KISMI */}
      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-800 uppercase leading-tight line-clamp-2">
          {title}
        </h3>
        <div className="flex gap-3 mt-2">
           <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded-lg uppercase tracking-wider">
             🔥 {recipe.calories || 0} kcal
           </span>
        </div>
      </div>

      {/* AÇIKLAMA */}
      <p className="text-sm text-slate-500 mb-6 line-clamp-2 font-medium">
        {recipe.description || "Lezzetli ve sağlıklı bir seçenek."}
      </p>

      {/* BUTONLAR GRUBU (En Alta İteriz) */}
      <div className="mt-auto space-y-3">
        
        {/* 1. DEFTERE EKLE BUTONU (Belirgin ve Açık Renk) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
          className="w-full py-3 rounded-2xl bg-emerald-50 text-emerald-700 border-2 border-emerald-100 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span>📒</span> TARİF DEFTERİME EKLE
        </button>

        {/* 2. BU YEMEĞİ YAPTIM BUTONU (Koyu ve Ana Aksiyon) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
        >
          <span>✅</span> BU YEMEĞİ YAPTIM
        </button>
        
        {/* Bilgilendirme Notu */}
        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-wide opacity-60">
          * Yaptım dersen günlüğüne kaydedilir
        </p>
      </div>
    </div>
  );
}