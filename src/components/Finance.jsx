import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  PlusCircle, 
  CreditCard,
  Upload,
  FileImage,
  X,
  Eye,
  Check,
  Clock,
  Printer,
  Download
} from 'lucide-react';

export default function Finance({ apartments, togglePayment, addApartment, isAdmin, currentUser, updateApartmentReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newNumber, setNewNumber] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // حالات خاصة بنوع السكن (ملكية أو إيجار)
  const [isRental, setIsRental] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');

  // حالات خاصة بإرفاق ومعاينة الإيصال
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeReceiptView, setActiveReceiptView] = useState(null);

  // إذا كان المستخدم ساكناً، نحدد شقته فقط
  const myApartment = apartments.find(
    (apt) => apt.number === currentUser?.apartment || apt.id === currentUser?.aptId
  ) || apartments[0];

  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch = 
      apt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.tenantName && apt.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));

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
        occupancyType: isRental ? 'إيجار' : 'ملكية خاصة',
        tenantName: isRental ? newTenantName : '',
        tenantPhone: isRental ? newTenantPhone : '',
        paid: false,
        receiptUrl: null,
        status: 'unpaid'
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

  // رفع الإيصال (للساكن)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReceipt = () => {
    if (!previewImage) return;
    
    if (updateApartmentReceipt) {
      updateApartmentReceipt(myApartment.id, previewImage, 'pending_review');
    } else {
      myApartment.receiptUrl = previewImage;
      myApartment.status = 'pending_review';
    }

    alert('تم إرفاق الإيصال بنجاح وبانتظار اعتماد الإدارة');
    setShowReceiptModal(false);
    setPreviewImage(null);
  };

  // دالة الطباعة المنسقة كسند رسمي مستقل
  const handlePrintReceipt = () => {
    if (!activeReceiptView) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>إيصال سداد - ${activeReceiptView.number}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 30px;
            color: #1e293b;
            background: #fff;
          }
          .receipt-card {
            border: 2px solid #cbd5e1;
            border-radius: 16px;
            padding: 24px;
            max-width: 650px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #e2e8f0;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 20px;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .header p {
            font-size: 12px;
            color: #64748b;
            margin: 0;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            font-size: 13px;
            background: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 20px;
          }
          .details-item span {
            display: block;
            color: #64748b;
            font-size: 11px;
          }
          .details-item strong {
            color: #0f172a;
            font-size: 14px;
          }
          .image-container {
            text-align: center;
            margin-top: 16px;
          }
          .image-container img {
            max-width: 100%;
            max-height: 350px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            object-fit: contain;
          }
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #475569;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          }
          @media print {
            body { padding: 0; }
            .receipt-card { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-card">
          <div class="header">
            <h1>إتحاد ملاك البرج السكني</h1>
            <p>سند استلام واستحقاق اشتراك صيانة</p>
          </div>

          <div class="details-grid">
            <div class="details-item">
              <span>رقم الشقة:</span>
              <strong>${activeReceiptView.number}</strong>
            </div>
            <div class="details-item">
              <span>المالك / المنتفع:</span>
              <strong>${activeReceiptView.owner} ${activeReceiptView.tenantName ? `(المستأجر: ${activeReceiptView.tenantName})` : ''}</strong>
            </div>
            <div class="details-item">
              <span>المبلغ المستلم:</span>
              <strong>200 ج.م</strong>
            </div>
            <div class="details-item">
              <span>تاريخ الطباعة:</span>
              <strong>${new Date().toLocaleDateString('ar-EG')}</strong>
            </div>
          </div>

          <div class="image-container">
            <p style="text-align: right; font-size: 12px; color: #64748b; margin-bottom: 8px;">صورة إيصال التحويل المرفق:</p>
            <img src="${activeReceiptView.receiptUrl}" alt="إيصال التحويل" />
          </div>

          <div class="footer">
            <div>توقيع رئيس الاتحاد: ..........................</div>
            <div>توقيع أمين الصندوق: ..........................</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // دالة تنزيل الإيصال مباشرة كصورة
  const handleDownloadReceipt = () => {
    if (!activeReceiptView?.receiptUrl) return;
    
    const link = document.createElement('a');
    link.href = activeReceiptView.receiptUrl;
    link.download = `إيصال_${activeReceiptView.number}_${activeReceiptView.owner}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // 1. واجهة الساكن العادي
  // -------------------------------------------------------------
  if (!isAdmin) {
    const hasReceipt = myApartment?.receiptUrl;
    const isPending = myApartment?.status === 'pending_review';

    return (
      <div className="space-y-5" dir="rtl">
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
              <p className="text-xs text-slate-600">
                {myApartment?.occupancyType === 'إيجار' ? `مستأجر: ${myApartment?.tenantName} (مالك: ${myApartment?.owner})` : myApartment?.owner}
              </p>
            </div>

            <div>
              {myApartment?.paid ? (
                <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                  <CheckCircle className="w-4 h-4" /> مسدد لهذا الشهر
                </span>
              ) : isPending ? (
                <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-amber-200">
                  <Clock className="w-4 h-4" /> تم إرفاق الإيصال (بانتظار الاعتماد)
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
                onClick={() => setShowReceiptModal(true)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-4 h-4" /> {hasReceipt ? 'تحديث الإيصال' : 'إرفاق إيصال التحويل'}
              </button>
            )}
          </div>
        </div>

        {/* Modal إرفاق إيصال السداد للساكن */}
        {showReceiptModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-sm text-slate-900">إرفاق صورة إيصال التحويل أو الدفع</h3>
                <button onClick={() => setShowReceiptModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <div className="space-y-3">
                <p className="text-slate-500">يرجى رفع صورة واضحة لإيصال التحويل البنكي أو إيصال الدفع النقدي ليتم مراجعتها واعتمادها من الإدارة.</p>

                <label className="border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50">
                  <FileImage className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="font-bold text-slate-800">انقر لاختيار صورة الإيصال</span>
                  <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {previewImage && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36">
                    <img src={previewImage} alt="معاينة الإيصال" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={submitReceipt}
                    disabled={!previewImage}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl transition disabled:opacity-50"
                  >
                    إرسال للإدارة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. واجهة الأدمن
  // -------------------------------------------------------------
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" /> إدارة اشتراكات الشقق والتحقّق من الإيصالات
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">معاينة إيصالات السكان واعتماد عمليات الدفع وطباعتها</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
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

      {/* شريط البحث */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        <input
          type="text"
          placeholder="ابحث برقم الشقة، اسم المالك أو المستأجر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200/80 pr-9 pl-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* قائمة الشقق للأدمن */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {filteredApartments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">لا توجد نتائج مطابقة</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApartments.map((apt) => (
              <div key={apt.id} className="p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm block text-slate-900">{apt.number} - {apt.owner}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${apt.occupancyType === 'إيجار' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700'}`}>
                      {apt.occupancyType || 'ملكية خاصة'}
                    </span>
                  </div>
                  
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {apt.occupancyType === 'إيجار' && apt.tenantName ? (
                      <>المستأجر: <b className="text-slate-700">{apt.tenantName}</b> ({apt.tenantPhone}) | </>
                    ) : null}
                    هاتف المالك: {apt.phone}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {apt.receiptUrl ? (
                    <button
                      onClick={() => setActiveReceiptView(apt)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-blue-200 transition animate-pulse"
                    >
                      <Eye className="w-3.5 h-3.5" /> معاينة الإيصال المرفوع
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 px-2 py-1">لا يوجد إيصال مرفوع</span>
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
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition font-medium"
                  >
                    {apt.paid ? 'إلغاء السداد' : 'اعتماد السداد'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal معاينة وطباعة الإيصال للأدمن */}
      {activeReceiptView && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 text-xs" dir="rtl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">إيصال التحويل الخاص بـ {activeReceiptView.number}</h3>
                <span className="text-slate-500">المالك: {activeReceiptView.owner} {activeReceiptView.tenantName ? `| المستأجر: ${activeReceiptView.tenantName}` : ''}</span>
              </div>
              <button onClick={() => setActiveReceiptView(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-96 flex items-center justify-center p-2">
              <img src={activeReceiptView.receiptUrl} alt="إيصال السداد" className="max-h-80 object-contain w-full" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> تنزيل
              </button>

              <button
                type="button"
                onClick={handlePrintReceipt}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                <Printer className="w-3.5 h-3.5" /> طباعة سند رسمي
              </button>

              <button
                type="button"
                onClick={() => {
                  togglePayment(activeReceiptView.id);
                  setActiveReceiptView(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                <Check className="w-3.5 h-3.5" /> اعتماد السداد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal إضافة شقة مع خيار المالك أو الإيجار */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
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
                <label className="block text-slate-700 mb-1 font-bold">نوع إشغال الشقة</label>
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
                    <span>شقة مؤجرة (مستأجر)</span>
                  </label>
                </div>
              </div>

              {isRental && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 block">بيانات المستأجر المنتفع</span>
                  <div>
                    <label className="block text-slate-600 mb-1">اسم المستأجر الثلاثي</label>
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
    </div>
  );
}