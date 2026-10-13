import React, { useState, useMemo } from 'react';
import { Receipt, PlusCircle, Calendar, Tag, Trash2, Filter } from 'lucide-react';

export default function Expenses({ expenses = [], addExpense, deleteExpense, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('صيانة');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('الكل');

  // حساب إجمالي المصروفات وتصنيفها
  const { totalAmount, filteredExpenses } = useMemo(() => {
    const list = expenses || [];
    const total = list.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
    const filtered = selectedCategoryFilter === 'الكل' 
      ? list 
      : list.filter(exp => exp.category === selectedCategoryFilter);

    return { totalAmount: total, filteredExpenses: filtered };
  }, [expenses, selectedCategoryFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    if (addExpense) {
      addExpense({
        id: Date.now(),
        title,
        amount: parseFloat(amount),
        category,
        date,
      });
    }

    setTitle('');
    setAmount('');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      if (deleteExpense) {
        deleteExpense(id);
      }
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* رأس الصفحة وإجمالي المصاريف */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" /> سجل الفواتير والمصروفات
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة المصروفات التشغيلية وصيانة البرج</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-xl text-xs">
            <span className="text-slate-600 ml-1">إجمالي المنصرف:</span>
            <strong className="text-rose-600 font-mono text-sm">{totalAmount} ج.م</strong>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> إضافة مصروف
            </button>
          )}
        </div>
      </div>

      {/* شريط الفلاتر والتصنيفات */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 flex items-center gap-1 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5" /> تصفية حسب:
        </span>
        {['الكل', 'صيانة', 'كهرباء ومياه', 'نظافة وحراسة', 'أخرى'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 cursor-pointer ${
              selectedCategoryFilter === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* قائمة المصروفات */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Receipt className="w-8 h-8 text-slate-300" />
            <span>لا توجد مصروفات مسجلة ضمن هذا التصنيف حتى الآن</span>
          </div>
        ) : (
          filteredExpenses.map((exp) => (
            <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-slate-50/80 transition group">
              <div className="space-y-1">
                <span className="font-bold text-sm text-slate-900">{exp.title}</span>
                <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium flex items-center gap-1 border border-slate-200/60">
                    <Tag className="w-3 h-3 text-amber-500" /> {exp.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" /> {exp.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-rose-600 font-mono">
                  -{exp.amount} ج.م
                </span>
                {isAdmin && handleDelete && (
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="حذف المصروف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
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
                <label className="block text-slate-600 mb-1 font-medium">بيان المصروف</label>
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
                  <label className="block text-slate-600 mb-1 font-medium">المبلغ (ج.م)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">الفئة</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="صيانة">صيانة</option>
                    <option value="كهرباء ومياه">كهرباء ومياه</option>
                    <option value="نظافة وحراسة">نظافة وحراسة</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">التاريخ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  حفظ المصروف
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition cursor-pointer font-medium"
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