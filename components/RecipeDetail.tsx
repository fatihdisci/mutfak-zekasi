'use client';

/**
 * Hata Korumalı Tarif Detay Modalı
 * AI'dan gelen verilerde eksiklik olsa bile uygulama çökmez.
 */
export default function RecipeDetail({ recipe, onClose }: { recipe: any, onClose: () => void }) {
  if (!recipe) return null;

  // Veri Kontrolü ve Fallback (Yedek) değerler
  // Bazı AI modelleri 'instructions' yerine 'steps' veya 'title' yerine 'name' gönderebilir.
  const title = recipe.title || recipe.name || "İsimsiz Tarif";
  const calories = recipe.calories || 0;
  const protein = recipe.protein || 0;
  const carbs = recipe.carbs || 0;
  const fats = recipe.fats || 0;
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : 
                       (Array.isArray(recipe.steps) ? recipe.steps : []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in zoom-in duration-300">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-tight max-w-[80%]">
          {title}
        </h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-lg active:scale-90 transition-all text-xl"
        >
          ✕
        </button>
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-8 pb-32">
        {/* KALORİ ROZETİ */}
        <div className="flex gap-4">
          <span className="bg-orange-100 text-orange-600 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
            🔥 {calories} kcal
          </span>
        </div>

        {/* MAKRO BESİNLER */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm">
            <span className="block text-xl font-black text-slate-800">{protein}g</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protein</span>
          </div>
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm">
            <span className="block text-xl font-black text-slate-800">{carbs}g</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karb</span>
          </div>
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm">
            <span className="block text-xl font-black text-slate-800">{fats}g</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yağ</span>
          </div>
        </div>

        {/* MALZEMELER */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>🛒</span> Malzemeler
          </h3>
          {ingredients.length > 0 ? (
            <ul className="space-y-4">
              {ingredients.map((ing: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-bold border-b border-slate-50 pb-3 text-sm">
                  <span className="text-emerald-500 mt-1">●</span> {ing}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm font-bold">Malzeme bilgisi bulunamadı.</p>
          )}
        </section>

        {/* HAZIRLANIŞI */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>👨‍🍳</span> Hazırlanışı
          </h3>
          <div className="space-y-8">
            {instructions.length > 0 ? (
              instructions.map((step: string, i: number) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm z-10">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-bold pt-1 text-sm">
                    {step}
                  </p>
                  {i !== instructions.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100 -z-0"></div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm font-bold">Hazırlanış bilgisi bulunamadı.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}