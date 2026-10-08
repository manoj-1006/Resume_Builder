import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/id';

export default function CertificationsForm({ resume, onChange, isCompact }) {
  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const addCertification = () => {
    const list = [...(resume.certifications || [])];
    list.push({
      id: generateId(),
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: ''
    });
    updateField('certifications', list);
  };

  const updateCertification = (index, field, value) => {
    const list = [...(resume.certifications || [])];
    list[index] = { ...list[index], [field]: value };
    updateField('certifications', list);
  };

  const removeCertification = (index) => {
    const list = (resume.certifications || []).filter((_, i) => i !== index);
    updateField('certifications', list);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">Professional licenses, industry credentials, and verified certifications.</span>
        <button
          type="button"
          onClick={addCertification}
          className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {(resume.certifications || []).length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
          No certifications added yet. Click &quot;Add Certification&quot; to include AWS, Azure, Google, or professional credentials.
        </div>
      ) : (
        (resume.certifications || []).map((cert, cIdx) => (
          <div key={cert.id || cIdx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-2xs">
            <button
              type="button"
              onClick={() => removeCertification(cIdx)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Delete certification"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className={isCompact ? 'grid grid-cols-1 gap-2.5 pr-8' : 'grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8'}>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Certification Name</label>
                <input
                  type="text"
                  value={cert.name || ''}
                  onChange={(e) => updateCertification(cIdx, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect – Associate"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Issue Year / Date</label>
                <input
                  type="text"
                  value={cert.issueDate || ''}
                  onChange={(e) => updateCertification(cIdx, 'issueDate', e.target.value)}
                  placeholder="2024"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => updateCertification(cIdx, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Credential URL (Optional)</label>
                <input
                  type="text"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => updateCertification(cIdx, 'credentialUrl', e.target.value)}
                  placeholder="https://credly.com/badges/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
