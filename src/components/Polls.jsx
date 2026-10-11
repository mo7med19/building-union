import React, { useState } from 'react';
import { Vote, CheckCircle2, PlusCircle } from 'lucide-react';

export default function Polls({ polls, handleVote, addPoll }) {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('موافق');
  const [opt2, setOpt2] = useState('غير موافق');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question) return;

    addPoll({
      id: Date.now(),
      question,
      options: [
        { id: 'a', text: opt1, votes: 0 },
        { id: 'b', text: opt2, votes: 0 },
      ],
      userVoted: null,
    });

    setQuestion('');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Vote className="w-5 h-5 text-amber-500" /> التصويت والقرارات
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" /> اقتراح جديد
        </button>
      </div>

      <div className="space-y-3">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

          return (
            <div key={poll.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">{poll.question}</h3>

              <div className="space-y-2">
                {poll.options.map((opt) => {
                  const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const isSelected = poll.userVoted === opt.id;

                  return (
                    <button
                      key={opt.id}
                      disabled={!!poll.userVoted}
                      onClick={() => handleVote(poll.id, opt.id)}
                      className={`w-full text-right p-3 rounded-xl border transition relative overflow-hidden flex justify-between items-center ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50/50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-800 z-10 flex items-center gap-2">
                        {opt.text}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 inline" />}
                      </span>
                      <span className="text-xs text-slate-500 font-mono z-10">{percentage}% ({opt.votes})</span>

                      <div 
                        className="absolute top-0 bottom-0 right-0 bg-amber-100/60 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة إضافة استطلاع جديد */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">طرح تصويت أو اقتراح جديد</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">موضوع التصويت / القرار</label>
                <textarea
                  placeholder="مثال: هل توافق على تركيب كاميرات مراقبة للمدخل؟"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">الخيار الأول</label>
                  <input
                    type="text"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">الخيار الثاني</label>
                  <input
                    type="text"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition"
                >
                  نشر التصويت
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition"
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