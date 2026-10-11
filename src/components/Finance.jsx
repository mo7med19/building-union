import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  CreditCard,
  Building,
  Upload,
  ShieldAlert
} from 'lucide-react';

export default function Finance({ apartments, togglePayment, addApartment, isAdmin, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newNumber, setNewNumber] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // إذا كان المستخدم ساكناً، نحدد شقته فقط
  const myApartment = apartments.find(
    (apt) => apt.number === currentUser?.apartment || apt.id === currentUser?.aptId
  ) || apartments[0]; // افتراضي للتجربة

  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch = 
      apt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.owner.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'paid') return matchesSearch && apt.paid;
    if (filterStatus === 'unpaid') return matchesSearch && !apt.paid;
    return matchesSearch;
  });

  const totalCount = apartments.length;
  const paidCount = apartments.filter(a => a.paid).length;
  const unpaidCount = totalCount - paidCount;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newNumber || !newOwner) return;

    if (addApartment) {
      addApartment({
        id: Date.now(),
        number: newNumber.startsWith('شقة') ? newNumber : `شقة ${newNumber}`,
        owner: newOwner,
        phone: newPhone || '01000000000',
        paid: false
      });
    }

    setNewNumber('');
    setNewOwner('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const sendWhatsAppReminder = (apt) => {
    const text = `السلام عليكم أ/ ${apt.owner} (${apt.number})، نود تذكيركم بلطف بسداد اشتراك الصيانة والخدمات الشهرية للبرج. شاكرين حسن تعاونكم!`;
    const url = `https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // -------------------------------------------------------------
  // 1. واجهة الساكن العادي (موقفه الشخصي فقط)
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" /> حالة اشتراكي الشهري
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة موقف شقتك ورفع إيصالات الدفع</p>
        </div>

        {/* كارت موقف شقة الساكن */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium block">بيانات الشقة والساكن</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{myApartment?.number}</h3>
              <p className="text-xs text-slate-600">{myApartment?.owner}</p>
            </div>

            <div>
              {myApartment?.paid ? (
                <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                  <CheckCircle className="w-4 h-4" /> مسدد لهذا الشهر
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-rose-200">
                  <XCircle className="w-4 h-4" /> غير مسدد (مستحق)
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <span className="text-[11px] text-slate-500 block">المبلغ المطلوب سداده</span>
              <span className="text-lg font-black text-slate-800 font-mono">200 ج.م</span>
            </div>

            {!myApartment?.paid && (
              <button 
                onClick={() => alert('يمكنك إرسال إيصال التحويل عبر الواتساب للأدمن مباشرة.')}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-4 h-4" /> إرفاق إيصال التحويل
              </button>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            ملاحظة: لحفظ خصوصيات الملاك، يتم عرض الموقف المالي الخاص بشقتك فقط. يمكنك مراجعة تقارير المصروفات العامة من تبويب <b>"الشفافية المالية"</b>.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. واجهة الأدمن والمالك (الجدول الكامل والإدارة)
  // -------------------------------------------------------------
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" /> إدارة اشتراكات الشقق الكاملة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">لوحة تحصيل الاشتراكات وإدارة المتأخرات</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition self-end sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> إضافة شقة جديدة
        </button>
      </div>

      {/* شريط الإحصائيات */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900 text-white p-3 rounded-2xl shadow-sm">
        <div className="text-center border-l border-slate-800">
          <span className="text-[10px] text-slate-400 block">إجمالي الشقق</span>
          <span className="text-base font-extrabold text-amber-400 font-mono">{totalCount}</span>
        </div>
        <div className="text-center border-l border-slate-800">
          <span className="text-[10px] text-slate-400 block">تم السداد</span>
          <span className="text-base font-extrabold text-emerald-400 font-mono">{paidCount}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-slate-400 block">المتأخرات</span>
          <span className="text-base font-extrabold text-rose-400 font-mono">{unpaidCount}</span>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="ابحث برقم الشقة أو اسم المالك..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/80 pr-9 pl-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs gap-1 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterStatus === 'all' ? 'bg-white text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterStatus === 'paid' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            مسدد
          </button>
          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterStatus === 'unpaid' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            غير مسدد
          </button>
        </div>
      </div>

      {/* قائمة الشقق الكاملة */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {filteredApartments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">لا توجد نتائج تطابق بحثك</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApartments.map((apt) => (
              <div key={apt.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50 transition gap-2">
                <div>
                  <span className="font-bold text-sm block text-slate-900">{apt.number}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">{apt.owner}</span>
                </div>

                <div className="flex items-center gap-2">
                  {apt.paid ? (
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-200/60">
                      <CheckCircle className="w-3.5 h-3.5" /> مسدد
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="bg-rose-50 text-rose-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-rose-200/60">
                        <XCircle className="w-3.5 h-3.5" /> غير مسدد
                      </span>

                      {apt.phone && (
                        <button
                          onClick={() => sendWhatsAppReminder(apt)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg text-xs transition"
                          title="إرسال تذكير عبر واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => togglePayment(apt.id)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition font-medium border border-slate-200/60"
                  >
                    تبديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal إضافة شقة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">إضافة شقة جديدة للبرج</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">رقم / اسم الشقة</label>
                <input
                  type="text"
                  placeholder="مثال: شقة 301"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">اسم الساكن / المالك</label>
                <input
                  type="text"
                  placeholder="اسم المالك ثلاثي"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">رقم الهاتف (للتواصل)</label>
                <input
                  type="tel"
                  placeholder="01012345678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition"
                >
                  إضافة الشقة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition"
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