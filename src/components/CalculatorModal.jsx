import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CalculatorModal({ onClose }) {
  const [squareMeterRate, setSquareMeterRate] = useState(2);
  const [calcArea, setCalcArea] = useState(120);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-sm text-slate-900">حاسبة قيمة الاشتراك بالمساحة</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">مساحة الشقة (متر مربع)</label>
            <input
              type="number"
              value={calcArea}
              onChange={(e) => setCalcArea(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">سعر المتر المعتمد (ج.م)</label>
            <input
              type="number"
              value={squareMeterRate}
              onChange={(e) => setSquareMeterRate(e.target.value)}
              className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
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
  );
}