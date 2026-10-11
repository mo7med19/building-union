import React, { useState } from 'react';
import { Building2, Lock, User, KeyRound, AlertCircle } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // بيانات تجريبية للحسابات (يمكنك تعديلها أو ربطها بالـ apartments)
  // أدمن العمارة (رئيس الاتحاد أو الحارس) وساكن عادي
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    // بيانات الأدمن الافتراضية
    if (username === 'admin' && password === '123456') {
      onLogin({ role: 'admin', name: 'رئيس الاتحاد (الأدمن)' });
    } 
    // حساب ساكن تجريبي (مثلاً شقة 101)
    else if (username === '101' && password === '101') {
      onLogin({ role: 'resident', name: 'أحمد محمد (شقة 101)', apartment: 'شقة 101' });
    } 
    else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-800 border border-slate-700/80 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* الشعار */}
        <div className="text-center space-y-2">
          <div className="bg-amber-500 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Building2 className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold text-white">إتحاد ملاك البرج</h1>
          <p className="text-xs text-slate-400">سجل الدخول للمتابعة إلى لوحة التحكم</p>
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
                className="w-full bg-slate-900 border border-slate-700 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
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
                className="w-full bg-slate-900 border border-slate-700 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 rounded-xl transition shadow-lg shadow-amber-500/10 text-sm mt-2"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* تلميح للحسابات التجريبية */}
        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-700/50 space-y-1.5 text-[11px] text-slate-400">
          <span className="font-bold text-amber-400 block">حسابات تجريبية للتجربة الفورية:</span>
          <p>👑 <b>الأدمن:</b> اسم المستخدم <code className="text-white bg-slate-800 px-1 rounded">admin</code> | كلمة المرور <code className="text-white bg-slate-800 px-1 rounded">123456</code></p>
          <p>🏠 <b>الساكن:</b> اسم المستخدم <code className="text-white bg-slate-800 px-1 rounded">101</code> | كلمة المرور <code className="text-white bg-slate-800 px-1 rounded">101</code></p>
        </div>

      </div>
    </div>
  );
}