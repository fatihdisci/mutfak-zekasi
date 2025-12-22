'use client';

import { useState } from 'react';

interface RecipeProps {
  recipe: {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  onSave: () => void; // Yemek geçmişine kaydetme (Yedim)
  onBookmark: () => void; // Tarif defterine kaydetme (Sakla)
}

export default function RecipeCard({ recipe, onSave, onBookmark }: RecipeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    onBookmark();
    setIsBookmarked(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
      
      {/* Üst Kısım: Başlık ve Kalori */}
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-slate-800 leading-tight uppercase tracking-tight">
            {recipe.name}
          </h3>
          <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">
            {recipe.calories} kcal
          </span>
        </div>
        <p className="text-sm text-slate-500 font-medium line-clamp-2">{recipe.description}</p>
      </div>

      {/* Makro Besinler */}
      <div className="px-6 py-3 border-y border-slate-100 bg-slate-50/50 flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
        <span>PRO: <span className="text-slate-700">{recipe.protein}g</span></span>
        <span>KARB: <span className="text-slate-700">{recipe.carbs}g</span></span>
        <span>YAĞ: <span className="text-slate-700">{recipe.fats}g</span></span>
      </div>

      {/* Detaylar (Gizle/Göster) */}
      <div className="flex-grow p-6 space-y-4">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline"
        >
          {showDetails ? 'TARİFİ GİZLE' : 'TARİFİ GÖSTER'}
        </button>

        {showDetails && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">Malzemeler</h4>
              <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">Hazırlanışı</h4>
              <ol className="text-sm text-slate-600 list-decimal list-inside space-y-2">
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Aksiyon Butonları */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
        {/* Buton 1: Deftere Kaydet */}
        <button 
          onClick={handleBookmark}
          disabled={isBookmarked}
          className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${isBookmarked ? 'bg-slate-200 text-slate-400' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600'}`}
        >
          {isBookmarked ? 'DEFTERDE ✔' : 'DEFTERE EKLE 🔖'}
        </button>

        {/* Buton 2: Yemeği Yaptım */}
        <button 
          onClick={onSave}
          className="bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
        >
          BU YEMEĞİ YAPTIM 🍳
        </button>
      </div>
    </div>
  );
}