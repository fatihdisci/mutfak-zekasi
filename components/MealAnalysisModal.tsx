'use client';

interface MealAnalysisProps {
  data: {
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    summary_text: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export default function MealAnalysisModal({ data, onClose, onSave }: MealAnalysisProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Başlık */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            🥗
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            Analiz Tamamlandı
          </h3>
        </div>

        {/* Özet Metni */}
        <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
          <p className="text-sm text-slate-600 font-medium leading-relaxed text-center">
            "{data.summary_text}"
          </p>
        </div>

        {/* Besin Değerleri */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-orange-50 p-3 rounded-2xl text-center border border-orange-100">
            <span className="block text-xl font-black text-orange-600">{data.calories}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">kcal</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl text-center border border-blue-100">
            <span className="block text-xl font-black text-blue-600">{data.protein}g</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Prot</span>
          </div>
          <div className="bg-yellow-50 p-3 rounded-2xl text-center border border-yellow-100">
            <span className="block text-xl font-black text-yellow-600">{data.fats}g</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Yağ</span>
          </div>
        </div>

        {/* Butonlar */}
        <div className="space-y-3">
          <button 
            onClick={onSave}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            ✅ Günlüğe Kaydet
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-white text-slate-400 font-bold rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors"
          >
            Vazgeç
          </button>
        </div>

      </div>
    </div>
  );
}