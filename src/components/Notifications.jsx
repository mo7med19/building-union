import React from 'react';
import { Bell, X, Clock } from 'lucide-react';

export default function Notifications({ notifications = [], isOpen, onClose, onToggle }) {
  const list = notifications || [];

  return (
    <div className="relative" dir="rtl">
      {/* زر الجرس مع العداد */}
      <button
        onClick={onToggle}
        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 relative transition"
        title="الإشعارات والتنبيهات"
      >
        <Bell className="w-3.5 h-3.5" />
        {list.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold font-mono">
            {list.length}
          </span>
        )}
      </button>

      {/* القائمة المنسدلة للإشعارات */}
      {isOpen && (
        <div className="absolute left-0 top-9 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 z-50 p-3 space-y-2">
          <div className="flex justify-between items-center border-b pb-2 font-bold text-xs text-slate-900">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-500" /> إشعارات النظام السحابية
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {list.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs">لا توجد إشعارات جديدة</div>
            ) : (
              list.map((n) => (
                <div key={n.id || Math.random()} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl text-[11px] space-y-1 transition border border-slate-100">
                  {n.title && <p className="font-bold text-slate-900">{n.title}</p>}
                  <p className="text-slate-700 leading-relaxed">{n.message || n.text}</p>
                  <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> 
                    {n.created_at ? new Date(n.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : (n.date || 'الآن')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}