import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  PlusCircle, 
  Trash2, 
  CreditCard, 
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  Vote,
  Upload
} from 'lucide-react';
import AuditLog from './AuditLog';

export default function Dashboard({ 
  netBalance = 0, 
  totalCollected = 0, 
  totalPending = 0, 
  totalSpent = 0,
  setActiveTab,
  isAdmin,
  currentUser,
  apartments = [], 
  auditLogs = []
}) {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      text: 'يرجى الالتزام بسداد الاشتراكات الشهرية في موعد أقصاه يوم 10 من كل شهر لضمان استمرار أعمال الصيانة والنظافة بانتظام.',
      date: '2026-10-01'
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // تم تصحيح هذا السطر: لن يتم عرض أي شقة وهمية إذا كانت القاعدة فارغة
  const myApartment = (apartments || []).find(
    (apt) => apt.number === currentUser?.apartment || apt.id === currentUser?.aptId || apt.owner === currentUser?.name
  );

  const totalTarget = totalCollected + totalPending;
  const collectionPercentage = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newAnnouncement,
      date: new Date().toISOString().split('T')[0]
    };

    setAnnouncements([newItem, ...announcements]);
    setNewAnnouncement('');
    setShowAddModal(false);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(item => item.id !== id));
  };

  // ---------------------------------------------------------------------------
  // 1. الرئيسية الخاصة بالساكن (Resident View)
  // ---------------------------------------------------------------------------
  if (!isAdmin) {
    if (!myApartment) {
      return (
        <div className="space-y-5" dir="rtl">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-sm">
            <Wallet className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">مرحباً بك، {currentUser?.name}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              حسابك ليس مرتبطاً بأي شقة حالياً في قاعدة البيانات السحابية. يرجى التواصل مع إدارة المبنى لربط حسابك بشقتك.
            </p>
          </div>

          {/* إعلانات البرج للساكن */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
              إعلانات وتنبيهات إدارة البرج
            </div>
            <div className="space-y-2">
              {announcements.map((item) => (
                <div key={item.id} className="bg-white/80 p-3 rounded-xl border border-amber-200/50 space-y-1">
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">{item.text}</p>
                  <span className="text-[10px] text-amber-700/60 block font-mono">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const isPaid = myApartment?.paid;
    const isPending = myApartment?.status === 'pending_review';

    return (
      <div className="space-y-5" dir="rtl">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700/80 relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs text-amber-400 font-bold block mb-1">
                مرحباً بك (شقة {myApartment?.number})
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white">موقفي المالي لهذا الشهر</h2>
            </div>
            <div className="bg-amber-500/20 p-2.5 rounded-2xl border border-amber-500/30">
              <Wallet className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div>
              <span className="text-[11px] text-slate-400 block">اشتراك الصيانة والخدمات</span>
              <span className="text-lg font-black text-white font-mono">200 ج.م</span>
            </div>

            <div>
              {isPaid ? (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-emerald-500/30">
                  <CheckCircle className="w-4 h-4" /> مسدد لهذا الشهر
                </span>
              ) : isPending ? (
                <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-amber-500/30">
                  <Clock className="w-4 h-4" /> بانتظار اعتماد الإدارة
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500/20 text-rose-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-rose-500/30">
                    <XCircle className="w-4 h-4" /> غير مسدد (مستحق)
                  </span>
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> سدد الآن
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('finance')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-400 transition text-right group space-y-2"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">تفاصيل اشتراكي</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">متابعة الإيصالات والدفع</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-400 transition text-right group space-y-2"
          >
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">الإبلاغ عن عطل</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">تقديم طلب صيانة للمرفق</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('polls')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-400 transition text-right group space-y-2 col-span-2 sm:col-span-1"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">تصويت القرارات</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">المشاركة في قرارات البرج</p>
            </div>
          </button>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
            إعلانات وتنبيهات إدارة البرج
          </div>

          <div className="space-y-2">
            {announcements.map((item) => (
              <div key={item.id} className="bg-white/80 p-3 rounded-xl border border-amber-200/50 space-y-1">
                <p className="text-xs text-amber-950 leading-relaxed font-medium">{item.text}</p>
                <span className="text-[10px] text-amber-700/60 block font-mono">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. الرئيسية الخاصة بالمالك والأدمن (Admin View)
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-5" dir="rtl">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700/80 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">إجمالي رصيد الصندوق الحالي</span>
            <h2 className="text-3xl md:text-4xl font-black text-amber-400 font-mono">
              {netBalance.toLocaleString()} <span className="text-sm font-sans text-slate-300">ج.م</span>
            </h2>
          </div>
          <div className="bg-amber-500/20 p-3 rounded-2xl border border-amber-500/30">
            <Wallet className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/60 relative z-10">
          <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 font-medium">
            <span>نسبة تحصيل اشتراكات الشهر</span>
            <span className="text-amber-400 font-bold font-mono">{collectionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-600/50">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">المحصل هذا الشهر</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg md:text-xl font-black text-emerald-600 font-mono">
              {totalCollected.toLocaleString()} <span className="text-xs text-slate-500">ج.م</span>
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">المتأخرات المستحقة</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg md:text-xl font-black text-rose-600 font-mono">
              {totalPending.toLocaleString()} <span className="text-xs text-slate-500">ج.م</span>
            </span>
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs col-span-2 md:col-span-1 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">إجمالي المصروفات</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg md:text-xl font-black text-slate-800 font-mono">
              {totalSpent.toLocaleString()} <span className="text-xs text-slate-500">ج.م</span>
            </span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <AuditLog logs={auditLogs} />

      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
            إداريات وتنبيهات البرج
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" /> إعلان جديد
          </button>
        </div>

        <div className="space-y-2">
          {announcements.map((item) => (
            <div key={item.id} className="bg-white/80 p-3 rounded-xl border border-amber-200/50 flex justify-between items-start gap-3">
              <div className="space-y-1">
                <p className="text-xs text-amber-950 leading-relaxed font-medium">{item.text}</p>
                <span className="text-[10px] text-amber-700/60 block font-mono">{item.date}</span>
              </div>
              <button
                onClick={() => handleDeleteAnnouncement(item.id)}
                className="text-amber-800/40 hover:text-rose-600 p-1 transition rounded-md"
                title="حذف الإعلان"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">نشر تنبيه أو إعلان جديد للجيران</h3>
            
            <form onSubmit={handleAddAnnouncement} className="space-y-3">
              <textarea
                placeholder="اكتب التنبيه هنا..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                rows={3}
                required
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 rounded-xl text-xs transition"
                >
                  نشر التنبيه
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl text-xs transition"
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