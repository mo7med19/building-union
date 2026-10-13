import React, { useState, useEffect, useMemo } from 'react';
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
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import CalculatorModal from './components/CalculatorModal';
import { useBuildingData } from './hooks/useBuildingData';
import { LogOut, Calculator } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('union_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  // الحفاظ على التبويب النشط حتى بعد تحديث الصفحة (Refresh)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('union_active_tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'تم الاتصال بقاعدة البيانات السحابية بنجاح', date: 'الآن' }
  ]);

  const isAdmin = user?.role === 'admin';

  const addNotification = (text) => {
    setNotifications(prev => [{ id: Date.now(), text, date: 'الآن' }, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const {
    apartments, 
    expenses, 
    polls, 
    maintenanceList,
    togglePayment, 
    addApartment, 
    updateApartment, 
    deleteApartment, 
    updateApartmentReceipt, 
    updateApartmentExtraFees,
    addExpense, 
    deleteExpense, 
    addPoll, 
    deletePoll,
    handleVote, 
    addMaintenance, 
    updateMaintenanceStatus, 
    deleteMaintenance,
    refreshData
  } = useBuildingData(isAdmin, addNotification);

  useEffect(() => {
    if (user) localStorage.setItem('union_current_user', JSON.stringify(user));
    else localStorage.removeItem('union_current_user');
  }, [user]);

  // حفظ التبويب النشط في التخزين المحلي كلما تغير
  useEffect(() => {
    try {
      localStorage.setItem('union_active_tab', activeTab);
    } catch {}
  }, [activeTab]);

  const { totalCollected, totalPending, totalSpent, netBalance } = useMemo(() => {
    const monthlyFee = Number(localStorage.getItem('union_monthly_fee')) || 200;
    const collected = (apartments || []).filter(a => a.paid).length * monthlyFee;
    const pending = (apartments || []).filter(a => !a.paid).length * monthlyFee;
    const spent = (expenses || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return { totalCollected: collected, totalPending: pending, totalSpent: spent, netBalance: collected - spent };
  }, [apartments, expenses]);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 md:pb-12" dir="rtl">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

      <div className="bg-slate-900 border-t border-slate-800 text-white px-4 py-2 text-xs flex justify-between items-center max-w-5xl mx-auto md:rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>مرحباً، <b>{user.name}</b> ({isAdmin ? 'مالك / أدمن' : 'ساكن'})</span>
        </div>

        <div className="flex items-center gap-2 relative">
          <button onClick={() => setShowCalculator(!showCalculator)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 transition cursor-pointer" title="حسابات سريعة">
            <Calculator className="w-3.5 h-3.5" />
          </button>

          <Notifications 
            notifications={notifications} 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
            onToggle={() => setShowNotifications(!showNotifications)} 
            onClear={clearNotifications}
          />

          <button onClick={() => setUser(null)} className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2.5 py-1 rounded-lg transition flex items-center gap-1 font-medium text-xs cursor-pointer">
            <LogOut className="w-3 h-3" /> خروج
          </button>
        </div>
      </div>

      {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            netBalance={netBalance} 
            totalCollected={totalCollected} 
            totalPending={totalPending} 
            totalSpent={totalSpent} 
            setActiveTab={setActiveTab} 
            isAdmin={isAdmin} 
            currentUser={user} 
            apartments={apartments} 
            auditLogs={notifications} 
          />
        )}

        {activeTab === 'finance' && (
          <Finance 
            apartments={apartments} 
            togglePayment={togglePayment} 
            isAdmin={isAdmin} 
            currentUser={user} 
            updateApartmentReceipt={updateApartmentReceipt} 
            updateApartmentExtraFees={updateApartmentExtraFees}
            addNotification={addNotification} 
          />
        )}

        {activeTab === 'expenses' && (
          <Expenses 
            expenses={expenses} 
            addExpense={addExpense} 
            deleteExpense={deleteExpense} 
            isAdmin={isAdmin} 
          />
        )}

        {activeTab === 'polls' && (
          <Polls 
            polls={polls} 
            handleVote={handleVote} 
            addPoll={addPoll} 
            deletePoll={deletePoll} 
            isAdmin={isAdmin} 
          />
        )}

        {activeTab === 'maintenance' && (
          <Maintenance 
            maintenanceList={maintenanceList} 
            addMaintenance={addMaintenance} 
            updateStatus={updateMaintenanceStatus} 
            deleteMaintenance={deleteMaintenance}
            isAdmin={isAdmin} 
          />
        )}

        {activeTab === 'directory' && (
          <Directory 
            apartments={apartments} 
            addApartment={addApartment}
            updateApartment={updateApartment} 
            deleteApartment={deleteApartment} 
            isAdmin={isAdmin} 
          />
        )}

        {activeTab === 'guidelines' && <Guidelines isAdmin={isAdmin} />}
        {activeTab === 'profile' && <Profile user={user} onUpdateUser={setUser} onLogout={() => setUser(null)} />}
        {activeTab === 'admin-settings' && isAdmin && <AdminSettings apartments={apartments} refreshData={refreshData} />}
      </main>
    </div>
  );
}