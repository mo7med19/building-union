import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Car, Volume2, Trash2, Clock, PlusCircle, Edit3, Trash, Check } from 'lucide-react';

export default function Guidelines({ isAdmin }) {
  const [rules, setRules] = useState([
    {
      id: 1,
      title: 'مواعيد سداد الاشتراكات',
      desc: 'يرجى الالتزام بسداد اشتراك الصيانة قبل يوم 10 من كل شهر لضمان استمرار أعمال النظافة وصيانة المصعد.',
      category: 'مالي'
    },
    {
      id: 2,
      title: 'تنظيم الجراج والسيارات',
      desc: 'الالتزام بالأماكن المخصصة لكل شقة، ومنع ركن السيارات أمام مخرج المدخل الرئيسي منعاً للمساءلة.',
      category: 'أمن'
    },
    {
      id: 3,
      title: 'الهدوء ومراعاة الجيران',
      desc: 'يرجى الحد من الأصوات المرتفعة وأعمال الصيانة المزعجة بعد الساعة 10 مساءً وفي أيام العطلات.',
      category: 'عام'
    },
    {
      id: 4,
      title: 'إلقاء القمامة والنظافة العامة',
      desc: 'وضع القمامة في الأكياس المغلقة بالأماكن المخصصة لها، وإلقاؤها في المواعيد المحددة لجمع النظافة.',
      category: 'نظافة'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('عام');

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const newRule = {
      id: Date.now(),
      title: newTitle,
      desc: newDesc,
      category: newCategory
    };

    setRules([newRule, ...rules]);
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  const handleDeleteRule = (id) => {
    if (confirm('هل أنت متأكد من حذف هذه اللائحة أو البند؟')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" /> اللائحة الداخلية وقواعد البرج
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">التعليمات الواجب اتباعها لضمان راحة وسلامة الجميع</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> إضافة بند جديد
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/50">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{rule.title}</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {rule.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pr-2">{rule.desc}</p>

            {isAdmin && (
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                  title="حذف البند"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* نافذة إضافة بند جديد للأدمن */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">إضافة بند جديد إلى اللائحة</h3>
            
            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">عنوان البند</label>
                <input
                  type="text"
                  placeholder="مثال: مواعيد استخدام المصعد"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">التصنيف</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="عام">عام</option>
                  <option value="مالي">مالي</option>
                  <option value="أمن">أمن وصيانة</option>
                  <option value="نظافة">نظافة وهدوء</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">تفاصيل البند والتعليمات</label>
                <textarea
                  placeholder="اكتب تفاصيل القاعدة أو التعليمات بوضوح..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  حفظ ونشر البند
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