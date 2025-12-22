'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import RecipeCard from '@/components/RecipeCard';
import NutrientBar from '@/components/NutrientBar';
import BottomNav from '@/components/BottomNav';
import { getSmartRecipes } from '@/actions/generateRecipe';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadUserData() {
      // 1. Profil Çek
      const { data: profile } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (profile) {
        setCalorieTarget(profile.daily_calorie_target);
        setUserName(profile.name);
      }

      // 2. SADECE BUGÜNÜN YEMEKLERİNİ TOPLA (00:00 SIFIRLAMA MANTIĞI)
      // Bugünün başlangıcını (gece 00:00) alıyoruz
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: meals } = await supabase
        .from('meal_history')
        .select('calories')
        .gte('created_at', today.toISOString()); // .gte = Greater Than or Equal (Bundan büyük veya eşit olanlar)

      if (meals) {
        const total = meals.reduce((acc, curr) => acc + Number(curr.calories), 0);
        setDailyTotal(total);
      }

      // 3. Tarif Hafızası
      const savedLocalRecipes = localStorage.getItem('lastRecipes');
      if (savedLocalRecipes) setRecipes(JSON.parse(savedLocalRecipes));
    }
    loadUserData();
  }, []);

  const handleFindRecipes = async () => {
    if (!ingredients) return alert("Malzeme girin!");
    setLoading(true);
    try {
      const data = await getSmartRecipes(ingredients.split(','), 'normal');
      if (data) {
        setRecipes(data);
        localStorage.setItem('lastRecipes', JSON.stringify(data));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSaveMeal = async (recipe: any) => {
    try {
      await supabase.from('meal_history').insert([{
        recipe_name: recipe.name,
        calories: Number(recipe.calories),
        protein: Number(recipe.protein),
        carbs: Number(recipe.carbs),
        fats: Number(recipe.fats)
      }]);
      setDailyTotal(prev => prev + Number(recipe.calories));
      alert(`Afiyet olsun! Kalori eklendi.`);
    } catch (err) { console.error(err); }
  };

  const handleBookmark = async (recipe: any) => {
    try {
      await supabase.from('saved_recipes').insert([{
        user_name: userName,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        calories: Number(recipe.calories),
        protein: Number(recipe.protein),
        carbs: Number(recipe.carbs),
        fats: Number(recipe.fats)
      }]);
      alert("Tarif defterine kaydedildi! 📒");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen pb-32 bg-slate-50 w-full overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 pt-12 pb-4 px-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mutfak Asistanı</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">
              {userName ? `Selam,\n${userName}` : "MUTFAK\nZEKASI"}
            </h1>
          </div>
          {userName && (
             <div className="text-right">
                <span className="block text-3xl font-black text-emerald-600 leading-none">{calorieTarget}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hedef Kcal</span>
             </div>
          )}
        </div>
      </header>

      <main className="w-full px-5 py-6 space-y-8">
        <div className="transform scale-105 origin-top">
           <NutrientBar current={dailyTotal} target={calorieTarget} />
        </div>
        
        {/* PROFİL KİLİDİ VE DÜZENLEME SEÇENEĞİ */}
        {calorieTarget === 0 ? (
          <ProfileForm onCalculate={(t, n) => { setCalorieTarget(t); setUserName(n); }} />
        ) : (
          <div className="bg-white border border-slate-100 p-5 rounded-3xl flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
               <div className="bg-emerald-100 p-2 rounded-full text-xl">⚖️</div>
               <div>
                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Profilin Aktif</p>
                 <p className="text-xs font-medium text-slate-400 mt-0.5">Kilo değişimi veya yeni hedef?</p>
               </div>
            </div>
            {/* DÜZENLE BUTONU: Buna basınca hedefi 0 yapıyoruz, form geri geliyor */}
            <button 
              onClick={() => setCalorieTarget(0)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Düzenle ✏️
            </button>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <label className="flex items-center gap-2 font-black text-slate-800 mb-4 text-base uppercase tracking-wider">
             <span className="text-2xl">🎹</span> Malzemeler
          </label>
          <textarea 
            className="w-full p-0 bg-transparent border-none text-slate-800 font-bold placeholder:text-slate-300 outline-none resize-none text-xl leading-relaxed min-h-[100px]"
            rows={3}
            placeholder="Dolapta ne var? Yumurta, Peynir..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button 
            onClick={handleFindRecipes}
            disabled={loading || calorieTarget === 0}
            className="w-full mt-6 h-16 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all flex justify-center items-center gap-3 text-sm uppercase tracking-[0.2em]"
          >
            {loading ? "ŞEF DÜŞÜNÜYOR..." : "TARİFLERİ OLUŞTUR ✨"}
          </button>
        </div>

        <div className="space-y-6">
          {recipes.length > 0 ? (
            recipes.map((r, i) => (
              <RecipeCard 
                key={i} 
                recipe={r} 
                onSave={() => handleSaveMeal(r)} 
                onBookmark={() => handleBookmark(r)}
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-4 grayscale opacity-50">🥗</div>
              <h3 className="text-slate-400 font-black text-lg uppercase tracking-widest">Bekleniyor</h3>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}