'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '../components/ProfileForm';
import RecipeCard from '../components/RecipeCard';
import RecipeDetail from '../components/RecipeDetail';
import NutrientBar from '../components/NutrientBar';
import BottomNav from '../components/BottomNav';
import Login from '../components/Login';
import { getSmartRecipes } from '../actions/generateRecipe';
import { supabase } from '../lib/supabaseClient'; 

// --- Custom Inline SVG Icons ---
const AILoading = () => (
  <div className="flex items-center gap-4">
    <div className="relative flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
      <div className="absolute inset-0 bg-emerald-500/30 blur-xl animate-pulse rounded-full"></div>
      <span className="absolute text-sm animate-bounce">🤖</span>
    </div>
    <div className="flex flex-col items-start leading-none">
      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] animate-pulse mb-1">
        Yapay Zeka
      </span>
      <span className="text-[13px] font-black text-white uppercase tracking-wider">
        Mutfakta Düşünüyor...
      </span>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Veri State'leri
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [userName, setUserName] = useState('');
  
  // Detay Modali için State
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  useEffect(() => {
    async function checkUserAndLoad() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setAuthLoading(false);

      if (!session) return;

      const uId = session.user.id;

      // Profil bilgisini çek
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', uId).maybeSingle();
      if (profile) {
        setCalorieTarget(profile.daily_calorie_target);
        setUserName(profile.name);
      }

      // Bugünün kalori toplamını çek
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: meals } = await supabase.from('meal_history').select('calories').eq('user_id', uId).gte('created_at', today.toISOString());
      if (meals) {
        setDailyTotal(meals.reduce((acc, curr) => acc + Number(curr.calories), 0));
      }

      // Local storage'dan eski verileri yükle
      if (ingredients === '') {
          const localIng = localStorage.getItem('current_ingredients');
          if (localIng) setIngredients(localIng);
      }

      const localRecipes = localStorage.getItem('last_recipes_results');
      if (localRecipes) {
        setRecipes(JSON.parse(localRecipes));
      }
    }
    checkUserAndLoad();
  }, []); 

  const handleFindRecipes = async () => {
    if (!ingredients) return alert("Lütfen malzeme girin!");
    setLoading(true);
    localStorage.setItem('current_ingredients', ingredients);

    try {
      const data = await getSmartRecipes(ingredients.split(','), 'normal');
      
      if (data && !data.error) {
        setRecipes(data);
        localStorage.setItem('last_recipes_results', JSON.stringify(data));
      } else {
        alert(data?.error || "Tarif üretilemedi.");
      }
    } catch (err) { 
      console.error(err);
      alert("Bir hata oluştu!"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSignOut = async () => {
    if(confirm("Çıkış yapmak istiyor musun?")) {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.reload();
    }
  };

  // --- GÜNCELLENMİŞ KAYDETME FONKSİYONLARI ---

  const handleSaveMeal = async (recipe: any) => {
    if (!session) return;
    try {
      // TEMİZLİK FONKSİYONU: "20g" -> 20, "500 kcal" -> 500
      const cleanNumber = (val: any) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        // Sadece rakamları al, gerisini sil
        const numbers = String(val).replace(/[^0-9]/g, ''); 
        return parseInt(numbers) || 0;
      };

      const cleanCalories = cleanNumber(recipe.calories);
      const cleanProtein = cleanNumber(recipe.protein);
      const cleanCarbs = cleanNumber(recipe.carbs);
      const cleanFats = cleanNumber(recipe.fats);

      const { error } = await supabase.from('meal_history').insert({
        user_id: session.user.id,
        name: recipe.title || recipe.name,
        calories: cleanCalories,
        protein: cleanProtein,
        carbs: cleanCarbs,
        fats: cleanFats
      });

      if (error) {
        console.error("Supabase Hatası (Öğün):", error);
        throw new Error(error.message);
      }
      
      alert("Öğün günlüğüne eklendi! 🎉");
      setDailyTotal(prev => prev + cleanCalories);

    } catch (e: any) {
      console.error(e);
      alert("Kaydedilirken hata oluştu: " + e.message + "\n(Veritabanı tablosu güncel olmayabilir)");
    }
  };

  const handleBookmark = async (recipe: any) => {
    if (!session) return;
    try {
      const { error } = await supabase.from('saved_recipes').insert({
        user_id: session.user.id,
        recipe_data: recipe, // JSON olarak tüm tarifi sakla
        title: recipe.title || recipe.name
      });

      if (error) throw error;
      alert("Tarif deftere kaydedildi! ⭐");
    } catch (e: any) {
      console.error(e);
      alert("Deftere eklenirken hata: " + e.message);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Yükleniyor...</div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen pb-40 bg-slate-50 font-sans relative">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 pt-12 pb-6 shadow-sm flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {userName ? `Selam, ${userName}` : "Mutfak Zekası"}
          </h1>
        </div>
        <button onClick={handleSignOut} className="text-[10px] font-black text-slate-400 hover:text-red-500 bg-slate-50 px-3 py-2 rounded-xl transition-all border border-slate-100 uppercase">
          Çıkış 🚪
        </button>
      </header>

      <main className="px-6 py-8 space-y-8 max-w-xl mx-auto">
        <section>
          {calorieTarget === 0 ? (
            <ProfileForm onCalculate={(t, n) => { setCalorieTarget(t); setUserName(n); }} />
          ) : (
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🥗</div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planın Aktif</p>
                  <button onClick={() => setCalorieTarget(0)} className="text-sm font-black text-emerald-600 hover:underline">Hedefi Düzenle</button>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black text-slate-900 leading-none">{calorieTarget}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Hedef kcal</span>
              </div>
            </div>
          )}
        </section>

        <section>
          <NutrientBar current={dailyTotal} target={calorieTarget} />
        </section>
        
        <section className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Malzeme Girişi</label>
          <textarea 
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 font-bold placeholder:text-slate-300 outline-none resize-none text-xl min-h-[120px] focus:ring-2 focus:ring-emerald-500/10 transition-all"
            placeholder="Dolapta ne var? (Örn: Tavuk, soğan...)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button 
            onClick={handleFindRecipes} 
            disabled={loading} 
            className="w-full mt-4 h-16 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg shadow-slate-200 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group disabled:opacity-90 overflow-hidden"
          >
            {loading ? (
              <AILoading />
            ) : (
              <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                <span>TARİF ÜRET</span>
                <span className="text-lg group-hover:rotate-12 transition-transform">✨</span>
              </div>
            )}
          </button>
        </section>

        {recipes.length > 0 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>🕒</span> Sonuçlar ({recipes.length})
              </h2>
            </div>
            <div className="space-y-6">
              {recipes.map((r, i) => (
                <RecipeCard 
                  key={i} 
                  recipe={r} 
                  onSave={() => handleSaveMeal(r)} 
                  onBookmark={() => handleBookmark(r)}
                  onDetail={() => setSelectedRecipe(r)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onBookmark={() => handleBookmark(selectedRecipe)}
        />
      )}

      <BottomNav />
    </div>
  );
}