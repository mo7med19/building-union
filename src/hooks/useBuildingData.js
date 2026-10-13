import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useBuildingData(isAdmin, addNotification) {
  const [apartments, setApartments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchApartments(),
        fetchExpenses(),
        fetchMaintenance(),
        fetchNotifications(),
        fetchPolls()
      ]);
    } catch (error) {
      console.error('خطأ أثناء جلب البيانات من السحابة:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. إدارة الشقق
  const fetchApartments = async () => {
    const { data, error } = await supabase.from('apartments').select('*').order('id', { ascending: true });
    if (!error && data) setApartments(data);
  };

  const addApartment = async (aptData) => {
    try {
      const { data, error } = await supabase
        .from('apartments')
        .insert([{
          number: aptData.number,
          owner: aptData.owner,
          phone: aptData.phone || '',
          notes: aptData.notes || 'ملكية خاصة',
          paid: false,
          status: 'unpaid',
          password: aptData.password || '1234'
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setApartments(prev => [...prev, data[0]]);
        if (addNotification) addNotification(`تم إضافة الشقة ${aptData.number} بنجاح`);
      }
    } catch (error) {
      console.error('فشل إضافة الشقة:', error.message);
      alert('فشل إضافة الشقة: ' + error.message);
    }
  };

  const updateApartment = async (id, updatedFields) => {
    try {
      const { error } = await supabase.from('apartments').update(updatedFields).eq('id', id);
      if (error) throw error;
      setApartments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedFields } : apt));
    } catch (error) {
      console.error('فشل تحديث الشقة:', error.message);
      alert('فشل التحديث: ' + error.message);
    }
  };

  const deleteApartment = async (id) => {
    try {
      const { error } = await supabase.from('apartments').delete().eq('id', id);
      if (error) throw error;
      setApartments(prev => prev.filter(apt => apt.id !== id));
    } catch (error) {
      console.error('فشل حذف الشقة:', error.message);
      alert('فشل الحذف: ' + error.message);
    }
  };

  const togglePayment = async (id) => {
    const apt = apartments.find(a => a.id === id);
    if (!apt) return;
    const newPaidStatus = !apt.paid;
    await updateApartment(id, { paid: newPaidStatus, status: newPaidStatus ? 'paid' : 'unpaid' });
  };

  const updateApartmentReceipt = async (id, receiptData) => {
    await updateApartment(id, receiptData);
  };

  // 2. إدارة الصيانة
  const fetchMaintenance = async () => {
    try {
      const { data, error } = await supabase.from('maintenance').select('*');
      if (!error && data) {
        setMaintenance(data);
      }
    } catch (err) {
      console.error('خطأ في جلب الصيانة:', err.message);
    }
  };

  const addMaintenance = async (maintData) => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .insert([{
          title: maintData.title,
          apartment: maintData.apartment,
          description: maintData.description || '',
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setMaintenance(prev => [data[0], ...prev]);
        if (addNotification) addNotification(`تم إرسال طلب صيانة جديد: ${maintData.title}`);
      }
    } catch (error) {
      console.error('خطأ في حفظ طلب الصيانة:', error.message);
      alert('فشل حفظ طلب الصيانة: ' + error.message);
    }
  };

  const updateMaintenanceStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('maintenance').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setMaintenance(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (error) {
      console.error('فشل تحديث حالة الصيانة:', error.message);
      alert('فشل التحديث: ' + error.message);
    }
  };

  // 3. إدارة المصروفات
  const fetchExpenses = async () => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (!error && data) setExpenses(data);
  };

  const addExpense = async (expData) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          title: expData.title,
          amount: expData.amount,
          category: expData.category || 'عام',
          date: new Date().toISOString().split('T')[0]
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setExpenses(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('فشل إضافة المصروف:', error.message);
      alert('فشل إضافة المصروف: ' + error.message);
    }
  };

  // 4. الإشعارات
  const fetchNotifications = async () => {
    const { data, error } = await supabase.from('notifications').select('*');
    if (!error && data) setNotifications(data);
  };

  // 5. الاستطلاعات (Polls)
  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase.from('polls').select('*');
      if (!error && data) {
        // تحويل title القادم من القاعدة إلى question ليتوافق مع مكون Polls.jsx
        const formattedPolls = data.map(poll => ({
          ...poll,
          question: poll.title || poll.question
        }));
        setPolls(formattedPolls);
      }
    } catch (err) {
      console.error('خطأ في جلب الاستطلاعات:', err.message);
    }
  };

const addPoll = async (pollData) => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .insert([{
          title: pollData.question || pollData.title, // استقبال السؤال وإرساله كعنوان للجدول
          options: pollData.options
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setPolls(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('فشل إضافة الاستطلاع:', error.message);
      alert('فشل إضافة الاستطلاع: ' + error.message);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    // دالة التصويت المحلية أو السحابية
  };

  return {
    apartments,
    expenses,
    maintenanceList: maintenance,
    notifications,
    polls,
    loading,
    refreshData: fetchAllData,
    addApartment,
    updateApartment,
    deleteApartment,
    togglePayment,
    updateApartmentReceipt,
    addMaintenance,
    updateMaintenanceStatus,
    addExpense,
    addPoll,
    handleVote
  };
}