import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, 
  Sparkles, Award, Trophy 
} from 'lucide-react';
import BulletPolishModal from './BulletPolishModal';
import PersonalInfoForm from './editor/PersonalInfoForm';
import SummaryForm from './editor/SummaryForm';
import ExperienceForm from './editor/ExperienceForm';
import SkillsForm from './editor/SkillsForm';
import EducationForm from './editor/EducationForm';
import ProjectsForm from './editor/ProjectsForm';
import CertificationsForm from './editor/CertificationsForm';
import OthersForm from './editor/OthersForm';

const SUB_TABS = [
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'summary', label: 'Summary', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'others', label: 'Others', icon: Trophy },
];

export default function ResumeEditor({ resume, onChange, layoutRatio = 'balanced' }) {
  const isCompact = layoutRatio === 'focus-preview';
  const [activeSubTab, setActiveSubTab] = useState('contact');

  // Polish modal state
  const [polishModalOpen, setPolishModalOpen] = useState(false);
  const [polishContext, setPolishContext] = useState({
    targetType: '', // 'experience', 'project', or 'other'
    itemIndex: 0,
    bulletIndex: 0,
    bulletText: '',
    role: '',
    company: ''
  });

  const triggerPolish = (type, itemIdx, bIdx, text, role, company) => {
    setPolishContext({
      targetType: type,
      itemIndex: itemIdx,
      bulletIndex: bIdx,
      bulletText: text,
      role: role || resume?.targetRole || '',
      company: company || ''
    });
    setPolishModalOpen(true);
  };

  const applyPolishedBullet = (newBulletText) => {
    if (polishContext.targetType === 'experience') {
      const list = [...(resume.experiences || [])];
      if (list[polishContext.itemIndex]?.bullets) {
        const bullets = [...list[polishContext.itemIndex].bullets];
        bullets[polishContext.bulletIndex] = newBulletText;
        list[polishContext.itemIndex] = { ...list[polishContext.itemIndex], bullets };
        onChange({ ...resume, experiences: list });
      }
    } else if (polishContext.targetType === 'project') {
      const list = [...(resume.projects || [])];
      if (list[polishContext.itemIndex]?.bullets) {
        const bullets = [...list[polishContext.itemIndex].bullets];
        bullets[polishContext.bulletIndex] = newBulletText;
        list[polishContext.itemIndex] = { ...list[polishContext.itemIndex], bullets };
        onChange({ ...resume, projects: list });
      }
    } else if (polishContext.targetType === 'other') {
      const list = [...(resume.others || [])];
      if (list[polishContext.itemIndex]) {
        list[polishContext.itemIndex] = { ...list[polishContext.itemIndex], description: newBulletText };
        onChange({ ...resume, others: list });
      }
    }
  };

  if (!resume) return null;

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1 text-sm">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition text-xs whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#5CB338]/10 text-[#3f8325] border border-[#5CB338]/30 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Modular Sub-Form Tabs */}
      {activeSubTab === 'contact' && (
        <PersonalInfoForm resume={resume} onChange={onChange} isCompact={isCompact} />
      )}

      {activeSubTab === 'summary' && (
        <SummaryForm resume={resume} onChange={onChange} />
      )}

      {activeSubTab === 'experience' && (
        <ExperienceForm 
          resume={resume} 
          onChange={onChange} 
          isCompact={isCompact} 
          onTriggerPolish={triggerPolish} 
        />
      )}

      {activeSubTab === 'skills' && (
        <SkillsForm resume={resume} onChange={onChange} />
      )}

      {activeSubTab === 'education' && (
        <EducationForm resume={resume} onChange={onChange} isCompact={isCompact} />
      )}

      {activeSubTab === 'projects' && (
        <ProjectsForm 
          resume={resume} 
          onChange={onChange} 
          isCompact={isCompact} 
          onTriggerPolish={triggerPolish} 
        />
      )}

      {activeSubTab === 'certifications' && (
        <CertificationsForm resume={resume} onChange={onChange} isCompact={isCompact} />
      )}

      {activeSubTab === 'others' && (
        <OthersForm 
          resume={resume} 
          onChange={onChange} 
          isCompact={isCompact} 
          onTriggerPolish={triggerPolish} 
        />
      )}

      {/* Bullet Polish AI Modal */}
      <BulletPolishModal
        isOpen={polishModalOpen}
        onClose={() => setPolishModalOpen(false)}
        onApply={applyPolishedBullet}
        initialBullet={polishContext.bulletText}
        role={polishContext.role}
        company={polishContext.company}
      />
    </div>
  );
}
