'use client';

import { useState } from 'react';
// --- DÜZELTME: @/lib yerine ../lib kullanıldı ---
// Bu dosya 'components' içinde, supabaseClient ise 'lib' içinde olduğu için 
// bir üst klasöre çıkıp (..) lib klasörüne giriyoruz.
import { supabase } from '../lib/supabaseClient'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;
      // Giriş başarılıysa sayfayı yenile ve oturumu aktif et
      window.location.reload(); 

    } catch (error: any) {
      alert(error.message || "Giriş işlemi sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-sans">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-black text-center mb-6 uppercase text-slate-900 leading-tight">
          {isSignUp ? 'Yeni Kayıt 🥦' : 'Tekrar Hoş Geldin 🚀'}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta</label>
            <input 
              type="email" 
              required 
              placeholder="fatih@disci.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" 
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs mt-2"
          >
            {loading ? 'LÜTFEN BEKLEYİN...' : (isSignUp ? 'HESABI OLUŞTUR' : 'GİRİŞ YAP')}
          </button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          className="w-full text-center text-[10px] font-black text-slate-400 mt-6 underline uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          {isSignUp ? 'Zaten bir hesabım var? Giriş' : 'Henüz hesabın yok mu? Kayıt Ol'}
        </button>
      </div>
    </div>
  );
}