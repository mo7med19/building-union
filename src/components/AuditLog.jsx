import React from 'react';
import { Activity, Clock } from 'lucide-react';

export default function AuditLog({ logs = [] }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3" dir="rtl">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Activity className="w-4 h-4 text-amber-500" />
          سجل النشاطات والحركات الأخيرة في البرج
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">مباشر</span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-xs">لا توجد نشاطات مسجلة حديثاً</div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex justify-between items-center gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-100/60 text-amber-700 rounded-lg shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{log.text || log.action}</p>
                  <span className="text-[10px] text-slate-500">{log.details || 'إجراء إداري'}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}