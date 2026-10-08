import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/id';

export default function EducationForm({ resume, onChange, isCompact }) {
  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const addEducation = (type = 'degree') => {
    const list = [...(resume.educations || [])];
    const isSchooling = type === 'schooling' || type === true;
    const isDiploma = type === 'diploma';

    list.push({
      id: generateId(),
      institution: '',
      degree: isSchooling 
        ? 'Secondary & Higher Secondary Education' 
        : (isDiploma ? 'Diploma in Computer Engineering' : ''),
      fieldOfStudy: '',
      location: '',
      graduationDate: '',
      gpa: '',
      isSchooling: isSchooling,
      isDiploma: isDiploma,
      grade12Stream: isSchooling ? 'Class XII' : '',
      grade12Score: '',
      grade12Year: '',
      grade10Board: isSchooling ? 'Class X' : '',
      grade10Score: '',
      grade10Year: '',
      grade10School: ''
    });
    updateField('educations', list);
  };

  const updateEducation = (index, field, value) => {
    const list = [...(resume.educations || [])];
    list[index] = { ...list[index], [field]: value };
    updateField('educations', list);
  };

  const removeEducation = (index) => {
    const list = (resume.educations || []).filter((_, i) => i !== index);
    updateField('educations', list);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className={`flex items-center justify-between gap-3 ${isCompact ? 'flex-col sm:flex-row items-start sm:items-center' : ''}`}>
        <div>
          <span className="text-xs text-slate-600 block">Degrees, universities, and school education (10th & 12th board marks).</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => addEducation('degree')}
            className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add College / Degree
          </button>
          <button
            type="button"
            onClick={() => addEducation('diploma')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Add Polytechnic / Diploma"
          >
            <Plus className="w-3.5 h-3.5 text-[#5CB338]" />
            Add Diploma
          </button>
          <button
            type="button"
            onClick={() => addEducation('schooling')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Add 10th & 12th marks under school"
          >
            <Plus className="w-3.5 h-3.5 text-[#5CB338]" />
            Add School
          </button>
        </div>
      </div>

      {(resume.educations || []).length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
          No education entries yet. Click &quot;Add College / Degree&quot;, &quot;Add Diploma&quot;, or &quot;Add School&quot; to begin.
        </div>
      ) : (
        (resume.educations || []).map((edu, eduIdx) => (
          <div key={edu.id || eduIdx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-2xs">
            {/* Mode Selector & Delete Button */}
            <div className="flex items-center justify-between pr-8 border-b border-slate-100 pb-2.5">
              <div className="inline-flex flex-wrap rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    updateEducation(eduIdx, 'isSchooling', false);
                    updateEducation(eduIdx, 'isDiploma', false);
                  }}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    !edu.isSchooling && !edu.isDiploma
                      ? 'bg-white shadow-2xs text-slate-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  College / University Degree
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEducation(eduIdx, 'isSchooling', false);
                    updateEducation(eduIdx, 'isDiploma', true);
                    if (!edu.degree || edu.degree === 'Secondary & Higher Secondary Education') {
                      updateEducation(eduIdx, 'degree', 'Diploma in Computer Engineering');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    !edu.isSchooling && edu.isDiploma
                      ? 'bg-white shadow-2xs text-[#3f8325] font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Diploma
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEducation(eduIdx, 'isSchooling', true);
                    updateEducation(eduIdx, 'isDiploma', false);
                    if (!edu.degree) updateEducation(eduIdx, 'degree', 'Secondary & Higher Secondary Education');
                    if (!edu.grade12Stream) updateEducation(eduIdx, 'grade12Stream', 'Class XII');
                    if (!edu.grade10Board) updateEducation(eduIdx, 'grade10Board', 'Class X');
                  }}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    edu.isSchooling
                      ? 'bg-white shadow-2xs text-[#3f8325] font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  School
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeEducation(eduIdx)}
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {edu.isSchooling ? (
              /* 10th & 12th Schooling Combined Fields */
              <div className="space-y-3.5 pt-1">
                <div className={isCompact ? 'grid grid-cols-1 gap-2.5' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">School / Institution Name</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                      placeholder="e.g. Delhi Public School / St. Xavier's High School"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location (City, State / Country)</label>
                    <input
                      type="text"
                      value={edu.location || ''}
                      onChange={(e) => updateEducation(eduIdx, 'location', e.target.value)}
                      placeholder="e.g. New Delhi, India"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Class XII Sub-box */}
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#5CB338]"></span>
                      Class XII
                    </span>
                  </div>
                  <div className={isCompact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 sm:grid-cols-3 gap-2.5'}>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Board & Stream</label>
                      <input
                        type="text"
                        value={edu.grade12Stream || ''}
                        onChange={(e) => updateEducation(eduIdx, 'grade12Stream', e.target.value)}
                        placeholder="Class XII"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Marks / Score / Percentage</label>
                      <input
                        type="text"
                        value={edu.grade12Score || ''}
                        onChange={(e) => updateEducation(eduIdx, 'grade12Score', e.target.value)}
                        placeholder="e.g. 95.4% or 477/500 or 9.5 CGPA"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] font-bold text-[#3f8325]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Passing Year</label>
                      <input
                        type="text"
                        value={edu.grade12Year || ''}
                        onChange={(e) => updateEducation(eduIdx, 'grade12Year', e.target.value)}
                        placeholder="e.g. 2022"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                      />
                    </div>
                  </div>
                </div>

                {/* Class X Sub-box */}
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#5CB338]"></span>
                      Class X
                    </span>
                  </div>
                  <div className={isCompact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 sm:grid-cols-3 gap-2.5'}>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Board / Examination</label>
                      <input
                        type="text"
                        value={edu.grade10Board || ''}
                        onChange={(e) => updateEducation(eduIdx, 'grade10Board', e.target.value)}
                        placeholder="Class X"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Marks / Score / Percentage</label>
                      <input
                        type="text"
                        value={edu.grade10Score || ''}
                        onChange={(e) => updateEducation(eduIdx, 'grade10Score', e.target.value)}
                        placeholder="e.g. 96.0% or 10 CGPA"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] font-bold text-[#3f8325]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Passing Year</label>
                      <input
                        type="text"
                        value={edu.grade10Year || ''}
                        onChange={(e) => updateEducation(eduIdx, 'grade10Year', e.target.value)}
                        placeholder="e.g. 2020"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      School Name (Optional - only if different from 12th school above)
                    </label>
                    <input
                      type="text"
                      value={edu.grade10School || ''}
                      onChange={(e) => updateEducation(eduIdx, 'grade10School', e.target.value)}
                      placeholder="Leave blank if same school as 12th"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338]"
                    />
                  </div>
                </div>
              </div>
            ) : edu.isDiploma ? (
              /* Diploma / Polytechnic Fields */
              <div className={isCompact ? 'grid grid-cols-1 gap-2.5 pr-8' : 'grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8'}>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Polytechnic / Institution Name</label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                    placeholder="e.g. Government Polytechnic College"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Diploma Program & Branch</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                    placeholder="e.g. Diploma in Computer Engineering / Mechanical"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location (City, State / Country)</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => updateEducation(eduIdx, 'location', e.target.value)}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Year of Completion / Passing Date</label>
                  <input
                    type="text"
                    value={edu.graduationDate || ''}
                    onChange={(e) => updateEducation(eduIdx, 'graduationDate', e.target.value)}
                    placeholder="e.g. 2021 or May 2021"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div className={isCompact ? '' : 'sm:col-span-2'}>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Percentage / Score / CGPA (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(eduIdx, 'gpa', e.target.value)}
                    placeholder="e.g. 88.5% or 8.8 CGPA"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white font-bold text-[#3f8325]"
                  />
                </div>
              </div>
            ) : (
              /* Standard University Degree Fields */
              <div className={isCompact ? 'grid grid-cols-1 gap-2.5 pr-8' : 'grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8'}>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">University / Institution</label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                    placeholder="University of California, Berkeley"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                    placeholder="B.S. in Computer Science"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location (City, State / Country)</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => updateEducation(eduIdx, 'location', e.target.value)}
                    placeholder="e.g. Berkeley, CA / Chennai, India"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Graduation Date</label>
                  <input
                    type="text"
                    value={edu.graduationDate || ''}
                    onChange={(e) => updateEducation(eduIdx, 'graduationDate', e.target.value)}
                    placeholder="May 2023"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                  />
                </div>
                <div className={isCompact ? '' : 'sm:col-span-2'}>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">GPA / Honors / Percentage (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(eduIdx, 'gpa', e.target.value)}
                    placeholder="3.8 / 4.0 or 85%"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white font-semibold text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
