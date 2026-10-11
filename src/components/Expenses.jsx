import React, { useState } from 'react';
import { Receipt, PlusCircle, Calendar, Tag } from 'lucide-react';

export default function Expenses({ expenses, addExpense, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('صيانة');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date,
    });

    setTitle('');
    setAmount('');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-500" /> سجل الفواتير والمصروفات
        </h2>

        {/* زر إضافة مصروف يظهر للأدمن فقط */}
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> إضافة مصروف
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
        {expenses.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">لا يوجد مصروفات مسجلة حتى الآن</div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
              <div className="space-y-1">
                <span className="font-bold text-sm block text-slate-900">{exp.title}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {exp.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {exp.date}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-rose-600 font-mono">
                -{exp.amount} ج.م
              </span>
            </div>
          ))
        )}
      </div>

      {/* Modal إضافة مصروف للأدمن */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">تسجيل فاتورة / مصروف جديد</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">بيان المصروف</label>
                <input
                  type="text"
                  placeholder="مثال: صيانة المصعد الدوري"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">المبلغ (ج.م)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">الفئة</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="صيانة">صيانة</option>
                    <option value="كهرباء ومياه">كهرباء ومياه</option>
                    <option value="نظافة">نظافة وحراسة</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition"
                >
                  حفظ المصروف
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition"
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