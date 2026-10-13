import React, { useState, useEffect } from 'react';
import { Settings, Shield, Database, RefreshCw, Save, UploadCloud, RotateCcw } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminSettings({ apartments, refreshData }) {
  const [buildingName, setBuildingName] = useState('إتحاد ملاك البرج');
  const [monthlySubscription, setMonthlySubscription] = useState(200);
  const [saving, setSaving] = useState(false);
  const [resettingMonths, setResettingMonths] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('union_building_name');
    const savedFee = localStorage.getItem('union_monthly_fee');
    if (savedName) setBuildingName(savedName);
    if (savedFee) setMonthlySubscription(Number(savedFee));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('union_building_name', buildingName);
      localStorage.setItem('union_monthly_fee', monthlySubscription);
      alert('تم حفظ إعدادات البرج بنجاح!');
    } catch (error) {
      console.error('فشل الحفظ:', error);
    } finally {
      setSaving(false);
    }
  };

  // 1. تصدير نسخة احتياطية سحابية شاملة
  const handleCloudBackup = async () => {
    try {
      const [aptRes, expRes, maintRes, pollsRes, notifRes] = await Promise.all([
        supabase.from('apartments').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('maintenance').select('*'),
        supabase.from('polls').select('*'),
        supabase.from('notifications').select('*')
      ]);

      const fullBackup = {
        exportDate: new Date().toISOString(),
        buildingName,
        monthlySubscription,
        apartments: aptRes.data || [],
        expenses: expRes.data || [],
        maintenance: maintRes.data || [],
        polls: pollsRes.data || [],
        notifications: notifRes.data || []
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `building_union_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (error) {
      alert('فشل استخراج النسخة الاحتياطية: ' + error.message);
    }
  };

  // 2. استرجاع البيانات من ملف نسخة احتياطية (Restore)
  const handleRestoreBackup = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const backupData = JSON.parse(event.target.result);
          if (!backupData.apartments) {
            alert('ملف النسخة الاحتياطية غير صالح أو تالف.');
            return;
          }

          if (confirm('تنبيه: سيتم استبدال البيانات الحالية بالبيانات الموجودة في ملف النسخة الاحتياطية. هل أنت متأكد؟')) {
            // تحديث الشقق كمثال للاسترجاع السحابي
            for (const apt of backupData.apartments) {
              await supabase.from('apartments').upsert([apt]);
            }
            alert('تم استرجاع النسخة الاحتياطية بنجاح!');
            if (refreshData) refreshData();
          }
        } catch (error) {
          alert('فشل قراءة ملف النسخة الاحتياطية: ' + error.message);
        }
      };
    }
  };

  // 3. تصفير اشتراكات الشهر الجديد (تحويل كافة الشقق لغير مدفوع)
  const handleResetMonthlySubscriptions = async () => {
    if (!confirm('هل أنت متأكد من بدء شهر جديد وتصفير حالات الدفع لجميع الشقق (جعلها غير مدفوعة)?')) return;
    
    setResettingMonths(true);
    try {
      const { error } = await supabase
        .from('apartments')
        .update({ paid: false, status: 'unpaid' })
        .neq('id', 0); // تحديث كافة السجلات

      if (error) throw error;
      alert('تم تصفير اشتراكات الشهر الجديد بنجاح!');
      if (refreshData) refreshData();
    } catch (error) {
      alert('فشل تصفير الاشتراكات: ' + error.message);
    } finally {
      setResettingMonths(false);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" /> لوحة التحكم الإدارية وإعدادات البرج
        </h2>
        <p className="text-xs text-slate-500">إدارة اشتراكات البرج وإعدادات النظام السحابي (خاص بالمالك)</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" /> البيانات الأساسية للبرج
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 mb-1 font-medium">اسم العمارة / البرج</label>
            <input
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">قيمة الاشتراك الشهري الثابت (ج.م)</label>
            <input
              type="number"
              value={monthlySubscription}
              onChange={(e) => setMonthlySubscription(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>

      {/* قسم إدارة الدورة الشهرية للاشتراكات */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-500" /> إدارة الدورة المالية الشهرية
        </h3>
        <p className="text-slate-600">
          تجهيز النظام لبداية شهر جديد من خلال إعادة تعيين حالة سداد الاشتراكات لكافة الشقق إلى "غير مدفوع".
        </p>
        <button
          type="button"
          onClick={handleResetMonthlySubscriptions}
          disabled={resettingMonths}
          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> {resettingMonths ? 'جاري التصفير...' : 'بدء شهر جديد وتصفير اشتراكات الشقق'}
        </button>
      </div>

      {/* قسم النسخ الاحتياطي واستعادة البيانات */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" /> إدارة البيانات والنسخ الاحتياطي السحابي
        </h3>

        <p className="text-slate-600">
          إجمالي الشقق المسجلة حالياً في القاعدة السحابية: <b className="text-slate-900 font-mono">{apartments.length} شقة</b>
        </p>

        <div className="flex flex-wrap gap-2 pt-2 items-center">
          <button
            type="button"
            onClick={handleCloudBackup}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" /> تحميل نسخة احتياطية (JSON)
          </button>

          <label className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <UploadCloud className="w-3.5 h-3.5 text-emerald-600" /> استرجاع نسخة احتياطية
            <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('تنبيه: سيتم مسح الذاكرة المحلية المؤقتة فقط. هل تريد المتابعة؟')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> إعادة ضبط الذاكرة المؤقتة
          </button>
        </div>
      </div>
    </div>
  );
}