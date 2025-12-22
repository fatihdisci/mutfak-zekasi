'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Diary() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('meal_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setHistory(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">📊 YEMEK GÜNLÜĞÜM</h1>
          <Link href="/" className="text-green-700 font-bold hover:underline">← Mutfağa Dön</Link>
        </header>

        {loading ? (
          <p className="text-center py-20 font-bold text-gray-400">Günlük okunuyor...</p>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{item.recipe_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('tr-TR')} - 
                    {new Date(item.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-orange-100 text-orange-700 font-black px-3 py-1 rounded-full text-sm">
                    {item.calories} kcal
                  </span>
                  <div className="flex gap-2 mt-2 text-[10px] font-bold text-gray-400 uppercase">
                    <span>P: {item.protein}g</span>
                    <span>K: {item.carbs}g</span>
                    <span>Y: {item.fats}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">Henüz hiç yemek kaydetmedin. Hadi bir şeyler pişir!</p>
          </div>
        )}
      </div>
    </div>
  );
}