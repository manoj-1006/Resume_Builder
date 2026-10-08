import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function SkillsForm({ resume, onChange }) {
  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const addSkillCategory = () => {
    const list = [...(resume.skillCategories || [])];
    list.push({ category: 'Key Technical Skills', skills: [] });
    updateField('skillCategories', list);
  };

  const updateSkillCategory = (index, categoryName) => {
    const list = [...(resume.skillCategories || [])];
    list[index].category = categoryName;
    updateField('skillCategories', list);
  };

  const removeSkillCategory = (index) => {
    const list = (resume.skillCategories || []).filter((_, i) => i !== index);
    updateField('skillCategories', list);
  };

  const addSkill = (catIndex, skill) => {
    if (!skill.trim()) return;
    const list = [...(resume.skillCategories || [])];
    if (!list[catIndex].skills.includes(skill.trim())) {
      list[catIndex].skills = [...list[catIndex].skills, skill.trim()];
      updateField('skillCategories', list);
    }
  };

  const removeSkill = (catIndex, skillIndex) => {
    const list = [...(resume.skillCategories || [])];
    list[catIndex].skills = list[catIndex].skills.filter((_, i) => i !== skillIndex);
    updateField('skillCategories', list);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">
          Categorize your skills. Recruiters and ATS bots parse skills by category.
        </span>
        <button
          type="button"
          onClick={addSkillCategory}
          className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {(resume.skillCategories || []).map((cat, catIdx) => (
        <div key={catIdx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={cat.category || ''}
              onChange={(e) => updateSkillCategory(catIdx, e.target.value)}
              placeholder="Category Name (e.g. Languages & Frameworks)"
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white flex-1"
            />
            <button
              type="button"
              onClick={() => removeSkillCategory(catIdx)}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Remove category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {(cat.skills || []).map((sk, skIdx) => (
              <span
                key={skIdx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium"
              >
                {sk}
                <button
                  type="button"
                  onClick={() => removeSkill(catIdx, skIdx)}
                  className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Quick Add Tag Input */}
            <input
              type="text"
              placeholder="+ Add skill (press Enter)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(catIdx, e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="bg-slate-50 border border-dashed border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white w-44"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
