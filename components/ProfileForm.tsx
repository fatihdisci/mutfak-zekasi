'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProfileForm({ onCalculate }: { onCalculate: (t: number, n: string) => void }) {
  const [isManual, setIsManual] = useState(false);
  
  // State'e yeni alanları ekledik
  const [formData, setFormData] = useState({ 
    name: '', 
    age: '', 
    weight: '', 
    height: '', 
    gender: 'female',
    activity_level: 'sedentary', // Varsayılan: Hareketsiz
    goal: 'maintain'             // Varsayılan: Korumak
  });
  
  const [manualTarget, setManualTarget] = useState('');
  const [loading, setLoading] = useState(false);

  // Aktivite Çarpanları
  const activityMultipliers: {[key: string]: number} = {
    sedentary: 1.2,      // Masa başı
    light: 1.375,        // Haftada 1-3 gün spor
    moderate: 1.55,      // Haftada 3-5 gün spor
    active: 1.725        // Her gün spor
  };

  // Hedef Kalori Ayarlamaları
  const goalAdjustments: {[key: string]: number} = {
    lose: -500,   // Kilo ver
    maintain: 0,  // Koru
    gain: 500     // Kilo al
  };

  const handleAction = async () => {
    setLoading(true);
    let target = 0;

    // Kullanıcı ID'sini al
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        setLoading(false);
        return alert("Oturum bulunamadı. Lütfen giriş yapın.");
    }
    const userId = session.user.id;

    if (isManual) {
      // --- MANUEL MOD ---
      if (!formData.name || !manualTarget) {
        setLoading(false);
        return alert("İsim ve hedef girmelisiniz.");
      }
      target = Number(manualTarget);
    } else {
      // --- OTOMATİK MOD (Mifflin-St Jeor + Aktivite + Hedef) ---
      if (!formData.name || !formData.age || !formData.weight || !formData.height) {
        setLoading(false);
        return alert("Lütfen tüm alanları doldurun.");
      }

      // 1. BMR Hesabı
      const weight = Number(formData.weight);
      const height = Number(formData.height);
      const age = Number(formData.age);
      
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      bmr += formData.gender === 'male' ? 5 : -161;

      // 2. TDEE (Günlük Enerji Harcaması) Hesabı
      const multiplier = activityMultipliers[formData.activity_level] || 1.2;
      const tdee = bmr * multiplier;

      // 3. Hedefe Göre Ayarlama
      const adjustment = goalAdjustments[formData.goal] || 0;
      target = Math.round(tdee + adjustment);
    }
    
    // VERİTABANI GÜNCELLEMESİ (Upsert: Varsa güncelle, yoksa ekle)
    // SQL tarafında oluşturduğumuz yeni tablo yapısına tam uygun veri gönderiyoruz
    const { error } = await supabase.from('profiles').upsert({
        id: userId, // Auth ID ile eşleşmeli
        updated_at: new Date(),
        name: formData.name,
        age: isManual ? 0 : Number(formData.age),
        weight: isManual ? 0 : Number(formData.weight),
        height: isManual ? 0 : Number(formData.height),
        gender: formData.gender,
        activity_level: formData.activity_level, // Yeni Alan
        goal: formData.goal,                     // Yeni Alan
        daily_calorie_target: target
    });

    if (error) {
        console.error("Profil Kayıt Hatası:", error);
        alert("Profil kaydedilirken hata oluştu: " + error.message);
    } else {
        onCalculate(target, formData.name);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
          👤 {isManual ? 'Manuel Hedef' : 'Akıllı Hesaplama'}
        </h3>
        <button 
          onClick={() => setIsManual(!isManual)}
          className="text-[10px] font-bold text-emerald-600 uppercase underline hover:text-emerald-800 transition-colors"
        >
          {isManual ? 'Otomatik Hesapla ↺' : 'Elle Girmek İstiyorum ✎'}
        </button>
      </div>
      
      <div className="space-y-4">
        {/* İsim Alanı */}
        <input 
          type="text" 
          placeholder="İsminiz (Örn: Fatih)" 
          className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          value={formData.name}
        />

        {isManual ? (
          // --- MANUEL GİRİŞ ALANI ---
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
          // --- OTOMATİK HESAPLAMA ALANLARI ---
          <div className="space-y-3">
            {/* Cinsiyet Seçimi */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {['female', 'male'].map((g) => (
                <button
                  key={g}
                  onClick={() => setFormData({...formData, gender: g})}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${formData.gender === g ? 'bg-white text-emerald-600 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {g === 'female' ? 'Kadın 👩' : 'Erkek 👨'}
                </button>
              ))}
            </div>

            {/* Sayısal Veriler */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Yaş</label>
                <input type="number" placeholder="Yaş" className="w-full p-3 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold text-center outline-none focus:bg-white focus:border-emerald-500" onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Kilo (kg)</label>
                <input type="number" placeholder="KG" className="w-full p-3 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold text-center outline-none focus:bg-white focus:border-emerald-500" onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Boy (cm)</label>
                <input type="number" placeholder="CM" className="w-full p-3 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold text-center outline-none focus:bg-white focus:border-emerald-500" onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </div>
            </div>

            {/* Aktivite Seviyesi */}
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hareket Durumu</label>
                <select 
                    className="w-full p-3 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:border-emerald-500 text-sm"
                    value={formData.activity_level}
                    onChange={(e) => setFormData({...formData, activity_level: e.target.value})}
                >
                    <option value="sedentary">Masa Başı (Az Hareket)</option>
                    <option value="light">Hafif Aktif (1-3 gün spor)</option>
                    <option value="moderate">Orta Aktif (3-5 gün spor)</option>
                    <option value="active">Çok Aktif (Her gün spor)</option>
                </select>
            </div>

            {/* Hedef */}
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hedefin Ne?</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { val: 'lose', label: 'Kilo Ver', icon: '📉' },
                        { val: 'maintain', label: 'Koru', icon: '⚖️' },
                        { val: 'gain', label: 'Kilo Al', icon: '📈' }
                    ].map((item) => (
                        <button
                            key={item.val}
                            onClick={() => setFormData({...formData, goal: item.val})}
                            className={`py-3 rounded-2xl border-2 font-bold text-[10px] uppercase transition-all flex flex-col items-center gap-1 ${formData.goal === item.val ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

          </div>
        )}
        
        <button 
          onClick={handleAction} 
          disabled={loading} 
          className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-emerald-600 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2"
        >
          {loading ? (
             <span className="animate-pulse">Hesaplanıyor...</span>
          ) : (
             <>
               <span>{isManual ? "HEDEFİ KAYDET" : "HESAPLA VE KAYDET"}</span>
               <span>→</span>
             </>
          )}
        </button>
      </div>
    </div>
  );
}