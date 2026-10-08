import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, Loader2, Award, Zap, Users } from 'lucide-react';
import { polishBullet } from '../api';

export default function BulletPolishModal({ isOpen, onClose, onApply, initialBullet, role, company, jobDescription }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [customBullet, setCustomBullet] = useState(initialBullet || '');

  const handleGenerate = async (textToPolish) => {
    setLoading(true);
    setError('');
    try {
      const data = await polishBullet(textToPolish || initialBullet, role, company, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error communicating with AI');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialBullet) {
      setCustomBullet(initialBullet);
      handleGenerate(initialBullet);
    } else {
      setResult(null);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialBullet]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#5CB338]/10 text-[#3f8325] border border-[#5CB338]/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Bullet Optimizer & Metrics</h3>
              <p className="text-xs text-slate-500">Transform tasks into quantified, high-impact career achievements</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
          {/* Input / Original View */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Bullet Point:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customBullet}
                onChange={(e) => setCustomBullet(e.target.value)}
                placeholder="Enter or refine your raw bullet..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]"
              />
              <button
                onClick={() => handleGenerate(customBullet)}
                disabled={loading || !customBullet.trim()}
                className="px-4 py-2 bg-[#5CB338] hover:bg-[#4ea02e] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Re-Polish
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Impact Breakdown Banner */}
          {result?.impactBreakdown && (
            <div className="p-3.5 bg-[#5CB338]/10 border border-[#5CB338]/20 rounded-xl text-xs text-slate-800 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#5CB338] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3f8325]">Accomplishment Breakdown: </span>
                {result.impactBreakdown}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#5CB338]" />
              <p className="text-sm font-medium">Generating high-impact variations & metrics...</p>
            </div>
          )}

          {/* Variations List */}
          {!loading && result?.variations && (
            <div className="space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Your High-Impact Variation:
              </div>

              {result.variations.map((v, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#5CB338] rounded-xl p-4 transition-all duration-200 flex flex-col gap-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {idx === 0 && <Zap className="w-3 h-3 text-amber-500" />}
                      {idx === 1 && <Sparkles className="w-3 h-3 text-[#5CB338]" />}
                      {idx === 2 && <Users className="w-3 h-3 text-emerald-600" />}
                      {v.style}
                    </span>

                    {v.highlightedMetrics && (
                      <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {v.highlightedMetrics}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-900 leading-relaxed font-sans font-medium">
                    {v.text}
                  </p>

                  {v.reasonWhyItWorks && (
                    <p className="text-xs text-slate-500 italic">
                      Why it works: {v.reasonWhyItWorks}
                    </p>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onApply(v.text);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Apply to Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
