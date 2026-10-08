import React, { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Download, FileText, Eye, ZoomIn, ZoomOut, Columns2, Loader2, Check } from 'lucide-react';
import { getExportPdfUrl, getExportDocxUrl, updateResume } from '../api';
import { getResumeFormatting, TEMPLATE_PRESETS } from '../utils/formatting';

export default function ResumePreview({ resume, layoutRatio = 'balanced', onChangeLayoutRatio, onUpdateResume }) {
  const safeResume = resume || {};
  const format = getResumeFormatting(safeResume);
  const [exportingType, setExportingType] = useState(null); // 'pdf' | 'docx' | null
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async (type) => {
    if (!resume || !resume.id || exportingType) return;
    setExportingType(type);
    setExportMessage('');

    try {
      // 1. Auto-save latest resume state to database before exporting
      try {
        await updateResume(resume.id, resume);
      } catch (saveErr) {
        console.warn('Auto-save before export skipped:', saveErr);
      }

      // 2. Fetch the generated file binary from the backend API
      const url = type === 'pdf' ? getExportPdfUrl(resume.id) : getExportDocxUrl(resume.id);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Export failed (${res.status} ${res.statusText})`);
      }
      const blob = await res.blob();

      // 3. Format clean filename using Resume Title (with fallback to Full Name or 'Resume')
      const baseTitle = (resume.title && resume.title.trim()) || 
                        (resume.fullName && `${resume.fullName.trim()}_Resume`) || 
                        'Resume';
      const safeName = baseTitle
        .replace(/[^a-zA-Z0-9_\-\s]/g, '')
        .trim()
        .replace(/[\s_]+/g, '_') || 'Resume';
      const fileName = type === 'pdf' ? `${safeName}.pdf` : `${safeName}.docx`;

      // 4. Use native File System Access API (Opens Windows Save As dialog to choose location)
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: type === 'pdf' ? [
              {
                description: 'PDF Document (*.pdf)',
                accept: { 'application/pdf': ['.pdf'] }
              }
            ] : [
              {
                description: 'Word Document (*.docx)',
                accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
              }
            ]
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          setExportMessage('Saved successfully!');
          setTimeout(() => setExportMessage(''), 4000);
          return;
        } catch (pickerErr) {
          if (pickerErr.name === 'AbortError') {
            // User intentionally closed or cancelled the Save As dialog
            return;
          }
          console.warn('File picker error, using download fallback:', pickerErr);
        }
      }

      // 5. Fallback for browsers that do not support showSaveFilePicker
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', fileName);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
      setExportMessage('Downloaded successfully!');
      setTimeout(() => setExportMessage(''), 4000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Could not export document: ' + err.message);
    } finally {
      setExportingType(null);
    }
  };

  // Active template detection:
  // Default to 'classic'. Detect modern or minimal if explicitly set or specific layout traits are present
  const currentTemplate = (format.template && ['classic', 'modern', 'minimal'].includes(format.template))
    ? (format.template === 'modern' && format.headingStyle !== 'bar' && format.headerAlignment === 'center' ? 'classic' : format.template)
    : (format.headingStyle === 'bar' ? 'modern' :
       (format.headingStyle === 'clean' && !format.sectionDividers) ? 'minimal' :
       'classic');

  const handleSelectTemplate = (templateKey) => {
    const chosen = TEMPLATE_PRESETS[templateKey];
    if (!chosen) return;
    if (onUpdateResume) {
      const isCustomColor = format.accentColor && 
        format.accentColor !== '#1e293b' && 
        format.accentColor !== '#5CB338' && 
        format.accentColor !== '#334155';

      const updatedFormat = {
        ...format,
        ...chosen.settings,
        template: templateKey,
        ...(isCustomColor ? {
          accentColor: format.accentColor,
          dividerColor: format.dividerColor,
          linkColor: format.linkColor
        } : {})
      };
      onUpdateResume({
        ...resume,
        formatting: updatedFormat,
        formattingJson: JSON.stringify(updatedFormat)
      });
    }
  };

  const formatUrl = (val) => {
    if (!val) return '';
    const trimmed = val.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  const linkedinUrl = resume.linkedInUrl || resume.linkedinUrl;
  const linkedinText = resume.linkedInText || resume.linkedinText || (linkedinUrl ? 'LinkedIn' : '');

  const githubUrl = resume.gitHubUrl || resume.githubUrl;
  const githubText = resume.gitHubText || resume.githubText || (githubUrl ? 'GitHub' : '');

  const portfolioUrl = resume.portfolioUrl;
  const portfolioText = resume.portfolioText || (portfolioUrl ? 'Portfolio' : '');

  const contactItems = [
    resume.email ? { text: resume.email, href: `mailto:${resume.email.trim()}` } : null,
    resume.phone ? { text: resume.phone, href: `tel:${resume.phone.trim().replace(/\s+/g, '')}` } : null,
    resume.location ? { text: resume.location, href: null } : null,
    (linkedinText || linkedinUrl) ? { text: linkedinText || linkedinUrl, href: linkedinUrl ? formatUrl(linkedinUrl) : null } : null,
    (githubText || githubUrl) ? { text: githubText || githubUrl, href: githubUrl ? formatUrl(githubUrl) : null } : null,
    (portfolioText || portfolioUrl) ? { text: portfolioText || portfolioUrl, href: portfolioUrl ? formatUrl(portfolioUrl) : null } : null,
  ].filter(Boolean);

  // Dynamic Typography & Styles
  const fontClass = `font-${format.fontFamily || 'inter'}`;

  const fontSizeClass = {
    'compact-2xs': 'text-[9px]',
    'compact-xs': 'text-[10px]',
    'compact-sm': 'text-[10.5px]',
    'compact-md': 'text-[11px]',
    compact: 'text-[11.5px]',
    'normal-sm': 'text-[12px]',
    normal: 'text-[12.5px]',
    'medium-sm': 'text-[13px]',
    medium: 'text-[13.5px]',
    'medium-lg': 'text-[14px]',
    'large-sm': 'text-[14.5px]',
    large: 'text-[15px]',
    'large-xl': 'text-[16px]',
  }[format.fontSize] || 'text-[12.5px]';

  const nameSizeClass = {
    'compact-sm': 'text-lg sm:text-[18px]',
    compact: 'text-xl sm:text-[20px]',
    'normal-sm': 'text-xl sm:text-[22px]',
    normal: 'text-xl sm:text-2xl',
    'large-sm': 'text-2xl sm:text-[26px]',
    large: 'text-2xl sm:text-3xl',
    'xl-sm': 'text-3xl sm:text-[32px]',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-[40px]',
    '3xl': 'text-4xl sm:text-[44px]',
  }[format.nameSize] || 'text-2xl sm:text-3xl';

  const nameBoldClass = {
    normal: 'font-semibold',
    bold: 'font-bold',
    extra: 'font-black'
  }[format.nameBold] || 'font-black';

  const headingSizeClass = {
    'compact-xs': 'text-[10px]',
    'compact-sm': 'text-[10.5px]',
    compact: 'text-[11px]',
    'normal-sm': 'text-[11.5px]',
    normal: 'text-xs',
    'medium-sm': 'text-[13px]',
    medium: 'text-[14px]',
    'large-sm': 'text-[15px]',
    large: 'text-sm sm:text-[16px]',
    'xl-sm': 'text-[17px]',
    xl: 'text-base sm:text-lg',
  }[format.headingSize] || 'text-xs';

  const headingBoldClass = {
    normal: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black'
  }[format.headingBold] || 'font-bold';

  const headingCaseClass = {
    uppercase: 'uppercase tracking-wider',
    capitalize: 'capitalize tracking-normal',
    normal: 'normal-case tracking-normal'
  }[format.headingCase] || 'uppercase tracking-wider';

  const jobTitleWeightClass = {
    normal: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }[format.jobTitleBold] || 'font-bold';

  const companyWeightClass = {
    normal: 'font-normal text-slate-600',
    medium: 'font-medium text-slate-700',
    semibold: 'font-semibold text-slate-800'
  }[format.companyBold] || 'font-semibold text-slate-700';

  const datesWeightClass = {
    normal: 'font-normal text-slate-500',
    medium: 'font-medium text-slate-600',
    semibold: 'font-semibold text-slate-700'
  }[format.datesBold] || 'font-normal text-slate-500';

  const marginPaddingClass = {
    compact: 'p-4 sm:p-6',
    normal: 'p-7 sm:p-10',
    relaxed: 'p-9 sm:p-14',
    spacious: 'p-12 sm:p-16'
  }[format.pageMargin] || (layoutRatio === 'focus-editor' ? 'p-6' : layoutRatio === 'focus-preview' ? 'p-12' : 'p-8 sm:p-12');

  const lineHeightClass = {
    tight: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed'
  }[format.lineHeight] || 'leading-normal';

  const sectionSpacingClass = {
    compact: 'mt-3.5',
    normal: 'mt-5',
    relaxed: 'mt-7'
  }[format.sectionSpacing] || 'mt-5';

  const bulletSymbol = {
    disc: '•',
    dash: '–',
    arrow: '▸',
    square: '▪',
    dot: '·'
  }[format.bulletStyle] || '•';

  // Divider Line Helper
  const getDividerStyle = () => {
    if (format.dividerStyle === 'none') {
      return { borderBottom: 'none' };
    }
    const thickness = format.dividerThickness || '1px';
    const color = format.dividerColor || '#cbd5e1';

    if (format.dividerStyle === 'gradient') {
      return {
        borderBottom: 'none',
        backgroundImage: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
        backgroundPosition: 'bottom',
        backgroundSize: `100% ${thickness}`,
        backgroundRepeat: 'no-repeat'
      };
    }
    return {
      borderBottomWidth: thickness,
      borderBottomStyle: format.dividerStyle || 'solid',
      borderBottomColor: color
    };
  };

  // Helper to render inline markdown bold (**bold text**) in descriptions & bullets
  const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return text;
    if (!text.includes('**')) return text;

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} className="font-bold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Section Header Renderer
  const renderSectionHeader = (title) => {
    if (format.headingStyle === 'bar') {
      return (
        <div 
          className="flex items-center pl-2.5 my-1.5 border-l-4"
          style={{ borderColor: format.accentColor || format.dividerColor || '#4f46e5' }}
        >
          <h2 className={`${headingSizeClass} ${headingBoldClass} ${headingCaseClass} text-slate-900`}>
            {title}
          </h2>
        </div>
      );
    }

    if (format.headingStyle === 'pill') {
      return (
        <div className="my-1.5">
          <span 
            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${headingCaseClass}`}
            style={{ 
              backgroundColor: `${format.accentColor || '#4f46e5'}15`, 
              color: format.accentColor || '#4f46e5' 
            }}
          >
            {title}
          </span>
        </div>
      );
    }

    if (format.headingStyle === 'clean') {
      return (
        <h2 className={`${headingSizeClass} ${headingBoldClass} ${headingCaseClass} text-slate-900 my-1`}>
          {title}
        </h2>
      );
    }

    // Default: 'underline'
    return (
      <div 
        className="pb-1" 
        style={format.sectionDividers !== false ? getDividerStyle() : {}}
      >
        <h2 className={`${headingSizeClass} ${headingBoldClass} ${headingCaseClass} text-slate-900`}>
          {title}
        </h2>
      </div>
    );
  };

  // Build modular items list for measurement & multi-page rendering
  const itemsList = useMemo(() => {
    const list = [];

    // 1. Header (Candidate Name, Role, Contacts)
    list.push({
      id: 'header',
      type: 'header',
      render: () => (
        <div 
          className={`pb-3 ${
            format.headerAlignment === 'left' 
              ? 'text-left' 
              : format.headerAlignment === 'split' 
              ? 'flex flex-col sm:flex-row sm:items-baseline sm:justify-between' 
              : 'text-center'
          }`}
          style={format.headerDivider !== false ? getDividerStyle() : {}}
        >
          <div>
            <h1 className={`${nameSizeClass} ${nameBoldClass} text-slate-900 tracking-tight uppercase`}>
              {resume.fullName || 'YOUR FULL NAME'}
            </h1>
            {resume.targetRole && (
              <p 
                className="text-sm font-semibold mt-0.5"
                style={{ color: format.template === 'modern' ? (format.accentColor || '#334155') : '#334155' }}
              >
                {resume.targetRole}
              </p>
            )}
          </div>

          {contactItems.length > 0 && (
            <p className={`text-xs text-slate-600 mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 ${
              format.headerAlignment === 'left' ? 'justify-start' : format.headerAlignment === 'split' ? 'justify-start sm:justify-end' : 'justify-center'
            }`}>
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="transition-colors hover:underline cursor-pointer font-medium"
                      style={{ color: 'inherit' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = format.accentColor || format.dividerColor || '#5CB338';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'inherit';
                      }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                  {idx < contactItems.length - 1 && <span className="text-slate-400">•</span>}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      )
    });

    // 2. Professional Summary
    if (resume.professionalSummary) {
      list.push({
        id: 'summary',
        type: 'summary',
        render: () => (
          <div className={sectionSpacingClass}>
            {renderSectionHeader('Professional Summary')}
            <p className="text-slate-800 mt-2 leading-relaxed">
              {renderFormattedText(resume.professionalSummary)}
            </p>
          </div>
        )
      });
    }

    // 3. Work Experience
    if (resume.experiences?.length > 0) {
      resume.experiences.forEach((exp, idx) => {
        list.push({
          id: `exp-${idx}`,
          type: 'experience',
          render: (showHeading) => (
            <div className={showHeading ? sectionSpacingClass : 'mt-3.5'}>
              {showHeading && renderSectionHeader('Work Experience')}
              <div className={`space-y-1 ${showHeading ? 'mt-2.5' : ''}`}>
                <div className="flex justify-between items-baseline text-xs sm:text-[13px]">
                  <div>
                    <span className={jobTitleWeightClass}>{exp.role || 'Job Title'}</span>
                    {exp.company && <span className={companyWeightClass}> | {exp.company}</span>}
                  </div>
                  <span className={`text-[11px] whitespace-nowrap ${datesWeightClass}`}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    {exp.location ? ` (${exp.location})` : ''}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="space-y-1 mt-1 text-slate-800">
                    {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start">
                        <span className="select-none mr-2 shrink-0 text-slate-500 font-bold">
                          {bulletSymbol}
                        </span>
                        <span className="leading-relaxed">{renderFormattedText(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        });
      });
    }

    // 4. Projects
    if (resume.projects?.length > 0) {
      resume.projects.forEach((proj, idx) => {
        list.push({
          id: `proj-${idx}`,
          type: 'projects',
          render: (showHeading) => (
            <div className={showHeading ? sectionSpacingClass : 'mt-3.5'}>
              {showHeading && renderSectionHeader('Projects')}
              <div className={`space-y-1 ${showHeading ? 'mt-2.5' : ''}`}>
                <div className="flex justify-between items-baseline text-xs sm:text-[13px]">
                  <div>
                    {proj.link ? (
                      <a
                        href={formatUrl(proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${jobTitleWeightClass} transition-colors hover:underline cursor-pointer`}
                        style={{ color: 'inherit' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = format.accentColor || format.dividerColor || '#5CB338';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'inherit';
                        }}
                      >
                        {proj.title || 'Project Name'}
                      </a>
                    ) : (
                      <span className={jobTitleWeightClass}>{proj.title || 'Project Name'}</span>
                    )}
                    {proj.techStack && (
                      <span className="text-slate-600 text-[11px] italic ml-1">
                        ({proj.techStack})
                      </span>
                    )}
                  </div>
                </div>

                {proj.bullets?.length > 0 && (
                  <ul className="space-y-1 mt-1 text-slate-800">
                    {proj.bullets.filter(Boolean).map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start">
                        <span className="select-none mr-2 shrink-0 text-slate-500 font-bold">
                          {bulletSymbol}
                        </span>
                        <span className="leading-relaxed">{renderFormattedText(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        });
      });
    }

    // 5. Technical Skills
    if (resume.skillCategories?.length > 0) {
      list.push({
        id: 'skills',
        type: 'skills',
        render: () => (
          <div className={sectionSpacingClass}>
            {renderSectionHeader('Technical & Core Skills')}
            <div className="space-y-1.5 mt-2 text-slate-800">
              {resume.skillCategories.map((cat, idx) => (
                cat.skills?.length > 0 && (
                  <div key={idx}>
                    <span className={jobTitleWeightClass}>{cat.category}: </span>
                    <span>{cat.skills.join(', ')}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )
      });
    }

    // 6. Education
    if (resume.educations?.length > 0) {
      resume.educations.forEach((edu, idx) => {
        list.push({
          id: `edu-${idx}`,
          type: 'education',
          render: (showHeading) => (
            <div className={showHeading ? sectionSpacingClass : 'mt-3'}>
              {showHeading && renderSectionHeader('Education')}
              <div className={showHeading ? 'mt-2.5' : ''}>
                {edu.isSchooling ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs sm:text-[13px]">
                      <div>
                        <span className={jobTitleWeightClass}>
                          {edu.degree || 'Secondary & Higher Secondary Education'}
                        </span>
                        {edu.institution && (
                          <span className={companyWeightClass}> | {edu.institution}</span>
                        )}
                        {edu.location && (
                          <span className="text-slate-500 text-[11px] ml-1">({edu.location})</span>
                        )}
                      </div>
                      {(edu.grade10Year && edu.grade12Year ? `${edu.grade10Year} – ${edu.grade12Year}` : (edu.graduationDate || edu.grade12Year || edu.grade10Year)) && (
                        <span className={`text-[11px] whitespace-nowrap ${datesWeightClass}`}>
                          {edu.grade10Year && edu.grade12Year ? `${edu.grade10Year} – ${edu.grade12Year}` : (edu.graduationDate || edu.grade12Year || edu.grade10Year)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 mt-1 pl-2 text-slate-800">
                      {(edu.grade12Score || edu.grade12Stream) && (
                        <div className="flex items-start text-xs sm:text-[12.5px]">
                          <span className="select-none mr-2 shrink-0 text-slate-500 font-bold">
                            {bulletSymbol}
                          </span>
                          <div className="leading-relaxed">
                            <span className="font-semibold text-slate-900">
                              {edu.grade12Stream || 'Class XII'}:
                            </span>{' '}
                            {edu.grade12Score && (
                              <span className="font-bold text-slate-900">{edu.grade12Score}</span>
                            )}
                            {edu.grade12Year && (
                              <span className="text-slate-500 text-[11px] ml-1">({edu.grade12Year})</span>
                            )}
                          </div>
                        </div>
                      )}
                      {(edu.grade10Score || edu.grade10Board) && (
                        <div className="flex items-start text-xs sm:text-[12.5px]">
                          <span className="select-none mr-2 shrink-0 text-slate-500 font-bold">
                            {bulletSymbol}
                          </span>
                          <div className="leading-relaxed">
                            <span className="font-semibold text-slate-900">
                              {edu.grade10Board || 'Class X'}:
                            </span>{' '}
                            {edu.grade10Score && (
                              <span className="font-bold text-slate-900">{edu.grade10Score}</span>
                            )}
                            {edu.grade10Year && (
                              <span className="text-slate-500 text-[11px] ml-1">({edu.grade10Year})</span>
                            )}
                            {edu.grade10School && edu.grade10School !== edu.institution && (
                              <span className="text-slate-500 text-[11px] ml-1">at {edu.grade10School}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-baseline text-xs sm:text-[13px]">
                    <div>
                      <span className={jobTitleWeightClass}>
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </span>
                      {edu.institution && (
                        <span className={companyWeightClass}> | {edu.institution}</span>
                      )}
                      {edu.location && (
                        <span className="text-slate-500 text-[11px] ml-1">({edu.location})</span>
                      )}
                      {edu.gpa && (
                        <span className="text-slate-500 text-[11px] ml-2">
                          {edu.gpa.toLowerCase().includes('gpa') || edu.gpa.includes('%') ? `(${edu.gpa})` : `(GPA: ${edu.gpa})`}
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] whitespace-nowrap ${datesWeightClass}`}>
                      {edu.graduationDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        });
      });
    }

    // 7. Certifications
    if (resume.certifications?.length > 0) {
      list.push({
        id: 'certifications',
        type: 'certifications',
        render: () => (
          <div className={sectionSpacingClass}>
            {renderSectionHeader('Certifications')}
            <div className="space-y-1 mt-2 text-slate-800">
              {resume.certifications.map((cert, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    {cert.credentialUrl ? (
                      <a
                        href={formatUrl(cert.credentialUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${jobTitleWeightClass} transition-colors hover:underline cursor-pointer`}
                        style={{ color: 'inherit' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = format.accentColor || format.dividerColor || '#5CB338';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'inherit';
                        }}
                      >
                        {cert.name}
                      </a>
                    ) : (
                      <span className={jobTitleWeightClass}>{cert.name}</span>
                    )}
                    {cert.issuer && <span className="text-slate-600"> - {cert.issuer}</span>}
                  </div>
                  {cert.issueDate && <span className={`text-[11px] ${datesWeightClass}`}>{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        )
      });
    }

    // 8. Others (Awards, Leadership, etc.)
    if (resume.others?.length > 0) {
      const groupedMap = new Map();
      resume.others.forEach((item) => {
        if (!item.title && !item.organization && !item.description) return;
        const rawCat = (item.category || 'Awards & Activities').trim();
        if (!rawCat) return;
        const normKey = rawCat.toLowerCase();
        if (!groupedMap.has(normKey)) {
          groupedMap.set(normKey, { title: rawCat, items: [] });
        }
        groupedMap.get(normKey).items.push(item);
      });

      Array.from(groupedMap.values()).forEach(({ title, items }, gIdx) => {
        list.push({
          id: `other-${gIdx}`,
          type: 'others',
          render: () => (
            <div className={sectionSpacingClass}>
              {renderSectionHeader(title)}
              <div className="space-y-2 mt-2 text-slate-800">
                {items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline text-xs sm:text-[13px]">
                      <div>
                        <span className={jobTitleWeightClass}>{item.title}</span>
                        {item.organization && <span className={companyWeightClass}> | {item.organization}</span>}
                      </div>
                      {item.date && <span className={`text-[11px] whitespace-nowrap ${datesWeightClass}`}>{item.date}</span>}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-700 leading-relaxed pl-2 border-l border-slate-200">
                        {renderFormattedText(item.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        });
      });
    }

    return list;
  }, [
    resume, format, contactItems, bulletSymbol, 
    fontClass, fontSizeClass, lineHeightClass, marginPaddingClass, 
    sectionSpacingClass, nameSizeClass, nameBoldClass, 
    jobTitleWeightClass, companyWeightClass, datesWeightClass
  ]);

  // Measuring container ref and pagination state
  const measureContainerRef = useRef(null);
  const [pages, setPages] = useState(() => [itemsList.map(it => it.id)]);

  useLayoutEffect(() => {
    if (!measureContainerRef.current) return;
    const container = measureContainerRef.current;
    const children = Array.from(container.children);
    if (!children.length) return;

    // A4 dimensions at 820px width: 1160px height
    const A4_HEIGHT = 1160;
    const paddingMap = {
      compact: 48,
      normal: 72,
      relaxed: 96,
      spacious: 120
    };
    const totalPadding = paddingMap[format.pageMargin] || 72;
    const footerBuffer = 50; // space for bottom footer page label
    const pageCapacity = A4_HEIGHT - totalPadding - footerBuffer; // ~1038px

    const computedPages = [[]];
    let currentHeight = 0;

    children.forEach((child) => {
      const itemId = child.getAttribute('data-item-id');
      const h = child.offsetHeight;

      // If adding this item exceeds pageCapacity and current page already has content:
      if (currentHeight + h > pageCapacity && currentHeight > 0) {
        computedPages.push([itemId]);
        currentHeight = h;
      } else {
        computedPages[computedPages.length - 1].push(itemId);
        currentHeight += h;
      }
    });

    setPages(prevPages => {
      const isSame = prevPages.length === computedPages.length &&
        prevPages.every((p, i) => 
          p.length === computedPages[i].length && 
          p.every((id, j) => id === computedPages[i][j])
        );
      return isSame ? prevPages : computedPages;
    });
  }, [
    itemsList, format.pageMargin, format.fontSize, 
    format.fontFamily, format.lineHeight, format.sectionSpacing
  ]);

  if (!resume) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white border border-slate-200 rounded-2xl items-center justify-center text-slate-400 text-sm shadow-xs">
        No resume selected.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Toolbar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 gap-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-[#5CB338]" />
            Resume View
          </span>

          {/* Ratio / Zoom Toggle Controls */}
          {onChangeLayoutRatio && (
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-300 shadow-2xs">
              <button
                type="button"
                onClick={() => onChangeLayoutRatio('focus-editor')}
                title="Zoom Out Resume View: 2/3 Details | 1/3 Resume View"
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  layoutRatio === 'focus-editor'
                    ? 'bg-[#5CB338] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">1/3 View</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeLayoutRatio('balanced')}
                title="Equal Split: 1/2 Details | 1/2 Resume View"
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  layoutRatio === 'balanced'
                    ? 'bg-[#5CB338] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">1/2</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeLayoutRatio('focus-preview')}
                title="Zoom In Resume View: 1/3 Details | 2/3 Resume View"
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  layoutRatio === 'focus-preview'
                    ? 'bg-[#5CB338] text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">2/3 View</span>
              </button>
            </div>
          )}

          {/* Quick Style Template Selector */}
          <div className="hidden sm:flex items-center bg-white rounded-lg p-0.5 border border-slate-300 shadow-2xs text-[11px]">
            {[
              { id: 'classic', label: 'Classic' },
              { id: 'modern', label: 'Modern' },
              { id: 'minimal', label: 'Minimal' }
            ].map(tpl => {
              const isActive = currentTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  style={isActive ? { backgroundColor: format.accentColor || '#5CB338' } : {}}
                  className={`px-2.5 py-0.5 rounded font-semibold transition cursor-pointer ${
                    isActive 
                      ? 'text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={`Switch to ${tpl.label} template`}
                >
                  {tpl.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          {exportMessage && (
            <span className="text-[11px] font-semibold text-[#3f8325] flex items-center gap-1 bg-[#5CB338]/10 px-2 py-1 rounded-md border border-[#5CB338]/30">
              <Check className="w-3.5 h-3.5 text-[#5CB338]" />
              {exportMessage}
            </span>
          )}

          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={exportingType !== null}
            className="px-3 py-1.5 bg-[#5CB338] hover:bg-[#4ea02e] disabled:opacity-60 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="Choose folder location and save PDF document"
          >
            {exportingType === 'pdf' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportingType === 'pdf' ? 'Preparing...' : 'PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('docx')}
            disabled={exportingType !== null}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 shadow-2xs transition cursor-pointer"
            title="Choose folder location and save Word document"
          >
            {exportingType === 'docx' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span>{exportingType === 'docx' ? 'Preparing...' : 'Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Hidden measuring container for exact A4 pagination */}
      <div 
        ref={measureContainerRef}
        style={{ position: 'absolute', top: 0, left: '-9999px', width: '820px', visibility: 'hidden', pointerEvents: 'none' }}
        className={`${fontClass} ${fontSizeClass} ${lineHeightClass} ${marginPaddingClass}`}
        aria-hidden="true"
      >
        {itemsList.map(item => (
          <div key={item.id} data-item-id={item.id}>
            {item.render(true)}
          </div>
        ))}
      </div>

      {/* Document Viewport (Paper Simulation with A4 Page Sheets) */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100/70 min-h-0">
        <div className="min-w-fit mx-auto flex flex-col items-center gap-6 pb-12">
          {pages.map((pageItemIds, pageIdx) => {
            const seenSectionTypesOnThisPage = new Set();

            return (
              <div key={pageIdx} className="flex flex-col items-center">
                {/* A4 Page Sheet */}
                <div 
                  className={`w-[820px] min-w-[820px] max-w-[820px] bg-white text-slate-900 shadow-md border border-slate-200 transition-all rounded-xs min-h-[1160px] flex flex-col justify-between ${fontClass} ${fontSizeClass} ${lineHeightClass} ${marginPaddingClass}`}
                >
                  <div className="space-y-0">
                    {pageItemIds.map(itemId => {
                      const item = itemsList.find(it => it.id === itemId);
                      if (!item) return null;

                      const showHeading = !seenSectionTypesOnThisPage.has(item.type);
                      seenSectionTypesOnThisPage.add(item.type);

                      return (
                        <div key={itemId}>
                          {item.render(showHeading)}
                        </div>
                      );
                    })}
                  </div>

                  {/* Clean Page Footer */}
                  <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-slate-400 font-medium select-none border-t border-slate-100">
                    <span>{resume.fullName || 'Resume'}</span>
                    <span>Page {pageIdx + 1} of {pages.length}</span>
                  </div>
                </div>

                {/* Visual Page Break Separator between sheets */}
                {pageIdx < pages.length - 1 && (
                  <div className="my-6 w-[820px] h-px bg-slate-300 select-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
