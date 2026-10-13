import React, { useState } from 'react';
import { Bell, X, Clock, CheckCheck, Trash2, ShieldAlert, DollarSign, Wrench } from 'lucide-react';

export default function Notifications({ notifications = [], isOpen, onClose, onToggle, onClear }) {
  const [readIds, setReadIds] = useState(new Set());
  const list = notifications || [];

  const markAsRead = (id) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  // دالة لتحديد أيقونة ونوع الإشعار بناءً على محتواه
  const getNotificationBadge = (text = '') => {
    if (text.includes('سداد') || text.includes('اشتراك') || text.includes('مالي')) {
      return { icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    }
    if (text.includes('صيانة') || text.includes('أسانسير') || text.includes('عطل')) {
      return { icon: Wrench, color: 'bg-amber-50 text-amber-600 border-amber-200' };
    }
    return { icon: ShieldAlert, color: 'bg-blue-50 text-blue-600 border-blue-200' };
  };

  const unreadCount = list.filter(n => !readIds.has(n.id)).length;

  return (
    <div className="relative" dir="rtl">
      {/* زر الجرس مع العداد المباشر */}
      <button
        onClick={onToggle}
        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 relative transition cursor-pointer"
        title="الإشعارات والتنبيهات"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold font-mono animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* القائمة المنسدلة للإشعارات */}
      {isOpen && (
        <div className="absolute left-0 top-9 w-80 sm:w-88 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3">
          <div className="flex justify-between items-center border-b pb-2.5">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-500" /> إشعارات النظام السحابية
            </span>
            <div className="flex items-center gap-1">
              {list.length > 0 && onClear && (
                <button
                  onClick={onClear}
                  className="text-[10px] text-slate-400 hover:text-rose-600 px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                  title="مسح كل الإشعارات"
                >
                  <Trash2 className="w-3 h-3" /> مسح الكل
                </button>
              )}
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {list.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center gap-2">
                <CheckCheck className="w-6 h-6 text-emerald-400/60" />
                <span>لا توجد إشعارات جديدة حالياً</span>
              </div>
            ) : (
              list.map((n) => {
                const isRead = readIds.has(n.id);
                const contentText = n.message || n.text || '';
                const Badge = getNotificationBadge(contentText);
                const IconComponent = Badge.icon;

                return (
                  <div 
                    key={n.id || Math.random()} 
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-xl text-xs space-y-1.5 transition border cursor-pointer relative ${
                      isRead 
                        ? 'bg-slate-50/60 border-slate-100 text-slate-600 opacity-75' 
                        : 'bg-white border-slate-200/80 shadow-2xs hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${Badge.color}`}>
                        <IconComponent className="w-3 h-3" />
                      </div>
                      <div className="space-y-1 flex-1">
                        {n.title && <p className="font-bold text-slate-900">{n.title}</p>}
                        <p className="text-slate-700 leading-relaxed">{contentText}</p>
                      </div>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" title="غير مقروء" />
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-100/60 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500/70" /> 
                        {n.created_at ? new Date(n.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : (n.date || 'الآن')}
                      </span>
                      {isRead && <span className="text-emerald-600 text-[9px]">مقروء</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}