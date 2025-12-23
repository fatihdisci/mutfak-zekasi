'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProfileForm({ onCalculate }: { onCalculate: (t: number, n: string) => void }) {
  const [isManual, setIsManual] = useState(false); // Manuel mod kontrolü
  const [formData, setFormData] = useState({ name: '', age: '', weight: '', height: '', gender: 'female' });
  const [manualTarget, setManualTarget] = useState(''); // Elle girilen hedef
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    let target = 0;

    if (isManual) {
      // MANUEL MOD: Direkt girilen değeri al
      if (!formData.name || !manualTarget) {
        setLoading(false);
        return alert("İsim ve hedef girmelisiniz.");
      }
      target = Number(manualTarget);
    } else {
      // OTOMATİK MOD: Mifflin-St Jeor Formülü
      if (!formData.name || !formData.age || !formData.weight || !formData.height) {
        setLoading(false);
        return alert("Lütfen tüm alanları doldurun.");
      }
      const bmr = (10 * +formData.weight) + (6.25 * +formData.height) - (5 * +formData.age) + (formData.gender === 'male' ? 5 : -161);
      target = Math.round(bmr * 1.2);
    }
    
    // Veritabanına kaydet (Eski veri silinmez, yeni satır eklenir = Geçmiş tutulur)
    await supabase.from('profiles').insert([{
        name: formData.name,
        age: isManual ? 0 : Number(formData.age), // Manuelse yaşa 0 yazabiliriz
        weight: isManual ? 0 : Number(formData.weight),
        height: isManual ? 0 : Number(formData.height),
        gender: formData.gender,
        daily_calorie_target: target
    }]);

    onCalculate(target, formData.name);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
          👤 {isManual ? 'Manuel Hedef' : 'Akıllı Hesaplama'}
        </h3>
        {/* Mod Değiştirme Butonu */}
        <button 
          onClick={() => setIsManual(!isManual)}
          className="text-[10px] font-bold text-emerald-600 uppercase underline hover:text-emerald-800"
        >
          {isManual ? 'Otomatik Hesapla ↺' : 'Elle Girmek İstiyorum ✎'}
        </button>
      </div>
      
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="İsminiz" 
          className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          value={formData.name}
        />

        {isManual ? (
          // MANUEL GİRİŞ ALANI
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-xs text-emerald-800 font-bold mb-2 uppercase">Hedef Kalori (Günlük)</p>
            <input 
              type="number" 
              placeholder="Örn: 2200" 
              className="w-full p-3 bg-white border border-emerald-200 rounded-xl text-center text-2xl font-black text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setManualTarget(e.target.value)}
            />
          </div>
        ) : (
          // OTOMATİK HESAPLAMA ALANLARI
          <>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {['female', 'male'].map((g) => (
                <button
                  key={g}
                  onClick={() => setFormData({...formData, gender: g})}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${formData.gender === g ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                  {g === 'female' ? 'Kadın' : 'Erkek'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input type="number" placeholder="Yaş" className="p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold text-center outline-none focus:bg-white focus:border-emerald-500" onChange={(e) => setFormData({...formData, age: e.target.value})} />
              <input type="number" placeholder="KG" className="p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold text-center outline-none focus:bg-white focus:border-emerald-500" onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              <input type="number" placeholder="CM" className="p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold text-center outline-none focus:bg-white focus:border-emerald-500" onChange={(e) => setFormData({...formData, height: e.target.value})} />
            </div>
          </>
        )}
        
        <button 
          onClick={handleAction} 
          disabled={loading} 
          className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-emerald-600 active:scale-[0.98] transition-all uppercase tracking-widest text-xs mt-2"
        >
          {loading ? "..." : isManual ? "HEDEFİ KAYDET" : "HESAPLA VE KAYDET"}
        </button>
      </div>
    </div>
  );
}