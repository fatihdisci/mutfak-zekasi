'use client';

interface RecipeDetailProps {
  recipe: any;
  onClose: () => void;
  onBookmark: () => void;
}

export default function RecipeDetail({ recipe, onClose, onBookmark }: RecipeDetailProps) {
  if (!recipe) return null;

  // Veri eşleştirme (Mapping) - Hem İngilizce hem Türkçe anahtarları kontrol eder
  const title = recipe.title || recipe.name || recipe.yemek_adi || "İsimsiz Tarif";
  const calories = recipe.calories || recipe.kalori || 0;
  
  // Besin Değerleri
  const protein = recipe.protein || "0g";
  const carbs = recipe.carbs || recipe.karbonhidrat || "0g";
  const fats = recipe.fats || recipe.yag || "0g";

  // Malzemeler (ingredients veya malzemeler)
  let ingredients = [];
  if (Array.isArray(recipe.ingredients)) ingredients = recipe.ingredients;
  else if (Array.isArray(recipe.malzemeler)) ingredients = recipe.malzemeler;

  // Yapılışı (instructions veya steps veya yapilisi)
  let instructions = [];
  if (Array.isArray(recipe.instructions)) instructions = recipe.instructions;
  else if (Array.isArray(recipe.steps)) instructions = recipe.steps;
  else if (Array.isArray(recipe.yapilisi)) instructions = recipe.yapilisi;
  else if (Array.isArray(recipe.hazirlanisi)) instructions = recipe.hazirlanisi;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in zoom-in duration-300">
      
      {/* ÜST BAR */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-black text-slate-800 uppercase leading-tight max-w-[60%]">
          {title}
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={() => { onBookmark(); onClose(); }}
            className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider hover:bg-emerald-200 transition-colors"
          >
            <span>🔖</span>
            <span className="hidden sm:inline">Deftere Ekle</span>
          </button>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-lg active:scale-90 transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-8 pb-32">
        {/* MAKRO BİLGİLERİ */}
        <div className="flex gap-4 items-center">
          <span className="bg-orange-100 text-orange-600 text-sm font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-sm">
            🔥 {calories} kcal
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm">
            <span className="block text-xl font-black text-slate-800">{protein}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protein</span>
          </div>
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm">
            <span className="block text-xl font-black text-slate-800">{carbs}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karb</span>
          </div>
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm">
            <span className="block text-xl font-black text-slate-800">{fats}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yağ</span>
          </div>
        </div>

        {/* MALZEMELER LİSTESİ */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>🛒</span> Malzemeler
          </h3>
          {ingredients.length > 0 ? (
            <ul className="space-y-4">
              {ingredients.map((ing: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 font-bold border-b border-slate-50 pb-3 last:border-0 text-sm">
                  <span className="text-emerald-500 mt-1 text-xs">●</span> {ing}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Malzeme bilgisi çekilemedi.
            </div>
          )}
        </section>

        {/* HAZIRLANIŞ ADIMLARI */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>👨‍🍳</span> Hazırlanışı
          </h3>
          <div className="space-y-8">
            {instructions.length > 0 ? (
              instructions.map((step: string, i: number) => (
                <div key={i} className="flex gap-4 relative group">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm z-10 group-hover:bg-emerald-500 transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-bold pt-1 text-sm">
                    {step}
                  </p>
                  {i !== instructions.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100 -z-0"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Hazırlanış adımları çekilemedi.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}