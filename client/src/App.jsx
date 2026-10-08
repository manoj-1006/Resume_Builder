import React, { useState, useEffect } from 'react';
import { 
  FileEdit, Target, Loader2, AlertCircle, Sliders 
} from 'lucide-react';
import { 
  fetchResumes, fetchResume, createResume, updateResume, 
  deleteResume, duplicateResume 
} from './api';
import ResumeHeader from './components/ResumeHeader';
import ResumeEditor from './components/ResumeEditor';
import AdvancedSettingsTab from './components/AdvancedSettingsTab';
import AtsScannerTab from './components/AtsScannerTab';
import ResumePreview from './components/ResumePreview';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

const PROTECTED_RESUME_IDS = [1, 2, 3];

export default function App() {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('');
  const [error, setError] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('editor'); // 'editor' | 'ats'
  const [layoutRatio, setLayoutRatio] = useState('balanced'); // 'focus-editor' (2/3 editor, 1/3 view) | 'balanced' (1/2, 1/2) | 'focus-preview' (1/3 editor, 2/3 view)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getNextResumeTitle = (list = resumes) => {
    const existingTitles = new Set((list || []).map(r => (r.title || '').trim().toLowerCase()));
    if (!existingTitles.has('resume')) {
      return 'Resume';
    }
    let count = 1;
    while (existingTitles.has(`resume ${count}`)) {
      count++;
    }
    return `Resume ${count}`;
  };

  const handleCreateNew = async () => {
    try {
      const defaultTitle = getNextResumeTitle();
      const newResume = await createResume({
        title: defaultTitle,
        targetRole: 'Software Engineer',
        fullName: 'New Candidate',
        email: '',
        phone: '',
        location: '',
        experiences: [],
        educations: [],
        skillCategories: [
          { category: 'Key Technical Skills', skills: ['Python', 'SQL', 'Git'] }
        ],
        projects: [],
        certifications: [],
        others: []
      });
      const normalized = normalizeResume(newResume);
      setResumes(prev => [normalized, ...prev]);
      setCurrentResume(normalized);
    } catch (err) {
      setError('Failed to create new resume: ' + err.message);
    }
  };

  const normalizeResume = (r) => {
    if (!r) return r;
    const linkedin = r.linkedInUrl || r.linkedinUrl || '';
    const linkedinText = r.linkedInText || r.linkedinText || (linkedin ? 'LinkedIn' : '');
    const github = r.gitHubUrl || r.githubUrl || '';
    const githubText = r.gitHubText || r.githubText || (github ? 'GitHub' : '');
    const portfolio = r.portfolioUrl || '';
    const portfolioText = r.portfolioText || (portfolio ? 'Portfolio' : '');
    const title = (r.title && r.title.trim()) || getNextResumeTitle();
    return {
      ...r,
      title,
      linkedInUrl: linkedin,
      linkedinUrl: linkedin,
      linkedInText: linkedinText,
      linkedinText: linkedinText,
      gitHubUrl: github,
      githubUrl: github,
      gitHubText: githubText,
      githubText: githubText,
      portfolioUrl: portfolio,
      portfolioText: portfolioText
    };
  };

  const loadAllResumes = async (preferredId = null) => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchResumes();
      setResumes(list);

      const targetId = preferredId || (list.length > 0 ? list[0].id : null);
      if (targetId) {
        const fullResume = await fetchResume(targetId);
        setCurrentResume(normalizeResume(fullResume));
      } else {
        handleCreateNew();
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend. Please ensure the ASP.NET Core API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectResume = async (id) => {
    setLoading(true);
    try {
      const resume = await fetchResume(id);
      setCurrentResume(normalizeResume(resume));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!currentResume) return;
    try {
      const duplicate = await duplicateResume(currentResume.id);
      setResumes([duplicate, ...resumes]);
      setCurrentResume(normalizeResume(duplicate));
    } catch (err) {
      setError('Failed to duplicate: ' + err.message);
    }
  };

  const handleDeleteClick = () => {
    if (!currentResume) return;
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentResume) return;
    if (PROTECTED_RESUME_IDS.includes(currentResume.id)) {
      setDeleteModalOpen(false);
      return;
    }

    try {
      await deleteResume(currentResume.id);
      const remaining = resumes.filter(r => r.id !== currentResume.id);
      setResumes(remaining);
      setDeleteModalOpen(false);
      if (remaining.length > 0) {
        handleSelectResume(remaining[0].id);
      }
    } catch (err) {
      setError('Failed to delete: ' + err.message);
      setDeleteModalOpen(false);
    }
  };

  const handleSave = async (resumeToSave = currentResume) => {
    if (!resumeToSave || !resumeToSave.id) return;
    setSaving(true);
    try {
      await updateResume(resumeToSave.id, resumeToSave);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setResumes(resumes.map(r => r.id === resumeToSave.id ? { ...r, title: resumeToSave.title } : r));
    } catch (err) {
      setError('Failed to save resume: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeChange = (updated) => {
    setCurrentResume(updated);
  };

  // Determine grid spans based on ratio toggle
  const getEditorColSpan = () => {
    if (layoutRatio === 'focus-editor') return 'lg:col-span-8'; // 2/3 Details
    if (layoutRatio === 'focus-preview') return 'lg:col-span-4'; // 1/3 Details
    return 'lg:col-span-6'; // 1/2 Balanced
  };

  const getPreviewColSpan = () => {
    if (layoutRatio === 'focus-editor') return 'lg:col-span-4'; // 1/3 Resume View
    if (layoutRatio === 'focus-preview') return 'lg:col-span-8'; // 2/3 Resume View
    return 'lg:col-span-6'; // 1/2 Balanced
  };

  if (loading && !currentResume) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3 text-slate-600">
        <Loader2 className="w-10 h-10 animate-spin text-[#5CB338]" />
        <p className="text-sm font-semibold">Starting ResumeForger & connecting to .NET API...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Top Navigation */}
      <header className="shrink-0">
        <ResumeHeader
          resumes={resumes}
          currentResume={currentResume}
          onSelectResume={handleSelectResume}
          onCreateResume={handleCreateNew}
          onDuplicateResume={handleDuplicate}
          onDeleteResume={handleDeleteClick}
          onSaveResume={() => handleSave(currentResume)}
          saving={saving}
          lastSaved={lastSaved}
          protectedIds={PROTECTED_RESUME_IDS}
        />
      </header>

      {error && (
        <div className="shrink-0 bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-600 hover:text-rose-900 font-bold">✕</button>
        </div>
      )}

      {/* Main Split Screen Workspace */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* Left Pane: Editor & AI Tools */}
        <section className={`${getEditorColSpan()} flex flex-col h-full min-h-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300`}>
          {/* Main Workspace Navigation Header */}
          <div className="shrink-0 flex flex-wrap items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-50 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveMainTab('editor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeMainTab === 'editor'
                    ? 'bg-[#5CB338] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                Add Details
              </button>

              <button
                onClick={() => setActiveMainTab('settings')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeMainTab === 'settings'
                    ? 'bg-[#5CB338] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Advanced Settings
              </button>

              <button
                onClick={() => setActiveMainTab('ats')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeMainTab === 'ats'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Target Job & ATS
              </button>
            </div>

            {/* Resume Title Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentResume?.title || ''}
                onChange={(e) => handleResumeChange({ ...currentResume, title: e.target.value })}
                onBlur={(e) => {
                  if (!e.target.value.trim() && currentResume) {
                    const fallbackTitle = getNextResumeTitle();
                    handleResumeChange({ ...currentResume, title: fallbackTitle });
                  }
                }}
                placeholder="Resume"
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 w-36 sm:w-44 text-left shadow-2xs"
                title="Click to rename this resume"
              />
            </div>
          </div>

          {/* Active Tab Content Area */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
            {activeMainTab === 'editor' && currentResume && (
              <ResumeEditor
                resume={currentResume}
                onChange={handleResumeChange}
                layoutRatio={layoutRatio}
              />
            )}

            {activeMainTab === 'settings' && currentResume && (
              <AdvancedSettingsTab
                resume={currentResume}
                onChange={handleResumeChange}
                layoutRatio={layoutRatio}
              />
            )}

            {activeMainTab === 'ats' && currentResume && (
              <AtsScannerTab
                resume={currentResume}
                onUpdateResume={handleResumeChange}
                layoutRatio={layoutRatio}
              />
            )}
          </div>
        </section>

        {/* Right Pane: Live ATS Preview & Export */}
        <section className={`${getPreviewColSpan()} flex flex-col h-full min-h-0 transition-all duration-300`}>
          <ResumePreview
            resume={currentResume}
            layoutRatio={layoutRatio}
            onChangeLayoutRatio={setLayoutRatio}
            onUpdateResume={handleResumeChange}
          />
        </section>
      </main>

      {/* Delete Confirmation / Protection Window */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        resumeTitle={currentResume?.title || 'this resume'}
        isProtected={currentResume ? PROTECTED_RESUME_IDS.includes(currentResume.id) : false}
      />
    </div>
  );
}
