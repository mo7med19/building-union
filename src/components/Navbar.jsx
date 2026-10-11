import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Receipt, 
  Vote, 
  Wrench, 
  BookOpen,
  Settings
} from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function Navbar({ activeTab, setActiveTab, isAdmin }) {
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'finance', label: isAdmin ? 'الاشتراكات' : 'اشتراكي', icon: Wallet },
    { id: 'expenses', label: 'المصروفات', icon: Receipt },
    { id: 'polls', label: 'التصويت', icon: Vote },
    { id: 'maintenance', label: 'الصيانة', icon: Wrench },
    { id: 'directory', label: 'السكان', icon: Users },
    { id: 'guidelines', label: 'اللائحة', icon: BookOpen },
    ...(isAdmin ? [{ id: 'admin-settings', label: 'إدارة البرج', icon: Settings }] : [])
  ];

  return (
    <>
      {/* 1. الشريط العلوي للشاشات الكبيرة (Desktop Header) */}
      <header className="hidden md:block bg-slate-900/95 backdrop-blur-md text-white shadow-lg sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img 
              src={logoImage} 
              alt="شعار اتحاد الملاك" 
              className="w-7 h-7 rounded-lg object-cover shadow-sm border border-amber-500/40" 
            />
            <div>
              <h1 className="font-extrabold text-xs leading-tight tracking-tight">إتحاد ملاك البرج</h1>
              <span className="text-[9px] text-amber-400 font-medium block">
                {isAdmin ? 'لوحة التحكم الإدارية' : 'تطبيق السكان'}
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 2. الشريط العلوي للجوال (Mobile Top Bar) */}
      <div className="md:hidden bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={logoImage} 
            alt="شعار اتحاد الملاك" 
            className="w-6 h-6 rounded-md object-cover shadow-sm border border-amber-500/40" 
          />
          <div>
            <h1 className="font-bold text-xs leading-tight">إتحاد ملاك البرج</h1>
            <span className="text-[8px] text-amber-400/90 font-medium block">
              {isAdmin ? 'بوابة الأدمن' : 'بوابة الساكن'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. الشريط السفلي المطور للجوال (Floating Bottom Mobile Bar) */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/40 z-50 p-1.5">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[58px] flex-1 py-1.5 px-1 rounded-xl transition-all duration-300 shrink-0 ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[9px] mt-0.5 whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}