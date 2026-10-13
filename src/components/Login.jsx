import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const trimmedInput = username.trim();

      // التحقق من حساب الأدمن
      if (trimmedInput === 'admin' && password === '123456') {
        onLogin({ 
          id: 'admin',
          role: 'admin', 
          name: 'رئيس الاتحاد (الأدمن)',
          apartmentNumber: 'الإدارة'
        });
        return;
      }

      // جلب جميع الشقق لمطابقة رقم الشقة بمرونة (سواء كتب المستخدم رقم فقط أو كلمة شقة مع الرقم)
      const { data: apts, error: dbError } = await supabase
        .from('apartments')
        .select('*');

      if (dbError) throw dbError;

      if (!apts || apts.length === 0) {
        setError('لا توجد شقق مسجلة في النظام حالياً');
        setLoading(false);
        return;
      }

      // تنظيف المدخلات وتوحيدها للبحث المرن
      const cleanInput = trimmedInput.replace(/^شقة\s*/, '').trim();

      const apt = apts.find(a => {
        if (!a.number) return false;
        const cleanDbNumber = String(a.number).replace(/^شقة\s*/, '').trim();
        return cleanDbNumber === cleanInput;
      });

      if (!apt) {
        setError('رقم الشقة غير مسجل في النظام');
        setLoading(false);
        return;
      }

      const aptPassword = apt.password || '1234';
      
      if (password !== aptPassword) {
        setError('كلمة المرور غير صحيحة');
        setLoading(false);
        return;
      }

      onLogin({ 
        id: apt.id,
        role: 'resident', 
        name: apt.owner || `شقة ${apt.number}`, 
        apartmentNumber: apt.number,
        apartment: apt.number,
        aptId: apt.id
      });

    } catch (err) {
      console.error('خطأ في تسجيل الدخول:', err.message);
      setError('حدث خطأ أثناء الاتصال بقاعدة البيانات السحابية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-slate-800/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/60 space-y-6 relative z-10">
        
        <div className="text-center space-y-3">
          <div className="inline-block relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <img 
              src={logoImage} 
              alt="شعار اتحاد الملاك" 
              className="w-16 h-16 rounded-2xl mx-auto border-2 border-amber-500/50 shadow-lg relative object-cover bg-slate-900" 
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">إتحاد ملاك البرج</h1>
            <p className="text-xs text-amber-400 font-medium mt-1">سجل الدخول برقم الشقة وكلمة المرور</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1.5 font-medium">رقم الشقة أو اسم المستخدم</label>
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-10 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs mt-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
          <span className="font-bold text-amber-400 block">معلومات الدخول:</span>
          <p>👑 <b>الأدمن:</b> <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">admin</code> | كلمة المرور: <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">123456</code></p>
          <p>🏠 <b>الساكن:</b> أدخل رقم شقتك المسجل | كلمة المرور الافتراضية: <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">123</code></p>
        </div>

      </div>
    </div>
  );
}