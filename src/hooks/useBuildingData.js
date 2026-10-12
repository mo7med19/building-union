import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useBuildingData() {
  const [apartments, setApartments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [polls, setPolls] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب كافة بيانات المبنى والإشعارات من Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [aptRes, expRes, maintRes, pollRes, notifRes] = await Promise.all([
        supabase.from('apartments').select('*').order('number', { ascending: true }),
        supabase.from('expenses').select('*'),
        supabase.from('maintenance').select('*'),
        supabase.from('polls').select('*'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(25)
      ]);

      if (aptRes.data) setApartments(aptRes.data);
      if (expRes.data) setExpenses(expRes.data);
      if (maintRes.data) setMaintenance(maintRes.data);
      if (pollRes.data) setPolls(pollRes.data);
      if (notifRes.data) setNotifications(notifRes.data);

    } catch (error) {
      console.error('خطأ في جلب البيانات من السحابة:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // الاستماع للإشعارات الجديدة فوراً عبر Supabase Realtime
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // إرسال إشعار سحابي جديد
  const sendNotification = async (title, message, type = 'general', target = 'all') => {
    try {
      await supabase.from('notifications').insert([
        { title, message, type, target_user: target }
      ]);
    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error.message);
    }
  };

  // 1. تحديث حالة السداد للشقق
  const togglePayment = async (id) => {
    const apt = apartments.find(a => a.id === id);
    if (!apt) return;
    const newPaid = !apt.paid;
    const newStatus = newPaid ? 'paid' : 'unpaid';

    setApartments(prev => prev.map(item => item.id === id ? { ...item, paid: newPaid, status: newStatus } : item));

    await supabase.from('apartments').update({ paid: newPaid, status: newStatus }).eq('id', id);
    
    // إرسال إشعار سحابي بتحديث الحالة
    if (newPaid) {
      sendNotification('تحديث الدفع', `تم اعتماد السداد لشقة ${apt.number}`, 'finance', apt.number);
    }
  };

  // 2. تحديث الإيصال
  const updateApartmentReceipt = async (id, receiptUrl, status) => {
    const apt = apartments.find(a => a.id === id);
    setApartments(prev => prev.map(item => item.id === id ? { ...item, receipt_url: receiptUrl, status: status } : item));

    await supabase.from('apartments').update({ receipt_url: receiptUrl, status: status }).eq('id', id);

    if (apt) {
      sendNotification('إيصال جديد', `قامت شقة ${apt.number} بإرفاق إيصال سداد جديد بانتظار المراجعة`, 'finance', 'admin');
    }
  };

  // 3. إضافة بند صيانة إضافي وتعميمه على الشقق
  const addExtraFeeToAll = async (feeTitle, shareAmount) => {
    try {
      const updatedApartments = apartments.map(apt => {
        const existing = apt.extra_fees || [];
        return { ...apt, extra_fees: [...existing, { title: feeTitle, amount: shareAmount }] };
      });
      
      setApartments(updatedApartments);

      for (let apt of apartments) {
        const existing = apt.extra_fees || [];
        const newFees = [...existing, { title: feeTitle, amount: shareAmount }];
        await supabase.from('apartments').update({ extra_fees: newFees }).eq('id', apt.id);
      }

      sendNotification('مطالبة مالية جديدة', `تم تعميم بند: ${بنود => feeTitle} بقيمة ${shareAmount} ج.م على الشقق`, 'finance', 'all');
    } catch (error) {
      console.error('خطأ في تعميم بند الصيانة:', error.message);
    }
  };

  return {
    apartments,
    expenses,
    maintenance,
    polls,
    notifications,
    loading,
    togglePayment,
    updateApartmentReceipt,
    addExtraFeeToAll,
    sendNotification,
    refreshData: fetchData
  };
}