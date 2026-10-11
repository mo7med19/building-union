import React, { useState } from 'react';
import { User, KeyRound, AlertCircle } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // بيانات تجريبية للحسابات
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    // بيانات الأدمن الافتراضية
    if (username === 'admin' && password === '123456') {
      onLogin({ 
        id: 'admin',
        role: 'admin', 
        name: 'رئيس الاتحاد (الأدمن)',
        apartmentNumber: 'الإدارة'
      });
    } 
    // حساب ساكن تجريبي (مثلاً شقة 101)
    else if (username === '101' && password === '101') {
      onLogin({ 
        id: 'resident_101',
        role: 'resident', 
        name: 'أحمد محمد', 
        apartmentNumber: '101' 
      });
    } 
    else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      {/* عناصر خلفية جمالية متدرجة */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-slate-800/30 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* الشعار والهوية البصرية */}
        <div className="text-center space-y-3">
          <div className="inline-block relative">
            <img 
              src={logoImage} 
              alt="شعار اتحاد الملاك" 
              className="w-16 h-16 rounded-2xl mx-auto border-2 border-amber-500/40 shadow-lg shadow-amber-500/10 object-cover" 
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">إتحاد ملاك البرج</h1>
            <p className="text-xs text-amber-400 font-medium mt-1">سجل الدخول للمتابعة إلى لوحة التحكم</p>
          </div>
        </div>

        {/* خطأ تسجيل الدخول */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1.5 font-medium">اسم المستخدم أو رقم الشقة</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                placeholder="أدخل admin أو رقم شقتك مثل 101"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 font-medium">كلمة المرور</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition shadow-lg shadow-amber-500/10 text-xs mt-2"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* تلميح للحسابات التجريبية */}
        <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
          <span className="font-bold text-amber-400 block">حسابات تجريبية للتجربة الفورية:</span>
          <p>👑 <b>الأدمن:</b> اسم المستخدم <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">admin</code> | كلمة المرور <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">123456</code></p>
          <p>🏠 <b>الساكن:</b> اسم المستخدم <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">101</code> | كلمة المرور <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">101</code></p>
        </div>

      </div>
    </div>
  );
}