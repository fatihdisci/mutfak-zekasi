'use client';

// Tip tanımını açıkça yapıyoruz ki 'page.tsx' hata vermesin
interface RecipeCardProps {
  recipe: any;
  onSave: () => void;
  onBookmark: () => void;
  onDetail: () => void;
}

export default function RecipeCard({ 
  recipe, 
  onSave, 
  onBookmark, 
  onDetail 
}: RecipeCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 transition-all hover:-translate-y-1 cursor-pointer group"
      onClick={onDetail}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-black text-slate-800 uppercase leading-tight">
          {recipe.name || recipe.title}
        </h3>
        <button onClick={(e) => { e.stopPropagation(); onBookmark(); }} className="text-2xl">🔖</button>
      </div>
      <p className="text-sm text-slate-500 mb-6 line-clamp-2">{recipe.description}</p>
      <button 
        onClick={(e) => { e.stopPropagation(); onSave(); }}
        className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs"
      >
        🍽️ GÜNLÜĞE EKLE
      </button>
    </div>
  );
}