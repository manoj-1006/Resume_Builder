import React from 'react';
import { Plus, Trash2, Bold, Sparkles } from 'lucide-react';
import { generateId } from '../../utils/id';
import { toggleBoldInInput } from '../../utils/textFormatting';

export default function ProjectsForm({ resume, onChange, isCompact, onTriggerPolish }) {
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

  const addProject = () => {
    const list = [...(resume.projects || [])];
    list.push({
      id: generateId(),
      title: '',
      role: '',
      techStack: '',
      link: '',
      bullets: ['']
    });
    updateField('projects', list);
  };

  const updateProject = (index, field, value) => {
    const list = [...(resume.projects || [])];
    list[index] = { ...list[index], [field]: value };
    updateField('projects', list);
  };

  const removeProject = (index) => {
    const list = (resume.projects || []).filter((_, i) => i !== index);
    updateField('projects', list);
  };

  const addProjectBullet = (pIdx) => {
    const list = [...(resume.projects || [])];
    list[pIdx].bullets = [...(list[pIdx].bullets || []), ''];
    updateField('projects', list);
  };

  const updateProjectBullet = (pIdx, bIdx, text) => {
    const list = [...(resume.projects || [])];
    const bullets = [...(list[pIdx].bullets || [])];
    bullets[bIdx] = text;
    list[pIdx].bullets = bullets;
    updateField('projects', list);
  };

  const removeProjectBullet = (pIdx, bIdx) => {
    const list = [...(resume.projects || [])];
    list[pIdx].bullets = (list[pIdx].bullets || []).filter((_, i) => i !== bIdx);
    updateField('projects', list);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">Side projects, open-source work, and key accomplishments.</span>
        <button
          type="button"
          onClick={addProject}
          className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {(resume.projects || []).map((proj, pIdx) => (
        <div key={proj.id || pIdx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-2xs">
          <button
            type="button"
            onClick={() => removeProject(pIdx)}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
            title="Remove project"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className={isCompact ? 'grid grid-cols-1 gap-2.5 pr-8' : 'grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8'}>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                value={proj.title || ''}
                onChange={(e) => updateProject(pIdx, 'title', e.target.value)}
                placeholder="Distributed KV Store"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tech Stack</label>
              <input
                type="text"
                value={proj.techStack || ''}
                onChange={(e) => updateProject(pIdx, 'techStack', e.target.value)}
                placeholder="C#, .NET, Docker, Raft"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Link / GitHub URL</label>
              <input
                type="text"
                value={proj.link || ''}
                onChange={(e) => updateProject(pIdx, 'link', e.target.value)}
                placeholder="github.com/username/project"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
              />
            </div>
          </div>

          {/* Project Bullets */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Key Accomplishments & Bullets
              </span>
              <button
                type="button"
                onClick={() => addProjectBullet(pIdx)}
                className="text-[11px] text-[#5CB338] hover:text-[#4ea02e] flex items-center gap-1 font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Bullet
              </button>
            </div>

            {(!proj.bullets || proj.bullets.length === 0) ? (
              <button
                type="button"
                onClick={() => addProjectBullet(pIdx)}
                className="w-full py-2 border border-dashed border-slate-300 hover:border-[#5CB338] rounded-lg text-xs text-slate-500 hover:text-[#5CB338] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add bullet point describing project impact...
              </button>
            ) : (
              (proj.bullets || []).map((b, bIdx) => (
                <div key={bIdx} className="flex items-center gap-1.5 group/bullet">
                  <span className="text-slate-400 text-sm font-bold">•</span>
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => updateProjectBullet(pIdx, bIdx, e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                        e.preventDefault();
                        handleBoldBullet(e.target, b, (newText) => updateProjectBullet(pIdx, bIdx, newText));
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        addProjectBullet(pIdx);
                      }
                    }}
                    placeholder="Describe architectural impact, features, or metrics..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const inputEl = e.currentTarget.parentElement.querySelector('input');
                      handleBoldBullet(inputEl, b, (newText) => updateProjectBullet(pIdx, bIdx, newText));
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#5CB338] rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0 border border-slate-200 cursor-pointer"
                    title="Bold selected text (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onTriggerPolish && onTriggerPolish('project', pIdx, bIdx, b, proj.title, '')}
                    className="px-2.5 py-1.5 bg-[#5CB338]/10 hover:bg-[#5CB338]/20 text-[#3f8325] border border-[#5CB338]/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Generate high-impact metrics and polish"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#5CB338]" />
                    <span className="hidden sm:inline">Polish</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProjectBullet(pIdx, bIdx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
