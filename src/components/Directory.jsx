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
  Users 
} from 'lucide-react';

export default function Directory({ apartments = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // الأرقام الهامة والطارئة للمبنى
  const emergencyContacts = [
    { name: 'حارس العمارة', phone: '01000000001', icon: UserCheck, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'طوارئ المصعد', phone: '01000000002', icon: Wrench, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'طوارئ الكهرباء', phone: '01000000003', icon: Zap, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  // تصفية السكان حسب البحث
  const filteredApartments = apartments.filter((apt) => {
    const search = searchTerm.toLowerCase();
    return (
      apt.number.toLowerCase().includes(search) ||
      apt.owner.toLowerCase().includes(search) ||
      (apt.phone && apt.phone.includes(search))
    );
  });

  // نسخ الرقم للحافظة
  const copyToClipboard = (phone, id) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* 1. الهيدر العام */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" /> دليل التواصل والسكان
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">أرقام التواصل مع الجيران وطوارئ المبنى</p>
      </div>

      {/* 2. قسم أرقام الطوارئ السريعة */}
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
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {apt.role || 'ساكن'}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-700 mt-1">{apt.owner}</h3>
                  </div>

                  {/* رقم الهاتف وزر النسخ */}
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

                {/* أزرار الاتصال المباشر والواتساب */}
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
    </div>
  );
}