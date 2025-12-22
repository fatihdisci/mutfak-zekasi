'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BottomNav from '@/components/BottomNav';
import { getUserId } from '@/lib/auth';

export default function Diary() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const uId = getUserId();
      const { data } = await supabase
        .from('meal_history')
        .select('*')
        .eq('user_id', uId) // 👈 Sadece benim yemeklerim
        .order('created_at', { ascending: false });

      if (data) setHistory(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-32 w-full">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 pt-12 pb-4 px-6 shadow-sm mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase">📊 YEMEK GÜNLÜĞÜM</h1>
      </header>
      <main className="max-w-4xl mx-auto px-5">
         {/* ... (Daha önceki diary tasarımı aynı kalıyor) ... */}
      </main>
      <BottomNav />
    </div>
  );
}