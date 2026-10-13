import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  CreditCard,
  Upload,
  FileImage,
  X,
  Eye,
  Check,
  Clock,
  Printer,
  Download,
  Wrench,
  ChevronDown,
  Trash2
} from 'lucide-react';

export default function Finance({ apartments, togglePayment, isAdmin, currentUser, updateApartmentReceipt, updateApartmentExtraFees, addNotification }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // حالات إيصالات السداد والمعاينة
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeReceiptView, setActiveReceiptView] = useState(null);

  // حالات Modal إضافة بند صيانة إضافي (للأدمن مع خيار التوزيع أو التخصيص لشقة واحدة)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyTitle, setEmergencyTitle] = useState('مبلغ صيانة إضافي');
  const [emergencyCost, setEmergencyCost] = useState('');
  const [distributionType, setDistributionType] = useState('all'); // 'all' أو 'single'
  const [targetApartmentId, setTargetApartmentId] = useState('');

  const monthlyFee = 200; // اشتراك الصيانة الأساسي

  const myApartment = (apartments || []).find(
    (apt) => apt.number === currentUser?.apartment || apt.id === currentUser?.aptId || apt.owner === currentUser?.name
  );

  const filteredApartments = (apartments || []).filter((apt) => {
    const matchesSearch = 
      apt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.owner.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'paid') return matchesSearch && apt.paid;
    if (filterStatus === 'unpaid') return matchesSearch && !apt.paid;
    return matchesSearch;
  });

  const totalCount = (apartments || []).length;
  const paidCount = (apartments || []).filter(a => a.paid).length;
  const unpaidCount = totalCount - paidCount;

  // حساب حصة الشقة الواحدة في حال اختيار التوزيع على الكل
  const calculatedSharePerApartment = emergencyCost && totalCount > 0 && distributionType === 'all'
    ? Math.ceil(parseFloat(emergencyCost) / totalCount) 
    : 0;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitReceipt = () => {
    if (!previewImage || !myApartment) return;
    if (updateApartmentReceipt) {
      updateApartmentReceipt(myApartment.id, previewImage, 'pending_review');
    }
    alert('تم إرفاق إيصال السداد بنجاح وبانتظار اعتماد الإدارة');
    setShowReceiptModal(false);
    setPreviewImage(null);
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    if (!emergencyTitle || !emergencyCost) return;

    const costNum = parseFloat(emergencyCost);

    if (distributionType === 'all') {
      const share = calculatedSharePerApartment;
      
      if (addNotification) {
        addNotification(`🔧 مطالبة مالية: ${emergencyTitle} | المطلوب من كل شقة: ${share} ج.م`);
      }

      // تحديث كل شقة وحفظ البند في السحابة
      for (const apt of (apartments || [])) {
        const existingFees = apt.extraFees || [];
        const updatedFees = [...existingFees, { title: emergencyTitle, amount: share }];
        
        if (updateApartmentExtraFees) {
          await updateApartmentExtraFees(apt.id, updatedFees);
        }
      }

      alert(`تم تسجيل "${emergencyTitle}" وتوزيع مبلغ ${share} ج.م وحفظه سحابياً على كافة الشقق بنجاح.`);
    } else {
      if (!targetApartmentId) {
        alert('يرجى اختيار الشقة المراد تحميل المبلغ عليها.');
        return;
      }

      const targetApt = (apartments || []).find(a => a.id.toString() === targetApartmentId.toString());
      if (targetApt) {
        const existingFees = targetApt.extraFees || [];
        const updatedFees = [...existingFees, { title: emergencyTitle, amount: costNum }];

        if (updateApartmentExtraFees) {
          await updateApartmentExtraFees(targetApt.id, updatedFees);
        }

        if (addNotification) {
          addNotification(`🔧 مطالبة مالية لشقة (${targetApt.number}): ${emergencyTitle} بقيمة ${costNum} ج.م`);
        }

        alert(`تم إضافة المبلغ (${costNum} ج.م) وحفظه سحابياً على شقة رقم (${targetApt.number}) بنجاح.`);
      }
    }
    
    // إعادة تعيين الحقول
    setEmergencyTitle('مبلغ صيانة إضافي');
    setEmergencyCost('');
    setDistributionType('all');
    setTargetApartmentId('');
    setShowEmergencyModal(false);
  };

  // دالة حذف بند إضافي عن شقة معينة وحفظه سحابياً
  const handleRemoveExtraFee = async (apartmentId, feeIndex) => {
    if (!confirm('هل أنت متأكد من حذف هذا البند الإضافي عن الشقة؟')) return;

    const targetApt = (apartments || []).find(a => a.id.toString() === apartmentId.toString());
    if (targetApt && targetApt.extraFees) {
      const updatedFees = [...targetApt.extraFees];
      updatedFees.splice(feeIndex, 1);

      if (updateApartmentExtraFees) {
        await updateApartmentExtraFees(targetApt.id, updatedFees);
      }
      alert('تم حذف البند وحفظ التحديثات سحابياً بنجاح.');
    }
  };

  const handlePrintReceipt = () => {
    if (!activeReceiptView) return;
    const extraFees = activeReceiptView.extraFees || [];
    const extraTotal = extraFees.reduce((sum, item) => sum + item.amount, 0);
    const grandTotal = monthlyFee + extraTotal;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>إيصال سداد - ${activeReceiptView.number}</title>
        <style>
          body { font-family: Tahoma, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
          .receipt-card { border: 2px solid #cbd5e1; border-radius: 16px; padding: 24px; max-width: 650px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
          .header h1 { font-size: 20px; color: #0f172a; margin: 0 0 4px 0; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; background: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 20px; }
          .image-container { text-align: center; margin-top: 16px; }
          .image-container img { max-width: 100%; max-height: 250px; border-radius: 12px; border: 1px solid #e2e8f0; object-fit: contain; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="receipt-card">
          <div class="header">
            <h1>إتحاد ملاك البرج السكني</h1>
            <p>سند استلام اشتراك صيانة ومستحقات إضافية</p>
          </div>
          <div class="details-grid">
            <div><span>رقم الشقة:</span><strong>${activeReceiptView.number}</strong></div>
            <div><span>المالك:</span><strong>${activeReceiptView.owner}</strong></div>
            <div><span>إجمالي المستلم:</span><strong>${grandTotal} ج.م</strong></div>
            <div><span>التاريخ:</span><strong>${new Date().toLocaleDateString('ar-EG')}</strong></div>
          </div>
          ${activeReceiptView.receiptUrl ? `<div class="image-container"><img src="${activeReceiptView.receiptUrl}" /></div>` : ''}
          <div class="footer">
            <div>توقيع أمين الصندوق: ..........................</div>
            <div>ختم الإدارة: ..........................</div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); setTimeout(window.close, 500); };</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadReceipt = () => {
    if (!activeReceiptView?.receiptUrl) return;
    const link = document.createElement('a');
    link.href = activeReceiptView.receiptUrl;
    link.download = `إيصال_صيانة_${activeReceiptView.number}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. واجهة الساكن
  if (!isAdmin) {
    if (!myApartment) {
      return (
        <div className="space-y-5 text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm" dir="rtl">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد شقة مسجلة باسمك حالياً</h3>
          <p className="text-xs text-slate-500 mt-1">يرجى التواصل مع إدارة المبنى (الأدمن) لربط حسابك برقم شقتك في الدليل.</p>
        </div>
      );
    }

    const hasReceipt = myApartment?.receiptUrl;
    const isPending = myApartment?.status === 'pending_review';
    const extraFees = myApartment?.extraFees || [];
    const extraTotal = extraFees.reduce((sum, item) => sum + item.amount, 0);
    const totalDue = monthlyFee + extraTotal;

    return (
      <div className="space-y-5" dir="rtl">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" /> الاشتراكات والمطالبات المالية
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">تفاصيل المبالغ المستحقة على شقتك وسجل المدفوعات</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium block">تفاصيل الشقة</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{myApartment?.number}</h3>
              <p className="text-xs text-slate-600 mt-1">المالك: {myApartment?.owner}</p>
            </div>

            <div>
              {myApartment?.paid ? (
                <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                  <CheckCircle className="w-4 h-4" /> مسدد بالكامل
                </span>
              ) : isPending ? (
                <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-amber-200">
                  <Clock className="w-4 h-4" /> بانتظار اعتماد الإدارة
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-rose-200">
                  <XCircle className="w-4 h-4" /> مطلوب السداد
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">تفصيل المبالغ المطلوبة لهذا الشهر:</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-600">اشتراك الصيانة الشهري الأساسي</span>
                <span className="font-mono font-bold text-slate-900">{monthlyFee} ج.م</span>
              </div>
              {extraFees.map((fee, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 text-amber-800">
                  <span>{fee.title}</span>
                  <span className="font-mono font-bold">{fee.amount} ج.م</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-slate-900">
              <span>الإجمالي الكلي الواجب سداده:</span>
              <span className="text-base text-amber-600 font-mono">{totalDue} ج.م</span>
            </div>
          </div>

          {!myApartment?.paid && (
            <div className="flex justify-end">
              <button 
                onClick={() => setShowReceiptModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> {hasReceipt ? 'تحديث إيصال السداد' : 'إرفاق إيصال السداد'}
              </button>
            </div>
          )}
        </div>

        {showReceiptModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-sm text-slate-900">إرفاق إيصال سداد الاشتراكات</h3>
                <button onClick={() => setShowReceiptModal(false)}><X className="w-4 h-4 text-slate-400 cursor-pointer" /></button>
              </div>

              <div className="space-y-3">
                <p className="text-slate-500">قم برفع صورة إيصال التحويل أو الدفع النقدي بقيمة إجمالي المستحقات ({totalDue} ج.م).</p>
                <label className="border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50">
                  <FileImage className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="font-bold text-slate-800">اختر صورة الإيصال</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {previewImage && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36">
                    <img src={previewImage} alt="معاينة" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={submitReceipt} disabled={!previewImage} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer">إرسال للإدارة</button>
                  <button type="button" onClick={() => setShowReceiptModal(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition cursor-pointer">إلغاء</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. واجهة الأدمن
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" /> إدارة الاشتراكات ومبالغ الصيانة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">متابعة التحصيل، مراجعة الإيصالات، وتوزيع تفاصيل البنود الإضافية</p>
        </div>

        <button
          onClick={() => setShowEmergencyModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Wrench className="w-4 h-4" /> إضافة مبلغ صيانة
        </button>
      </div>

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

      <div className="flex gap-2">
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">جميع الشقق</option>
          <option value="paid">المسددة فقط</option>
          <option value="unpaid">غير المسددة</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {filteredApartments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">لا توجد نتائج مطابقة</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApartments.map((apt) => {
              const extraFees = apt.extraFees || [];
              const extraTotal = extraFees.reduce((sum, item) => sum + item.amount, 0);
              const totalAptDue = monthlyFee + extraTotal;

              return (
                <div key={apt.id} className="p-3.5 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-50 transition gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{apt.number} - {apt.owner}</span>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 font-mono">
                        المطلوب: {totalAptDue} ج.م
                      </span>
                    </div>

                    <details className="text-[11px] text-slate-600 group">
                      <summary className="cursor-pointer font-medium text-slate-700 hover:text-amber-600 flex items-center gap-1 select-none">
                        <span>عرض تفاصيل المبالغ المستحقة ({1 + extraFees.length} بند)</span>
                        <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>• اشتراك صيانة أساسي</span>
                          <span>{monthlyFee} ج.م</span>
                        </div>
                        {extraFees.map((fee, idx) => (
                          <div key={idx} className="flex justify-between items-center text-amber-800 py-0.5 border-t border-slate-200/40">
                            <span>• {fee.title}: <strong>{fee.amount} ج.م</strong></span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveExtraFee(apt.id, idx);
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded transition cursor-pointer"
                                title="حذف هذا البند"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {apt.receiptUrl ? (
                      <button
                        onClick={() => setActiveReceiptView(apt)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-blue-200 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> معاينة الإيصال
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 px-2 py-1">لا يوجد إيصال</span>
                    )}

                    {apt.paid ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> مسدد
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> غير مسدد
                      </span>
                    )}

                    <button 
                      onClick={() => togglePayment(apt.id)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition font-medium cursor-pointer"
                    >
                      {apt.paid ? 'إلغاء السداد' : 'اعتماد السداد'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 text-amber-600">
                <Wrench className="w-4 h-4" /> إضافة مبلغ صيانة وتحديد طريقة التوزيع
              </h3>
              <button onClick={() => setShowEmergencyModal(false)}><X className="w-4 h-4 text-slate-400 cursor-pointer" /></button>
            </div>

            <form onSubmit={handleEmergencySubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">عنوان البند أو الصيانة</label>
                <input
                  type="text"
                  value={emergencyTitle}
                  onChange={(e) => setEmergencyTitle(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">المبلغ المطلوب (ج.م)</label>
                <input
                  type="number"
                  placeholder="مثال: 1200"
                  value={emergencyCost}
                  onChange={(e) => setEmergencyCost(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">طريقة تطبيق المبلغ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistributionType('all')}
                    className={`py-2 px-3 rounded-xl font-bold border transition cursor-pointer ${
                      distributionType === 'all'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    توزيع على كل الشقق
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistributionType('single')}
                    className={`py-2 px-3 rounded-xl font-bold border transition cursor-pointer ${
                      distributionType === 'single'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    تخصيص لشقة واحدة
                  </button>
                </div>
              </div>

              {distributionType === 'single' && (
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">اختر الشقة المستهدفة</label>
                  <select
                    value={targetApartmentId}
                    onChange={(e) => setTargetApartmentId(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
                    required
                  >
                    <option value="">-- اختر رقم الشقة والمالك --</option>
                    {(apartments || []).map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        شقة رقم {apt.number} ({apt.owner})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {emergencyCost && distributionType === 'all' && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center space-y-1">
                  <span className="text-[11px] text-amber-800 block">عدد شقق البرج: <b>{totalCount} شقق</b></span>
                  <span className="text-xs text-slate-700 block">المبلغ المضاف على كل شقة:</span>
                  <span className="text-lg font-black text-amber-600 font-mono">
                    {calculatedSharePerApartment} ج.م
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  حفظ وتطبيق المبلغ
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeReceiptView && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 text-xs" dir="rtl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">إيصال سداد شقة {activeReceiptView.number}</h3>
                <span className="text-slate-500">المالك: {activeReceiptView.owner}</span>
              </div>
              <button onClick={() => setActiveReceiptView(null)}><X className="w-4 h-4 text-slate-400 cursor-pointer" /></button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-96 flex items-center justify-center p-2">
              <img src={activeReceiptView.receiptUrl} alt="إيصال السداد" className="max-h-80 object-contain w-full" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button type="button" onClick={handleDownloadReceipt} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"><Download className="w-3.5 h-3.5" /> تنزيل</button>
              <button type="button" onClick={handlePrintReceipt} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 px-3 rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"><Printer className="w-3.5 h-3.5" /> طباعة سند</button>
              <button type="button" onClick={() => { togglePayment(activeReceiptView.id); setActiveReceiptView(null); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"><Check className="w-3.5 h-3.5" /> اعتماد السداد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}