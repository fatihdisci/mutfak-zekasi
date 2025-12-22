'use client';

import { useState, useEffect } from 'react';
import ProfileForm from '@/components/ProfileForm';
import RecipeCard from '@/components/RecipeCard';
import NutrientBar from '@/components/NutrientBar';
import BottomNav from '@/components/BottomNav';
import { getSmartRecipes } from '@/actions/generateRecipe';
import { supabase } from '@/lib/supabaseClient';
import { getUserId } from '@/lib/auth';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadUserData() {
      const uId = getUserId();
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', uId).order('created_at', { ascending: false }).limit(1).single();
      if (profile) {
        setCalorieTarget(profile.daily_calorie_target);
        setUserName(profile.name);
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: meals } = await supabase.from('meal_history').select('calories').eq('user_id', uId).gte('created_at', today.toISOString());
      if (meals) {
        const total = meals.reduce((acc, curr) => acc + Number(curr.calories), 0);
        setDailyTotal(total);
      }
      const savedLocalRecipes = localStorage.getItem('lastRecipes');
      if (savedLocalRecipes) setRecipes(JSON.parse(savedLocalRecipes));
    }
    loadUserData();
  }, []);

  const handleSaveMeal = async (recipe: any) => {
    try {
      await supabase.from('meal_history').insert([{
        user_id: getUserId(),
        recipe_name: recipe.name,
        calories: Number(recipe.calories),
        protein: Number(recipe.protein),
        carbs: Number(recipe.carbs),
        fats: Number(recipe.fats)
      }]);
      setDailyTotal(prev => prev + Number(recipe.calories));
      alert(`Afiyet olsun!`);
    } catch (err) { console.error(err); }
  };

  const handleBookmark = async (recipe: any) => {
    try {
      await supabase.from('saved_recipes').insert([{
        user_id: getUserId(),
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
      alert("Deftere kaydedildi! 📒");
    } catch (err) { console.error(err); }
  };

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

  return (
    <div className="min-h-screen pb-32 bg-slate-50 w-full overflow-x-hidden font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 pt-12 pb-4 px-6 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Asistanın Hazır
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase whitespace-pre-line">
              {userName ? `Selam,\n${userName}` : "MUTFAK\nZEKASI"}
            </h1>
          </div>
          {userName && (
             <div className="text-right bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-100">
                <span className="block text-2xl font-black text-emerald-700 leading-none">{calorieTarget}</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Hedef</span>
             </div>
          )}
        </div>
      </header>

      <main className="w-full px-5 py-6 space-y-8">
        <div className="transform scale-105 origin-top drop-shadow-sm">
           <NutrientBar current={dailyTotal} target={calorieTarget} />
        </div>
        
        {calorieTarget === 0 ? (
          <ProfileForm onCalculate={(t, n) => { setCalorieTarget(t); setUserName(n); }} />
        ) : (
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 p-5 rounded-3xl flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4">
               <div className="bg-emerald-100/50 p-3 rounded-full text-2xl shadow-inner">⚖️</div>
               <div>
                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Profilin Aktif</p>
                 <p className="text-xs font-medium text-slate-400 mt-0.5">Sana özel filtreleme açık.</p>
               </div>
            </div>
            <button onClick={() => setCalorieTarget(0)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 transition-all shadow-sm">
              ✏️
            </button>
          </div>
        )}
        
        {/* MALZEME GİRİŞ KARTI: Daha belirgin gölge ve renkler */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
          
          <textarea 
            className="w-full p-0 bg-transparent border-none text-slate-800 font-bold placeholder:text-slate-300 outline-none resize-none text-2xl min-h-[100px] leading-tight"
            rows={3}
            placeholder="Dolapta ne var?"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          
          {/* BUTON: Düz siyah yerine Canlı Gradient */}
          <button 
            onClick={handleFindRecipes} 
            disabled={loading || calorieTarget === 0} 
            className="w-full mt-6 h-16 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-2xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
          >
            {loading ? "ŞEF DÜŞÜNÜYOR..." : <>TARİFLERİ OLUŞTUR <span className="text-xl">✨</span></>}
          </button>
        </div>

        <div className="space-y-6">
          {recipes.map((r, i) => (
            <RecipeCard key={i} recipe={r} onSave={() => handleSaveMeal(r)} onBookmark={() => handleBookmark(r)} />
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}