import React from 'react';
import { Plus, Trash2, Bold, Sparkles } from 'lucide-react';
import { generateId } from '../../utils/id';
import { toggleBoldInInput } from '../../utils/textFormatting';

export default function ExperienceForm({ resume, onChange, isCompact, onTriggerPolish }) {
  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const handleBoldBullet = (inputEl, currentValue = '', onUpdate) => {
    const selStart = inputEl ? inputEl.selectionStart : currentValue.length;
    const selEnd = inputEl ? inputEl.selectionEnd : currentValue.length;
    const { newText, newStart, newEnd } = toggleBoldInInput(currentValue, selStart, selEnd);
    onUpdate(newText);
    if (inputEl) {
      setTimeout(() => {
        inputEl.focus();
        inputEl.setSelectionRange(newStart, newEnd);
      }, 0);
    }
  };

  const addExperience = () => {
    const list = [...(resume.experiences || [])];
    list.unshift({
      id: generateId(),
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: ['']
    });
    updateField('experiences', list);
  };

  const updateExperience = (index, field, value) => {
    const list = [...(resume.experiences || [])];
    list[index] = { ...list[index], [field]: value };
    updateField('experiences', list);
  };

  const removeExperience = (index) => {
    const list = (resume.experiences || []).filter((_, i) => i !== index);
    updateField('experiences', list);
  };

  const addExperienceBullet = (expIndex) => {
    const list = [...(resume.experiences || [])];
    list[expIndex].bullets = [...(list[expIndex].bullets || []), ''];
    updateField('experiences', list);
  };

  const updateExperienceBullet = (expIndex, bIndex, value) => {
    const list = [...(resume.experiences || [])];
    list[expIndex].bullets[bIndex] = value;
    updateField('experiences', list);
  };

  const removeExperienceBullet = (expIndex, bIndex) => {
    const list = [...(resume.experiences || [])];
    list[expIndex].bullets = list[expIndex].bullets.filter((_, i) => i !== bIndex);
    updateField('experiences', list);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">
          Add work history. Click the <span className="text-[#3f8325] font-bold">✨ Polish</span> button on any bullet to generate quantified metrics and high-impact phrasing!
        </span>
        <button
          type="button"
          onClick={addExperience}
          className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position
        </button>
      </div>

      {(resume.experiences || []).map((exp, expIdx) => (
        <div key={exp.id || expIdx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 relative group shadow-2xs">
          <button
            type="button"
            onClick={() => removeExperience(expIdx)}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            title="Remove experience"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className={isCompact ? 'grid grid-cols-1 gap-2.5 pr-8' : 'grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8'}>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Job Title / Role</label>
              <input
                type="text"
                value={exp.role || ''}
                onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                placeholder="Senior Software Engineer"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                placeholder="Stripe, Google, TechCorp"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateExperience(expIdx, 'location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate || ''}
                  onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                  placeholder="Jan 2022"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="text"
                  disabled={exp.isCurrent}
                  value={exp.isCurrent ? 'Present' : (exp.endDate || '')}
                  onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                  placeholder="Present"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Bullet Points */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Accomplishment Bullets</span>
              <button
                type="button"
                onClick={() => addExperienceBullet(expIdx)}
                className="text-[11px] text-[#5CB338] hover:text-[#4ea02e] flex items-center gap-1 font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Bullet
              </button>
            </div>

            {(exp.bullets || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-center gap-1.5 group/bullet">
                <span className="text-slate-400 text-sm font-bold">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                      e.preventDefault();
                      handleBoldBullet(e.target, bullet, (newText) => updateExperienceBullet(expIdx, bIdx, newText));
                    }
                  }}
                  placeholder="Spearheaded architecture of..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const inputEl = e.currentTarget.parentElement.querySelector('input');
                    handleBoldBullet(inputEl, bullet, (newText) => updateExperienceBullet(expIdx, bIdx, newText));
                  }}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#5CB338] rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0 border border-slate-200 cursor-pointer"
                  title="Bold selected text (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerPolish && onTriggerPolish('experience', expIdx, bIdx, bullet, exp.role, exp.company)}
                  className="px-2.5 py-1.5 bg-[#5CB338]/10 hover:bg-[#5CB338]/20 text-[#3f8325] border border-[#5CB338]/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0 cursor-pointer"
                  title="Generate high-impact metrics and polish"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5CB338]" />
                  <span className="hidden sm:inline">Polish</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeExperienceBullet(expIdx, bIdx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Remove bullet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
