import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Search, 
  UserCheck, 
  Copy, 
  Check, 
  ShieldAlert, 
  Wrench, 
  Zap, 
  Users,
  Edit3,
  Trash2,
  PlusCircle,
  X
} from 'lucide-react';

export default function Directory({ apartments = [], addApartment, updateApartment, deleteApartment, isAdmin }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // حالات Modal إضافة شقة جديدة
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isRental, setIsRental] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');

  // حالة الشقة الجاري تعديلها
  const [editingApartment, setEditingApartment] = useState(null);

  // أرقام الطوارئ
  const emergencyContacts = [
    { name: 'حارس العمارة', phone: '01000000001', icon: UserCheck, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'طوارئ المصعد', phone: '01000000002', icon: Wrench, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'طوارئ الكهرباء', phone: '01000000003', icon: Zap, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  const filteredApartments = apartments.filter((apt) => {
    const search = searchTerm.toLowerCase();
    return (
      (apt.number && apt.number.toLowerCase().includes(search)) ||
      (apt.owner && apt.owner.toLowerCase().includes(search)) ||
      (apt.phone && apt.phone.includes(search)) ||
      (apt.tenantName && apt.tenantName.toLowerCase().includes(search))
    );
  });

  const copyToClipboard = (phone, id) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newNumber || !newOwner) return;

    if (addApartment) {
      // إرسال البيانات بدون تحديد id يدوياً لكي تقوم القاعدة بتوليده تلقائياً
      addApartment({
        number: newNumber.startsWith('شقة') ? newNumber : `شقة ${newNumber}`,
        owner: newOwner,
        phone: newPhone || '01000000000',
        notes: isRental ? `مؤجرة - المستأجر: ${newTenantName || 'غير متوفر'} (${newTenantPhone || ''})` : 'ملكية خاصة',
        paid: false,
        receipt_url: null,
        status: 'unpaid',
        password: '123'
      });
    }

    setNewNumber('');
    setNewOwner('');
    setNewPhone('');
    setNewTenantName('');
    setNewTenantPhone('');
    setIsRental(false);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingApartment) return;
    if (updateApartment) updateApartment(editingApartment.id, editingApartment);
    setEditingApartment(null);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* 1. الهيدر وزر الإضافة للأدمن */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> دليل السكان وشقق المبنى
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">إدارة شقق البرج، بيانات الملاك، وأرقام التواصل</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> إضافة شقة جديدة
          </button>
        )}
      </div>

      {/* 2. قسم أرقام الطوارئ */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-3">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> أرقام الخدمات والطوارئ
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {emergencyContacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <a
                key={idx}
                href={`tel:${contact.phone}`}
                className="bg-slate-800/90 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg border ${contact.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-200">{contact.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{contact.phone}</span>
                  </div>
                </div>
                <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-lg group-hover:bg-amber-500 group-hover:text-slate-900 transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* 3. شريط البحث */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        <input
          type="text"
          placeholder="ابحث برقم الشقة، اسم المالك، أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200/80 pr-10 pl-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition shadow-2xs"
        />
      </div>

      {/* 4. كروت أرقام السكان */}
      <div className="grid gap-3 md:grid-cols-2">
        {filteredApartments.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-400 text-xs">
            لا توجد شقة أو ساكن يطابق بحثك
          </div>
        ) : (
          filteredApartments.map((apt) => {
            const cleanPhone = apt.phone ? apt.phone.replace(/[^0-9]/g, '') : '';
            const isCopied = copiedId === apt.id;

            return (
              <div 
                key={apt.id} 
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{apt.number}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600">
                        {apt.notes || 'ملكية خاصة'}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-700 mt-1">
                      المالك: {apt.owner}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingApartment(apt)}
                          className="p-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 rounded-lg text-slate-500 transition"
                          title="تعديل الشقة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteApartment(apt.id)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 transition"
                          title="حذف الشقة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-600 font-mono" dir="ltr">
                        {apt.phone || 'غير مسجل'}
                      </span>
                      {apt.phone && (
                        <button
                          onClick={() => copyToClipboard(apt.phone, apt.id)}
                          className="text-slate-400 hover:text-amber-600 p-0.5 transition"
                          title="نسخ الرقم"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {apt.phone && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a 
                      href={`tel:${apt.phone}`} 
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition border border-emerald-200/60"
                    >
                      <Phone className="w-3.5 h-3.5" /> اتصال
                    </a>

                    <a 
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> واتساب
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal إضافة شقة جديدة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">إضافة شقة جديدة للبرج</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">رقم الشقة</label>
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
                <label className="block text-slate-600 mb-1 font-medium">اسم المالك الأساسي</label>
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
                <label className="block text-slate-600 mb-1 font-medium">هاتف المالك</label>
                <input
                  type="tel"
                  placeholder="01012345678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-slate-700 mb-1 font-bold">حالة إشغال الشقة</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="occupancy"
                      checked={!isRental}
                      onChange={() => setIsRental(false)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>مالك مقيم</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="occupancy"
                      checked={isRental}
                      onChange={() => setIsRental(true)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>مؤجرة (مستأجر)</span>
                  </label>
                </div>
              </div>

              {isRental && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 block">بيانات المستأجر</span>
                  <div>
                    <label className="block text-slate-600 mb-1">اسم المستأجر</label>
                    <input
                      type="text"
                      placeholder="اسم المستأجر"
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">هاتف المستأجر</label>
                    <input
                      type="tel"
                      placeholder="010xxxxxxxxx"
                      value={newTenantPhone}
                      onChange={(e) => setNewTenantPhone(e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-lg bg-white font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition"
                >
                  حفظ وإضافة الشقة
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

      {/* Modal تعديل شقة */}
      {editingApartment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">تعديل بيانات الشقة: {editingApartment.number}</h3>
              <button onClick={() => setEditingApartment(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">رقم الشقة</label>
                <input
                  type="text"
                  value={editingApartment.number}
                  onChange={(e) => setEditingApartment({...editingApartment, number: e.target.value})}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">اسم المالك</label>
                <input
                  type="text"
                  value={editingApartment.owner}
                  onChange={(e) => setEditingApartment({...editingApartment, owner: e.target.value})}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">هاتف المالك</label>
                <input
                  type="tel"
                  value={editingApartment.phone || ''}
                  onChange={(e) => setEditingApartment({...editingApartment, phone: e.target.value})}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingApartment(null)}
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