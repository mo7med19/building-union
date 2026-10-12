import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Home, 
  KeyRound, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  LogOut 
} from 'lucide-react';

export default function Profile({ user, onUpdateUser, onLogout }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '0590000000',
    email: user?.email || '',
    apartmentNumber: user?.apartmentNumber || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        ...formData,
      });
    }

    setSuccessMessage('تم حفظ بيانات الملف الشخصي بنجاح');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!passwords.currentPassword || !passwords.newPassword) {
      setErrorMessage('يرجى تعبئة جميع حقول كلمة المرور');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setErrorMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
      return;
    }

    setSuccessMessage('تم تحديث كلمة المرور بنجاح');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8" dir="rtl">
      
      {/* رأس الصفحة كرت تعريفي */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right z-10">
          <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400 font-extrabold text-2xl shadow-lg">
            {formData.name ? formData.name.charAt(0) : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-black text-white">{formData.name || 'مستخدم البرج'}</h2>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                user?.role === 'admin' 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {user?.role === 'admin' ? 'إدارة البرج' : 'ساكن'}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>{user?.role === 'admin' ? 'مكتب الإدارة' : `الشقة رقم: ${formData.apartmentNumber || 'غير محدد'}`}</span>
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="z-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        )}
      </div>

      {/* رسائل التنبيه */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* نموذج البيانات الشخصية */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">البيانات الشخصية</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">الاسم الكامل</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">رقم الهاتف / الواتساب</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition font-mono"
                  placeholder="0590000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">البريد الإلكتروني (اختياري)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition font-mono"
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">رقم الشقة</label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.apartmentNumber}
                  onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                  disabled={user?.role !== 'admin'}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ البيانات</span>
            </button>
          </form>
        </div>

        {/* نموذج تغيير كلمة المرور */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">الأمان وكلمة المرور</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">كلمة المرور الحالية</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-10 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute left-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">كلمة المرور الجديدة</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-10 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute left-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">تأكيد كلمة المرور الجديدة</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white pr-10 pl-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>تحديث كلمة المرور</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}