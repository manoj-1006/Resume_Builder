import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  BookOpen, Trophy, Award, Layers, Plus, Trash2, 
  Sparkles, ChevronDown, Check 
} from 'lucide-react';
import { generateId } from '../../utils/id';
import { toggleBoldInInput } from '../../utils/textFormatting';

function EditableCombobox({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setIsOpen(false);
            }
          }}
          placeholder={placeholder || 'Select or type section...'}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-2.5 pr-8 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white font-medium shadow-2xs"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-1 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          title="Toggle dropdown options"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#5CB338]' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-30 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs">
          <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Suggested Options (or type your own)
          </div>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 hover:bg-[#5CB338]/10 hover:text-[#3f8325] transition flex items-center justify-between text-xs cursor-pointer ${
                value === opt ? 'bg-[#5CB338]/10 text-[#3f8325] font-semibold' : 'text-slate-700'
              }`}
            >
              <span>{opt}</span>
              {value === opt && <Check className="w-3.5 h-3.5 text-[#5CB338]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OthersForm({ resume, onChange, isCompact, onTriggerPolish }) {
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

  const addOtherSection = (categoryName = 'Publications') => {
    const list = [...(resume.others || [])];
    list.push({
      id: generateId(),
      category: categoryName,
      title: '',
      organization: '',
      date: '',
      description: ''
    });
    updateField('others', list);
  };

  const addOtherItemToCategory = (categoryName) => {
    const list = [...(resume.others || [])];
    list.push({
      id: generateId(),
      category: categoryName,
      title: '',
      organization: '',
      date: '',
      description: ''
    });
    updateField('others', list);
  };

  const updateOtherCategoryName = (oldCategoryName, newCategoryName) => {
    if (!newCategoryName.trim()) return;
    const oldNorm = (oldCategoryName || '').trim().toLowerCase();
    const list = (resume.others || []).map((item) => {
      if ((item.category || '').trim().toLowerCase() === oldNorm) {
        return { ...item, category: newCategoryName };
      }
      return item;
    });
    updateField('others', list);
  };

  const removeOtherCategoryGroup = (categoryName) => {
    const targetNorm = (categoryName || '').trim().toLowerCase();
    const list = (resume.others || []).filter(
      (item) => (item.category || '').trim().toLowerCase() !== targetNorm
    );
    updateField('others', list);
  };

  const updateOther = (index, field, value) => {
    const list = [...(resume.others || [])];
    list[index] = { ...list[index], [field]: value };
    updateField('others', list);
  };

  const removeOther = (index) => {
    const list = (resume.others || []).filter((_, i) => i !== index);
    updateField('others', list);
  };

  // Memoized grouping of "Others" by category for cohesive section UI
  const groupedOthers = useMemo(() => {
    const map = new Map();
    (resume.others || []).forEach((item, originalIndex) => {
      const rawCat = (item.category || 'Awards & Honors').trim();
      const normKey = rawCat.toLowerCase();
      if (!map.has(normKey)) {
        map.set(normKey, {
          normKey,
          categoryName: rawCat,
          items: []
        });
      }
      map.get(normKey).items.push({ ...item, originalIndex });
    });
    return Array.from(map.values());
  }, [resume.others]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className={`flex items-center justify-between gap-3 ${isCompact ? 'flex-col sm:flex-row items-start sm:items-center' : ''}`}>
        <div>
          <span className="text-xs text-slate-600 block">
            Custom sections (Publications, Awards & Honors, Volunteering, Hackathons, Patents, etc.)
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => addOtherSection('Publications')}
            className="px-2.5 py-1.5 bg-[#5CB338]/10 hover:bg-[#5CB338]/20 text-[#3f8325] border border-[#5CB338]/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Add Publications section"
          >
            <BookOpen className="w-3.5 h-3.5" />
            + Publications
          </button>
          <button
            type="button"
            onClick={() => addOtherSection('Awards & Honors')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Add Awards section"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            + Awards
          </button>
          <button
            type="button"
            onClick={() => addOtherSection('Leadership & Volunteering')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Add Volunteering section"
          >
            <Award className="w-3.5 h-3.5 text-blue-500" />
            + Volunteering
          </button>
          <button
            type="button"
            onClick={() => addOtherSection('Key Achievements')}
            className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Section
          </button>
        </div>
      </div>

      {groupedOthers.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
          <p className="text-slate-500 text-xs">
            No custom sections added yet. Select a section type below to add entries to your resume:
          </p>
          <div className="flex justify-center gap-2 flex-wrap pt-2">
            <button
              type="button"
              onClick={() => addOtherSection('Publications')}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 transition shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#5CB338]" />
              Publications & Research
            </button>
            <button
              type="button"
              onClick={() => addOtherSection('Awards & Honors')}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 transition shadow-2xs cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Awards & Honors
            </button>
            <button
              type="button"
              onClick={() => addOtherSection('Leadership & Volunteering')}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 transition shadow-2xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-blue-500" />
              Leadership & Volunteering
            </button>
            <button
              type="button"
              onClick={() => addOtherSection('Custom Section')}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 transition shadow-2xs cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              Custom Section
            </button>
          </div>
        </div>
      ) : (
        groupedOthers.map((group, gIdx) => {
          const isPub = group.categoryName.toLowerCase().includes('pub');
          const isAward = group.categoryName.toLowerCase().includes('award') || group.categoryName.toLowerCase().includes('honor');

          return (
            <div key={group.normKey || gIdx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 relative shadow-2xs">
              {/* Section Container Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                    {isPub ? <BookOpen className="w-4 h-4 text-[#5CB338]" /> : (isAward ? <Trophy className="w-4 h-4 text-amber-500" /> : <Layers className="w-4 h-4 text-slate-600" />)}
                  </div>
                  <div className="flex-1">
                    <EditableCombobox
                      value={group.categoryName}
                      onChange={(newVal) => updateOtherCategoryName(group.categoryName, newVal)}
                      placeholder="Section Heading (e.g. Publications)"
                      options={[
                        'Publications',
                        'Publications & Research',
                        'Awards & Honors',
                        'Key Achievements',
                        'Leadership & Volunteering',
                        'Extracurricular Activities',
                        'Patents',
                        'Hackathons & Competitions',
                        'Languages',
                        'Speaking & Workshops'
                      ]}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded-md shrink-0">
                    {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => addOtherItemToCategory(group.categoryName)}
                    className="px-2.5 py-1 bg-[#5CB338]/10 hover:bg-[#5CB338]/20 text-[#3f8325] border border-[#5CB338]/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title={`Add another item to ${group.categoryName}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add {isPub ? 'Publication' : (isAward ? 'Award' : 'Entry')}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeOtherCategoryGroup(group.categoryName)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete this entire section and its entries"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items inside this Category Section */}
              <div className="space-y-3">
                {group.items.map((item, itemIdx) => {
                  const origIdx = item.originalIndex;

                  return (
                    <div key={item.id || itemIdx} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => removeOther(origIdx)}
                        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete this entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className={isCompact ? 'grid grid-cols-1 gap-2 pr-7' : 'grid grid-cols-1 sm:grid-cols-3 gap-2.5 pr-7'}>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                            {isPub ? 'Publication / Paper Title' : (isAward ? 'Award / Honor Title' : 'Title / Role')}
                          </label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => updateOther(origIdx, 'title', e.target.value)}
                            placeholder={isPub ? 'e.g. Deep Residual Learning for Image Recognition' : 'e.g. 1st Place Hackathon Winner'}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Date / Year</label>
                          <input
                            type="text"
                            value={item.date || ''}
                            onChange={(e) => updateOther(origIdx, 'date', e.target.value)}
                            placeholder="e.g. Nov 2024"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                            {isPub ? 'Journal / Conference / Publisher / DOI' : 'Organization / Event / Host'}
                          </label>
                          <input
                            type="text"
                            value={item.organization || ''}
                            onChange={(e) => updateOther(origIdx, 'organization', e.target.value)}
                            placeholder={isPub ? 'e.g. IEEE Conference on Computer Vision and Pattern Recognition (CVPR)' : 'e.g. Google Developer Student Club'}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="block text-[10px] font-semibold text-slate-600">
                              {isPub ? 'Abstract / Description / DOI / Key Impact' : 'Description / Scope / Key Impact'}
                            </label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onTriggerPolish && onTriggerPolish('other', origIdx, 0, item.description, item.title, item.organization)}
                                className="text-[10px] text-[#3f8325] hover:text-[#2d6219] flex items-center gap-0.5 font-bold cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-[#5CB338]" /> Polish
                              </button>
                            </div>
                          </div>
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => updateOther(origIdx, 'description', e.target.value)}
                            onKeyDown={(e) => {
                              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                                e.preventDefault();
                                handleBoldBullet(e.target, item.description || '', (newText) => updateOther(origIdx, 'description', newText));
                              }
                            }}
                            placeholder={isPub ? 'Brief summary of findings, citation metrics, or paper significance (Ctrl+B to bold)...' : 'Describe the achievement, competition scope, or leadership impact (Ctrl+B to bold)...'}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
