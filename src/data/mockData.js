export const initialApartments = [
  { id: 1, number: 'شقة 101', owner: 'أحمد محمد', paid: true, phone: '01012345678' },
  { id: 2, number: 'شقة 102', owner: 'محمود حسن', paid: false, phone: '01112345678' },
  { id: 3, number: 'شقة 201', owner: 'خالد إبراهيم', paid: true, phone: '01212345678' },
  { id: 4, number: 'شقة 202', owner: 'سامي علي', paid: false, phone: '01098765432' },
];

export const initialExpenses = [
  { id: 1, title: 'صيانة المصعد الدوري', amount: 300, category: 'صيانة', date: '2026-10-01' },
  { id: 2, title: 'إضاءة السلم والكهرباء', amount: 150, category: 'كهرباء ومياه', date: '2026-10-05' }
];

export const initialPolls = [
  {
    id: 1,
    question: 'هل توافق على تركيب كاميرات مراقبة جديدة لمدخل العمارة؟',
    options: [
      { id: 'a', text: 'موافق (التكلفة 150 ج/شقة)', votes: 8 },
      { id: 'b', text: 'غير موافق', votes: 2 },
    ],
    userVoted: null,
  }
];