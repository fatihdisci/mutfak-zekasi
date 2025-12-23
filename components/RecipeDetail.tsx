'use client';
export default function RecipeDetail({ recipe, onClose }: { recipe: any, onClose: () => void }) {
  if (!recipe) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in zoom-in duration-300">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 uppercase leading-tight max-w-[80%]">{recipe.name || recipe.title}</h2>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-lg text-xl">✕</button>
      </div>
      <div className="max-w-xl mx-auto p-6 space-y-8 pb-32 text-slate-800">
        <div className="flex gap-4"><span className="bg-orange-100 text-orange-600 text-xs font-black px-4 py-2 rounded-full uppercase">🔥 {recipe.calories} kcal</span></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm"><span className="block text-xl font-black">{recipe.protein}</span><span className="text-[10px] font-bold text-slate-400 uppercase">Protein</span></div>
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm"><span className="block text-xl font-black">{recipe.carbs}</span><span className="text-[10px] font-bold text-slate-400 uppercase">Karb</span></div>
          <div className="bg-white p-4 rounded-3xl text-center border border-slate-100 shadow-sm"><span className="block text-xl font-black">{recipe.fats}</span><span className="text-[10px] font-bold text-slate-400 uppercase">Yağ</span></div>
        </div>
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">🛒 Malzemeler</h3>
          <ul className="space-y-4">{recipe.ingredients?.map((ing: string, i: number) => (<li key={i} className="flex items-start gap-3 font-bold border-b border-slate-50 pb-3 text-sm"><span className="text-emerald-500 mt-1">●</span> {ing}</li>))}</ul>
        </section>
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">👨‍🍳 Hazırlanışı</h3>
          <div className="space-y-8">{recipe.instructions?.map((step: string, i: number) => (<div key={i} className="flex gap-4 relative"><div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm z-10">{i + 1}</div><p className="leading-relaxed font-bold pt-1 text-sm">{step}</p>{i !== recipe.instructions.length - 1 && (<div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100"></div>)}</div>))}</div>
        </section>
      </div>
    </div>
  );
}