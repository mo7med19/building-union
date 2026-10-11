import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Finance from './components/Finance';
import Expenses from './components/Expenses';
import Polls from './components/Polls';
import Maintenance from './components/Maintenance';
import Directory from './components/Directory';
import Guidelines from './components/Guidelines';
import AdminSettings from './components/AdminSettings';
import { initialApartments, initialExpenses, initialPolls } from './data/mockData';
import { LogOut, Bell, Printer, Calculator, X } from 'lucide-react';

export default function App() {
  // التحقق من حالة تسجيل الدخول المخزنة
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('union_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // إعدادات حاسبة المساحة
  const [squareMeterRate, setSquareMeterRate] = useState(2);
  const [calcArea, setCalcArea] = useState(120);

  // إدارة البيانات مع التخزين المحلي LocalStorage
  const [apartments, setApartments] = useState(() => {
    const saved = localStorage.getItem('union_apartments');
    return saved ? JSON.parse(saved) : initialApartments;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('union_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [polls, setPolls] = useState(() => {
    const saved = localStorage.getItem('union_polls');
    return saved ? JSON.parse(saved) : initialPolls;
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'تم تسجيل فاتورة صيانة مصعد جديدة', date: 'منذ ساعتين' },
    { id: 2, text: 'تم طرح تصويت جديد يرجى إبداء رأيك', date: 'منذ يوم' }
  ]);

  const [maintenanceList, setMaintenanceList] = useState(() => {
    const saved = localStorage.getItem('union_maintenance');
    return saved ? JSON.parse(saved) : [];
  });

  // الحفظ التلقائي في LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('union_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('union_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('union_apartments', JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    localStorage.setItem('union_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('union_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('union_maintenance', JSON.stringify(maintenanceList));
  }, [maintenanceList]);

  // إذا لم يكن المستخدم مسجلاً للدخول، يتم عرض شاشة تسجيل الدخول
  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  const isAdmin = user.role === 'admin';

  // الإشعارات
  const addNotification = (text) => {
    setNotifications(prev => [{ id: Date.now(), text, date: 'الآن' }, ...prev]);
  };

  // العمليات والإجراءات بحسب الصلاحية
  const togglePayment = (id) => {
    if (!isAdmin) return;
    setApartments(apartments.map(apt => 
      apt.id === id ? { ...apt, paid: !apt.paid } : apt
    ));
  };

  const addApartment = (newApt) => {
    if (!isAdmin) return;
    setApartments(prev => [...prev, newApt]);
  };

  const addExpense = (newExp) => {
    if (!isAdmin) return;
    setExpenses(prev => [newExp, ...prev]);
    addNotification(`تم إضافة مصروف جديد: ${newExp.title}`);
  };

  const addPoll = (newPoll) => {
    setPolls(prev => [newPoll, ...prev]);
    addNotification(`تم طرح تصويت جديد: ${newPoll.question}`);
  };

  const handleVote = (pollId, optionId) => {
    setPolls(polls.map(p => {
      if (p.id === pollId && !p.userVoted) {
        return {
          ...p,
          userVoted: optionId,
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    }));
  };

  const addMaintenance = (newReq) => {
    setMaintenanceList(prev => [newReq, ...prev]);
  };

  const updateMaintenanceStatus = (id, status) => {
    if (!isAdmin) return;
    setMaintenanceList(maintenanceList.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const handlePrintReport = () => {
    window.print();
  };

  // العمليات الحسابية
  const monthlyFee = 200;
  const totalCollected = apartments.filter(a => a.paid).length * monthlyFee;
  const totalPending = apartments.filter(a => !a.paid).length * monthlyFee;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalCollected - totalSpent;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 md:pb-12" dir="rtl">
      {/* شريط التنقل العلوي والسفلي */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin}
      />

      {/* الشريط الفرعي لإدارة المستخدم والأدوات */}
      <div className="bg-slate-900 border-t border-slate-800 text-white px-4 py-2 text-xs flex justify-between items-center max-w-5xl mx-auto md:rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>مرحباً، <b>{user.name}</b> ({isAdmin ? 'مالك / أدمن' : 'ساكن'})</span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* حاسبة المساحة */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 transition"
            title="حاسبة رسوم المساحة"
          >
            <Calculator className="w-3.5 h-3.5" />
          </button>

          {/* طباعة التقرير */}
          <button
            onClick={handlePrintReport}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            title="طباعة التقرير المالي"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* الإشعارات */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 relative transition"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {/* تسجيل الخروج */}
          <button
            onClick={() => setUser(null)}
            className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2.5 py-1 rounded-lg transition flex items-center gap-1 font-medium"
          >
            <LogOut className="w-3 h-3" /> خروج
          </button>

          {/* نافذة الإشعارات المنسدلة */}
          {showNotifications && (
            <div className="absolute left-0 top-8 w-64 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 z-50 p-3 space-y-2">
              <div className="flex justify-between items-center border-b pb-2 font-bold text-xs text-slate-900">
                <span>الإشعارات والتحديثات</span>
                <button onClick={() => setShowNotifications(false)}><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 bg-slate-50 rounded-xl text-[11px] space-y-0.5">
                    <p className="font-semibold text-slate-800">{n.text}</p>
                    <span className="text-[9px] text-slate-400">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal حاسبة الاشتراك حسب المساحة */}
      {showCalculator && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">حاسبة قيمة الاشتراك بالمساحة</h3>
              <button onClick={() => setShowCalculator(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">مساحة الشقة (متر مربع)</label>
                <input
                  type="number"
                  value={calcArea}
                  onChange={(e) => setCalcArea(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">سعر المتر المعتمد (ج.م)</label>
                <input
                  type="number"
                  value={squareMeterRate}
                  onChange={(e) => setSquareMeterRate(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] text-amber-800 block">المبلغ المطلوب شهرياً</span>
                <span className="text-xl font-black text-amber-600 font-mono">
                  {calcArea * squareMeterRate} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي للتبويبات */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            netBalance={netBalance}
            totalCollected={totalCollected}
            totalPending={totalPending}
            totalSpent={totalSpent}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'finance' && (
          <Finance 
            apartments={apartments}
            togglePayment={togglePayment}
            addApartment={addApartment}
            isAdmin={isAdmin}
            currentUser={user}
          />
        )}

        {activeTab === 'expenses' && (
          <Expenses 
            expenses={expenses}
            addExpense={addExpense}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'polls' && (
          <Polls 
            polls={polls}
            handleVote={handleVote}
            addPoll={addPoll}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'maintenance' && (
          <Maintenance 
            maintenanceList={maintenanceList}
            addMaintenance={addMaintenance}
            updateStatus={updateMaintenanceStatus}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'directory' && (
          <Directory apartments={apartments} />
        )}

        {activeTab === 'guidelines' && (
          <Guidelines />
        )}

        {activeTab === 'admin-settings' && isAdmin && (
          <AdminSettings apartments={apartments} />
        )}
      </main>
    </div>
  );
}