import React from 'react';
import { BookOpen, ShieldCheck, Car, Volume2, Trash2, Clock } from 'lucide-react';

export default function Guidelines() {
  const rules = [
    {
      icon: Clock,
      title: 'مواعيد سداد الاشتراكات',
      desc: 'يرجى الالتزام بسداد اشتراك الصيانة قبل يوم 10 من كل شهر لضمان استمرار أعمال النظافة وصيانة المصعد.'
    },
    {
      icon: Car,
      title: 'تنظيم الجراج والسيارات',
      desc: 'الالتزام بالأماكن المخصصة لكل شقة، ومنع ركن السيارات أمام مخرج المدخل الرئيسي منعاً للمساءلة.'
    },
    {
      icon: Volume2,
      title: 'الهدوء ومراعاة الجيران',
      desc: 'يرجى الحد من الأصوات المرتفعة وأعمال الصيانة المزعجة بعد الساعة 10 مساءً وفي أيام العطلات.'
    },
    {
      icon: Trash2,
      title: 'إلقاء القمامة والنظافة العامة',
      desc: 'وضع القمامة في الأكياس المغلقة بالأماكن المخصصة لها، وإلقاؤها في المواعيد المحددة لجمع النظافة.'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" /> اللائحة الداخلية وقواعد البرج
        </h2>
        <p className="text-xs text-slate-500">التعليمات الواجب اتباعها لضمان راحة وسلامة الجميع</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/50">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{rule.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pr-9">{rule.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}