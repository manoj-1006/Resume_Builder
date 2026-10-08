import React, { useState, useRef } from 'react';
import { Sparkles, Loader2, Bold } from 'lucide-react';
import { generateSummary } from '../../api';
import { toggleBoldInInput } from '../../utils/textFormatting';

export default function SummaryForm({ resume, onChange }) {
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const summaryTextareaRef = useRef(null);

  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const handleBoldSummary = () => {
    const el = summaryTextareaRef.current;
    const currentText = resume.professionalSummary || '';
    const selStart = el ? el.selectionStart : currentText.length;
    const selEnd = el ? el.selectionEnd : currentText.length;
    const { newText, newStart, newEnd } = toggleBoldInInput(currentText, selStart, selEnd);
    updateField('professionalSummary', newText);
    if (el) {
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(newStart, newEnd);
      }, 0);
    }
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const data = await generateSummary(resume, resume.targetRole, '');
      if (data?.summary) {
        updateField('professionalSummary', data.summary);
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-600">
          3-4 punchy sentences highlighting your core competencies and scale of impact.
        </span>
        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={generatingSummary}
          className="px-3.5 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          {generatingSummary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Generate with Gemini AI
        </button>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-t-xl border border-b-0 border-slate-300">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleBoldSummary}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-xs font-bold shadow-2xs transition hover:text-[#5CB338] cursor-pointer"
            title="Bold selected text (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Bold</span>
          </button>
        </div>
        <span className="text-[11px] text-slate-500">Select text & click Bold or press Ctrl+B</span>
      </div>

      <textarea
        ref={summaryTextareaRef}
        rows={6}
        value={resume.professionalSummary || ''}
        onChange={(e) => updateField('professionalSummary', e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            handleBoldSummary();
          }
        }}
        placeholder="Impact-focused engineer with 5+ years of experience architecting..."
        className="w-full bg-white border border-slate-300 rounded-b-xl !mt-0 p-3 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] leading-relaxed shadow-2xs font-sans"
      />
    </div>
  );
}
