import React, { useState, useMemo } from 'react';
import { Wrench, PlusCircle, CheckCircle2, Clock, AlertTriangle, Trash2, Filter } from 'lucide-react';

export default function Maintenance({ maintenanceList = [], addMaintenance, updateStatus, deleteMaintenance, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [apartment, setApartment] = useState('');
  const [description, setDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const list = maintenanceList || [];

  const filteredList = useMemo(() => {
    if (statusFilter === 'all') return list;
    return list.filter(item => item.status === statusFilter);
  }, [list, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !apartment) return;

    if (addMaintenance) {
      addMaintenance({
        title,
        apartment,
        description,
        status: 'pending'
      });
    }

    setTitle('');
    setApartment('');
    setDescription('');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا البلاغ نهائياً؟')) {
      if (deleteMaintenance) {
        deleteMaintenance(id);
      }
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" /> طلبات الأعطال والصيانة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">الإبلاغ عن أعطال المرافق العامة ومتابعة حلها</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> طلب عطل جديد
        </button>
      </div>

      {/* فلاتر حالات الصيانة */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 flex items-center gap-1 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5" /> تصفية حسب الحالة:
        </span>
        {[
          { id: 'all', label: 'الكل' },
          { id: 'pending', label: 'قيد الانتظار' },
          { id: 'in-progress', label: 'قيد العمل' },
          { id: 'completed', label: 'تم الإصلاح' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-400 text-xs">
            لا توجد طلبات صيانة مسجلة ضمن هذا التصنيف حالياً
          </div>
        ) : (
          filteredList.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      {item.apartment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.description || 'بدون تفاصيل إضافية'}</p>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'completed' && (
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5" /> تم الإصلاح
                    </span>
                  )}
                  {item.status === 'in-progress' && (
                    <span className="bg-amber-50 text-amber-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-amber-200/60">
                      <Clock className="w-3.5 h-3.5" /> قيد العمل
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className="bg-rose-50 text-rose-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-rose-200/60">
                      <AlertTriangle className="w-3.5 h-3.5" /> قيد الانتظار
                    </span>
                  )}

                  {isAdmin && deleteMaintenance && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="حذف البلاغ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">{item.date}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => updateStatus && updateStatus(item.id, 'in-progress')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      قيد العمل
                    </button>
                    <button
                      onClick={() => updateStatus && updateStatus(item.id, 'completed')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
                    >
                      إتمام الإصلاح
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">الإبلاغ عن عطل أو طلب صيانة</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">عنوان العطل</label>
                <input
                  type="text"
                  placeholder="مثال: لمبة الدور الثالث محروقة"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">رقم الشقة المبلغة</label>
                <input
                  type="text"
                  placeholder="مثال: شقة 102"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">تفاصيل إضافية (اختياري)</label>
                <textarea
                  placeholder="اكتب تفاصيل المشكلة لتسهيل حلها..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  إرسال البلاغ
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}