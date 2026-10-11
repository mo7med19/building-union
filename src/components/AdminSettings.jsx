import React, { useState } from 'react';
import { Settings, Shield, Key, Database, RefreshCw, Save } from 'lucide-react';

export default function AdminSettings({ apartments }) {
  const [buildingName, setBuildingName] = useState('برج الصفا والمروة');
  const [monthlySubscription, setMonthlySubscription] = useState(200);

  const handleSave = (e) => {
    e.preventDefault();
    alert('تم حفظ إعدادات البرج بنجاح!');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" /> لوحة التحكم الإدارية وإعدادات البرج
        </h2>
        <p className="text-xs text-slate-500">إدارة اشتراكات البرج وإعادة ضبط البيانات (خاص بالمالك)</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" /> البيانات الأساسية
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 mb-1 font-medium">اسم العمارة / البرج</label>
            <input
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">قيمة الاشتراك الشهري الثابت (ج.م)</label>
            <input
              type="number"
              value={monthlySubscription}
              onChange={(e) => setMonthlySubscription(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" /> حفظ التغيرات
        </button>
      </form>

      {/* قسم النسخ الاحتياطي وإعادة الضبط */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" /> إدارة البيانات والنسخ الاحتياطي
        </h3>

        <p className="text-slate-600">
          إجمالي الشقق المسجلة حالياً: <b className="text-slate-900 font-mono">{apartments.length} شقة</b>
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "union_backup.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5"
          >
            تحميل نسخة احتياطية (Backup)
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('هل أنت تأكد من إعادة ضبط كافة البيانات؟ سيتم مسح التغييرات.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> إعادة ضبط النظام
          </button>
        </div>
      </div>
    </div>
  );
}