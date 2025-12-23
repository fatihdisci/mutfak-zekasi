'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
      window.location.reload(); 

    } catch (error: any) {
      alert(error.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-sans">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-black text-center mb-6 uppercase text-slate-900">
          {isSignUp ? 'Kayıt Ol 🥦' : 'Giriş Yap 🚀'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" required placeholder="E-Posta" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none" />
          <input type="password" required placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none" />
          <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg">{loading ? '...' : (isSignUp ? 'KAYIT OL' : 'GİRİŞ')}</button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-xs font-bold text-slate-400 mt-4 underline">
          {isSignUp ? 'Hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
        </button>
      </div>
    </div>
  );
}