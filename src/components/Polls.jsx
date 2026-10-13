import React, { useState } from 'react';
import { Vote, CheckCircle2, PlusCircle, Trash2 } from 'lucide-react';

export default function Polls({ polls = [], handleVote, addPoll, deletePoll, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['موافق', 'غير موافق']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      alert('يجب أن يحتوي التصويت على خيارين على الأقل');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt.trim())) return;

    addPoll({
      id: Date.now(),
      question,
      options: options.map((optText, index) => ({
        id: String.fromCharCode(97 + index), // 'a', 'b', 'c', ...
        text: optText,
        votes: 0
      })),
      userVoted: null,
    });

    setQuestion('');
    setOptions(['موافق', 'غير موافق']);
    setShowModal(false);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Vote className="w-5 h-5 text-amber-500" /> التصويت والقرارات
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">المشاركة في اتخاذ القرارات الخاصة باتحاد الملاك</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" /> اقتراح جديد
        </button>
      </div>

      <div className="space-y-3">
        {polls.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-400 text-xs border border-slate-200/80">
            لا توجد استطلاعات رأي أو قرارات مطروحة حالياً
          </div>
        ) : (
          polls.map((poll) => {
            const totalVotes = (poll.options || []).reduce((acc, curr) => acc + (curr.votes || 0), 0);

            return (
              <div key={poll.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative group">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-slate-900">{poll.question}</h3>
                  {isAdmin && deletePoll && (
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذا الاستطلاع؟')) {
                          deletePoll(poll.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                      title="حذف الاستطلاع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {(poll.options || []).map((opt) => {
                    const percentage = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
                    const isSelected = poll.userVoted === opt.id;

                    return (
                      <button
                        key={opt.id}
                        disabled={!!poll.userVoted}
                        onClick={() => handleVote(poll.id, opt.id)}
                        className={`w-full text-right p-3 rounded-xl border transition relative overflow-hidden flex justify-between items-center cursor-pointer ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50/50 shadow-xs' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-xs font-semibold text-slate-800 z-10 flex items-center gap-2">
                          {opt.text}
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 inline" />}
                        </span>
                        <span className="text-xs text-slate-500 font-mono z-10">{percentage}% ({opt.votes || 0})</span>

                        <div 
                          className="absolute top-0 bottom-0 right-0 bg-amber-100/60 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-400 pt-1 font-mono text-left">
                  إجمالي المشاركين: {totalVotes} صوت
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* نافذة إضافة استطلاع جديد */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">طرح تصويت أو اقتراح جديد</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">موضوع التصويت / القرار</label>
                <textarea
                  placeholder="مثال: هل توافق على تركيب كاميرات مراقبة للمدخل؟"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-600 font-medium">خيارات الإجابة</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-amber-600 hover:text-amber-700 font-bold text-[11px] cursor-pointer"
                  >
                    + إضافة خيار آخر
                  </button>
                </div>

                {options.map((opt, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`الخيار ${index + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-xl focus:outline-none focus:border-amber-500"
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  نشر التصويت
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition cursor-pointer font-medium"
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