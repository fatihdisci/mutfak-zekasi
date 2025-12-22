import { createClient } from '@/utils/supabase/server'; // Supabase client varsayımı

export async function checkNutritionStatus(userId: string) {
  const supabase = createClient();
  
  // Son 3 yemeği getir
  const { data: lastMeals } = await supabase
    .from('meal_history')
    .select('calories, carbs, fats')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!lastMeals || lastMeals.length < 3) return 'normal';

  // Basit bir mantık: Son 3 öğünün ortalama kalorisi veya yağı yüksek mi?
  const avgFat = lastMeals.reduce((sum, meal) => sum + meal.fats, 0) / 3;
  const avgCarbs = lastMeals.reduce((sum, meal) => sum + meal.carbs, 0) / 3;

  // Eşik değerler (Örnek)
  if (avgFat > 30 || avgCarbs > 100) {
    return 'warning'; // Dengeleme zamanı!
  }

  return 'normal';
}