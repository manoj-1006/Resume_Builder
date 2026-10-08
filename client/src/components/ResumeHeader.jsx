import React, { useState } from 'react';
import { 
  FileText, Plus, Copy, Trash2, Save, Check, 
  ChevronDown 
} from 'lucide-react';

export default function ResumeHeader({
  resumes,
  currentResume,
  onSelectResume,
  onCreateResume,
  onDuplicateResume,
  onDeleteResume,
  onSaveResume,
  saving,
  lastSaved,
  protectedIds = [1, 2, 3]
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Resume Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5CB338] text-white shadow-sm shadow-[#5CB338]/25">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  ResumeForger
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Professional Profiles • High-Impact Bullet Optimization • ATS Matcher
              </p>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Current Resume Dropdown / Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 transition"
            >
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {currentResume?.title || 'Select Resume'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Your Resumes ({resumes.length})
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {resumes.map((r) => {
                    const isProt = protectedIds.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          onSelectResume(r.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          r.id === currentResume?.id
                            ? 'bg-[#5CB338]/10 text-[#3f8325] font-semibold border border-[#5CB338]/30'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          {r.title}
                          {isProt && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-slate-100 text-slate-500 rounded font-medium border border-slate-200">
                              Base
                            </span>
                          )}
                        </span>
                        {r.id === currentResume?.id && <Check className="w-3 h-3 text-[#5CB338]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Last Saved indicator */}
          <span className="text-[11px] text-slate-500 hidden lg:inline mr-2">
            {saving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved}` : ''}
          </span>

          <button
            onClick={onCreateResume}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            title="Create a new blank resume"
          >
            <Plus className="w-3.5 h-3.5 text-[#5CB338]" />
            <span>New</span>
          </button>

          <button
            onClick={onDuplicateResume}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            title="Duplicate this resume to tailor for another role"
          >
            <Copy className="w-3.5 h-3.5 text-blue-600" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={onDeleteResume}
            className={`p-1.5 bg-white border border-slate-300 rounded-lg text-xs transition shadow-2xs cursor-pointer ${
              protectedIds.includes(currentResume?.id)
                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title={protectedIds.includes(currentResume?.id) ? "Protected base resume" : "Delete current resume"}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onSaveResume}
            disabled={saving}
            className="px-3.5 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition ml-1 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </header>
  );
}
