'use client';

export default function NutrientBar({ current, target }: { current: number; target: number }) {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
      <div className="flex justify-between items-end mb-2">
        <h4 className="font-bold text-gray-700 text-sm uppercase">GÜNLÜK KALORİ</h4>
        <span className="text-xs font-bold text-gray-500">{current} / {target} kcal</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div 
          className="bg-green-600 h-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs mt-2 text-gray-400 text-right">Hedefin %{percentage} tamamlandı</p>
    </div>
  );
}