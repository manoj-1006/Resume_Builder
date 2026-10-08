import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

function Link45degIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 16 16" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243z"/>
    </svg>
  );
}

function LinkInputField({
  label,
  textValue,
  urlValue,
  onTextChange,
  onOpenLinkModal,
  placeholder,
  fallbackText
}) {
  const hasUrl = Boolean(urlValue && urlValue.trim());

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-semibold text-slate-700">{label}</label>
        {hasUrl && (
          <span 
            className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 truncate max-w-[150px]"
            title={urlValue}
          >
            <Check className="w-3 h-3 text-[#5CB338]" />
            Linked
          </span>
        )}
      </div>
      <div className="relative flex items-center">
        <input
          type="text"
          value={textValue ?? ''}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder || fallbackText}
          className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
        />
        <button
          type="button"
          onClick={onOpenLinkModal}
          title={hasUrl ? `Active Link: ${urlValue} (Click to edit/remove)` : 'Click to add link URL'}
          className={`absolute right-1.5 p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
            hasUrl
              ? 'bg-[#5CB338] hover:bg-[#4ea02e] text-white shadow-2xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <Link45degIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ContactLinkModal({
  isOpen,
  onClose,
  title,
  platform,
  currentUrl,
  onSave,
  onRemove
}) {
  const [url, setUrl] = useState(currentUrl || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(url.trim());
    onClose();
  };

  const handleRemove = () => {
    if (onRemove) onRemove();
    onClose();
  };

  const getPlaceholder = () => {
    if (platform === 'linkedin') return 'https://www.linkedin.com/in/your-profile';
    if (platform === 'github') return 'https://github.com/your-username';
    return 'https://yourwebsite.com';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden p-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Link45degIcon className="w-4 h-4 text-[#5CB338]" />
            {title || 'Add Link'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Link URL
            </label>
            <input
              type="text"
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs transition"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {currentUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  Remove Link
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{currentUrl ? 'Save Link' : 'Add Link'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PersonalInfoForm({ resume, onChange, isCompact }) {
  const [linkModalState, setLinkModalState] = useState({
    isOpen: false,
    platform: '',
    title: '',
    urlKey: '',
    altUrlKey: null,
    textKey: '',
    altTextKey: null,
    currentUrl: '',
    fallbackText: ''
  });

  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const openLinkModal = (platform) => {
    if (platform === 'linkedin') {
      setLinkModalState({
        isOpen: true,
        platform: 'linkedin',
        title: 'Add LinkedIn Link',
        urlKey: 'linkedInUrl',
        altUrlKey: 'linkedinUrl',
        textKey: 'linkedInText',
        altTextKey: 'linkedinText',
        currentUrl: resume.linkedInUrl || resume.linkedinUrl || '',
        fallbackText: 'LinkedIn'
      });
    } else if (platform === 'github') {
      setLinkModalState({
        isOpen: true,
        platform: 'github',
        title: 'Add GitHub Link',
        urlKey: 'gitHubUrl',
        altUrlKey: 'githubUrl',
        textKey: 'gitHubText',
        altTextKey: 'githubText',
        currentUrl: resume.gitHubUrl || resume.githubUrl || '',
        fallbackText: 'GitHub'
      });
    } else if (platform === 'portfolio') {
      setLinkModalState({
        isOpen: true,
        platform: 'portfolio',
        title: 'Add Website / Portfolio Link',
        urlKey: 'portfolioUrl',
        altUrlKey: null,
        textKey: 'portfolioText',
        altTextKey: null,
        currentUrl: resume.portfolioUrl || '',
        fallbackText: 'Portfolio'
      });
    }
  };

  const handleSaveContactLink = (newUrl) => {
    if (!linkModalState.urlKey) return;
    const updated = { ...resume, [linkModalState.urlKey]: newUrl };
    if (linkModalState.altUrlKey) {
      updated[linkModalState.altUrlKey] = newUrl;
    }
    const currentText = resume[linkModalState.textKey] || (linkModalState.altTextKey ? resume[linkModalState.altTextKey] : '');
    if (!currentText && newUrl) {
      updated[linkModalState.textKey] = linkModalState.fallbackText;
      if (linkModalState.altTextKey) {
        updated[linkModalState.altTextKey] = linkModalState.fallbackText;
      }
    }
    onChange(updated);
  };

  const handleRemoveContactLink = () => {
    if (!linkModalState.urlKey) return;
    const updated = { ...resume, [linkModalState.urlKey]: '' };
    if (linkModalState.altUrlKey) {
      updated[linkModalState.altUrlKey] = '';
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className={isCompact ? 'grid grid-cols-1 gap-3.5' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={resume.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="Jane Doe"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
          <input
            type="text"
            value={resume.targetRole || ''}
            onChange={(e) => updateField('targetRole', e.target.value)}
            placeholder="Senior Full Stack Software Engineer"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={resume.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="jane.doe@example.com"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={resume.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
          <input
            type="text"
            value={resume.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="New York, NY (Open to Remote)"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
        
        {/* GitHub Link */}
        <LinkInputField
          label="GitHub Link / URL"
          textValue={resume.gitHubText || resume.githubText || ''}
          urlValue={resume.gitHubUrl || resume.githubUrl || ''}
          onTextChange={(val) => {
            const updated = { ...resume, gitHubText: val, githubText: val };
            onChange(updated);
          }}
          onOpenLinkModal={() => openLinkModal('github')}
          placeholder="GitHub"
          fallbackText="GitHub"
        />

        {/* LinkedIn Link */}
        <LinkInputField
          label="LinkedIn Link / URL"
          textValue={resume.linkedInText || resume.linkedinText || ''}
          urlValue={resume.linkedInUrl || resume.linkedinUrl || ''}
          onTextChange={(val) => {
            const updated = { ...resume, linkedInText: val, linkedinText: val };
            onChange(updated);
          }}
          onOpenLinkModal={() => openLinkModal('linkedin')}
          placeholder="LinkedIn"
          fallbackText="LinkedIn"
        />

        {/* Personal Website / Portfolio */}
        <LinkInputField
          label="Website Link / URL"
          textValue={resume.portfolioText || ''}
          urlValue={resume.portfolioUrl || ''}
          onTextChange={(val) => updateField('portfolioText', val)}
          onOpenLinkModal={() => openLinkModal('portfolio')}
          placeholder="Portfolio"
          fallbackText="Portfolio"
        />
      </div>

      <ContactLinkModal
        isOpen={linkModalState.isOpen}
        onClose={() => setLinkModalState(prev => ({ ...prev, isOpen: false }))}
        title={linkModalState.title}
        platform={linkModalState.platform}
        currentUrl={linkModalState.currentUrl}
        onSave={handleSaveContactLink}
        onRemove={handleRemoveContactLink}
      />
    </div>
  );
}
