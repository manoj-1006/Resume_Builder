import React, { useState, useMemo } from 'react';
import { 
  Type, Maximize2, Palette, Sparkles, 
  RotateCcw, Sliders, Check, Bold, Grid, Layers, Search, X, ChevronDown
} from 'lucide-react';
import { 
  DEFAULT_FORMATTING, STYLE_PRESETS, AVAILABLE_FONTS, getResumeFormatting,
  FONT_SIZE_OPTIONS, NAME_SIZE_OPTIONS, HEADING_SIZE_OPTIONS,
  PAGE_MARGIN_OPTIONS, HEADER_ALIGNMENT_OPTIONS
} from '../utils/formatting';

export default function AdvancedSettingsTab({ resume, onChange, layoutRatio = 'balanced' }) {
  const currentFormat = getResumeFormatting(resume);
  const isCompact = layoutRatio === 'focus-preview';
  const [fontSearch, setFontSearch] = useState('');
  const [selectedFontGroup, setSelectedFontGroup] = useState('All');

  const currentFontSizeOpt = FONT_SIZE_OPTIONS.find(o => o.id === currentFormat.fontSize) || FONT_SIZE_OPTIONS.find(o => o.id === 'normal');
  const currentNameSizeOpt = NAME_SIZE_OPTIONS.find(o => o.id === currentFormat.nameSize) || NAME_SIZE_OPTIONS.find(o => o.id === 'large');
  const currentHeadingSizeOpt = HEADING_SIZE_OPTIONS.find(o => o.id === currentFormat.headingSize) || HEADING_SIZE_OPTIONS.find(o => o.id === 'normal');
  const currentMarginOpt = PAGE_MARGIN_OPTIONS.find(o => o.id === currentFormat.pageMargin) || PAGE_MARGIN_OPTIONS[1];
  const currentHeaderAlignOpt = HEADER_ALIGNMENT_OPTIONS.find(o => o.id === currentFormat.headerAlignment) || HEADER_ALIGNMENT_OPTIONS[0];

  const updateSetting = (key, value) => {
    const updated = {
      ...currentFormat,
      [key]: value
    };
    
    onChange({
      ...resume,
      formatting: updated,
      formattingJson: JSON.stringify(updated)
    });
  };

  const updateThemeColor = (color) => {
    const updated = {
      ...currentFormat,
      dividerColor: color,
      accentColor: color,
    };

    onChange({
      ...resume,
      formatting: updated,
      formattingJson: JSON.stringify(updated)
    });
  };

  const applyPreset = (preset) => {
    const updated = {
      ...currentFormat,
      ...preset.settings
    };

    onChange({
      ...resume,
      formatting: updated,
      formattingJson: JSON.stringify(updated)
    });
  };

  const resetDefaults = () => {
    onChange({
      ...resume,
      formatting: { ...DEFAULT_FORMATTING },
      formattingJson: JSON.stringify(DEFAULT_FORMATTING)
    });
  };

  // Filtered fonts based on search query and group
  const filteredFonts = useMemo(() => {
    return AVAILABLE_FONTS.filter(font => {
      const matchesGroup = selectedFontGroup === 'All' || font.group === selectedFontGroup;
      const q = fontSearch.toLowerCase().trim();
      const matchesSearch = !q || 
        font.name.toLowerCase().includes(q) || 
        font.group.toLowerCase().includes(q) || 
        (font.description && font.description.toLowerCase().includes(q)) ||
        font.id.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [fontSearch, selectedFontGroup]);

  const colorPalette = [
    { label: 'Slate Gray', hex: '#cbd5e1' },
    { label: 'Deep Charcoal', hex: '#334155' },
    { label: 'Forest Green', hex: '#5CB338' },
    { label: 'Royal Blue', hex: '#2563eb' },
    { label: 'Emerald Green', hex: '#059669' },
    { label: 'Wine Crimson', hex: '#dc2626' },
    { label: 'Amber Gold', hex: '#d97706' },
    { label: 'Dark Midnight', hex: '#0f172a' },
  ];

  return (
    <div className="space-y-7 pb-10 text-slate-800">
      
      {/* Top Banner / Reset */}
      <div className={`p-4 bg-gradient-to-r from-[#5CB338]/10 via-white to-slate-50 border border-[#5CB338]/25 rounded-xl ${
        isCompact ? 'flex flex-col gap-3' : 'flex flex-wrap items-center justify-between gap-3'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5CB338] text-white rounded-lg shadow-2xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Advanced Resume Typography & Styling</h2>
            <p className="text-xs text-slate-500">Changes reflect instantly in the live Resume View on the right.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition ${
            isCompact ? 'w-full justify-center' : ''
          }`}
          title="Reset all design settings to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Defaults
        </button>
      </div>

      {/* SECTION 0: 1-Click Style Presets (Clean, NO EMOJIS) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5CB338]" />
          Style Presets
        </label>
        <div className={isCompact ? 'grid grid-cols-1 gap-2.5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5'}>
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#5CB338] hover:shadow-xs transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-[#5CB338] transition">
                  {preset.name}
                </span>
                <span className="text-[10px] font-semibold text-[#3f8325] bg-[#5CB338]/10 border border-[#5CB338]/20 px-2 py-0.5 rounded-full">
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Font Style (Typography) with Search & Times New Roman */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#5CB338]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Font Family & Typography
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {AVAILABLE_FONTS.length} professional ATS-approved typefaces
          </span>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={fontSearch}
              onChange={(e) => setFontSearch(e.target.value)}
              placeholder="Search fonts (e.g. Times New Roman, Roboto, Garamond...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338]/30 focus:bg-white transition"
            />
            {fontSearch && (
              <button
                type="button"
                onClick={() => setFontSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
            {['All', 'Serif', 'Sans-Serif', 'Monospace'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFontGroup(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  selectedFontGroup === cat 
                    ? 'bg-white text-[#3f8325] font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Font Cards Grid */}
        <div className={isCompact ? 'grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1' : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1'}>
          {filteredFonts.length > 0 ? (
            filteredFonts.map((font) => {
              const isSelected = currentFormat.fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => updateSetting('fontFamily', font.id)}
                  className={`p-3 rounded-xl border text-left transition flex items-start justify-between ${
                    isSelected 
                      ? 'border-[#5CB338] bg-[#5CB338]/5 ring-1 ring-[#5CB338]/30' 
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{font.name}</span>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.2 bg-slate-100 rounded">
                        {font.group}
                      </span>
                    </div>
                    <p className={`text-xs text-slate-700 mt-1 font-${font.id} truncate max-w-[260px]`}>
                      {font.preview}
                    </p>
                    {font.description && (
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {font.description}
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#5CB338] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
              No fonts matched "<span className="font-semibold text-slate-600">{fontSearch}</span>". Try another search keyword.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Font Sizes & Scale */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#5CB338]">aA</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Font Size & Scale
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Fine-tune hierarchy with granular size variety</span>
        </div>

        <div className={isCompact ? 'grid grid-cols-1 gap-3.5' : 'grid grid-cols-1 sm:grid-cols-3 gap-4'}>
          {/* Body Text Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Body Text Size</span>
              <span className="text-[#3f8325] font-bold font-mono text-[11px] px-1.5 py-0.5 bg-[#5CB338]/10 border border-[#5CB338]/30 rounded">
                {currentFontSizeOpt?.label || currentFormat.fontSize}
              </span>
            </label>
            <div className="relative">
              <select
                value={currentFormat.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#5CB338] focus:ring-2 focus:ring-[#5CB338]/20 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 pr-8 transition cursor-pointer outline-none shadow-2xs"
              >
                {FONT_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-slate-800 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Candidate Name Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Full Name Size</span>
              <span className="text-[#3f8325] font-bold font-mono text-[11px] px-1.5 py-0.5 bg-[#5CB338]/10 border border-[#5CB338]/30 rounded">
                {currentNameSizeOpt?.label || currentFormat.nameSize}
              </span>
            </label>
            <div className="relative">
              <select
                value={currentFormat.nameSize}
                onChange={(e) => updateSetting('nameSize', e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#5CB338] focus:ring-2 focus:ring-[#5CB338]/20 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 pr-8 transition cursor-pointer outline-none shadow-2xs"
              >
                {NAME_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-slate-800 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Section Heading Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Headings Size</span>
              <span className="text-[#3f8325] font-bold font-mono text-[11px] px-1.5 py-0.5 bg-[#5CB338]/10 border border-[#5CB338]/30 rounded">
                {currentHeadingSizeOpt?.label || currentFormat.headingSize}
              </span>
            </label>
            <div className="relative">
              <select
                value={currentFormat.headingSize}
                onChange={(e) => updateSetting('headingSize', e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#5CB338] focus:ring-2 focus:ring-[#5CB338]/20 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 pr-8 transition cursor-pointer outline-none shadow-2xs"
              >
                {HEADING_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-slate-800 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Margins & Page Spacing */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-[#5CB338]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Margins & Spacing (Page Density)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Perfect for single-page fitting</span>
        </div>

        <div className={isCompact ? 'grid grid-cols-1 gap-3.5' : 'grid grid-cols-1 sm:grid-cols-3 gap-4'}>
          {/* Page Margins Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Page Margins</span>
              <span className="text-[#3f8325] font-bold font-mono text-[11px] px-1.5 py-0.5 bg-[#5CB338]/10 border border-[#5CB338]/30 rounded">
                {currentMarginOpt?.label || currentFormat.pageMargin}
              </span>
            </label>
            <div className="relative">
              <select
                value={currentFormat.pageMargin}
                onChange={(e) => updateSetting('pageMargin', e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#5CB338] focus:ring-2 focus:ring-[#5CB338]/20 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 pr-8 transition cursor-pointer outline-none shadow-2xs"
              >
                {PAGE_MARGIN_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-slate-800 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Section Gap / Spacing */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>Section Gap</span>
              <span className="text-[#3f8325] font-bold text-[10px] uppercase">{currentFormat.sectionSpacing}</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'compact', label: 'Tight' },
                { id: 'normal', label: 'Balanced' },
                { id: 'relaxed', label: 'Spacious' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('sectionSpacing', opt.id)}
                  className={`py-1 text-center rounded text-xs font-medium transition ${
                    currentFormat.sectionSpacing === opt.id
                      ? 'bg-[#5CB338] text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height / Leading */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>Line Height</span>
              <span className="text-[#3f8325] font-bold text-[10px] uppercase">{currentFormat.lineHeight}</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'tight', label: 'Compact' },
                { id: 'normal', label: 'Normal' },
                { id: 'relaxed', label: 'Relaxed' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('lineHeight', opt.id)}
                  className={`py-1 text-center rounded text-xs font-medium transition ${
                    currentFormat.lineHeight === opt.id
                      ? 'bg-[#5CB338] text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Line Color & Border Style */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-4 h-4 text-[#5CB338]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Line Color & Border Style
          </h3>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
            <span>Color Scheme / Line Color</span>
            <span className="text-[11px] font-mono text-slate-500">{currentFormat.dividerColor || currentFormat.accentColor || '#334155'}</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {colorPalette.map(color => (
              <button
                key={color.hex}
                type="button"
                onClick={() => updateThemeColor(color.hex)}
                title={color.label}
                className={`w-7 h-7 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center ${
                  (currentFormat.dividerColor || '').toLowerCase() === color.hex.toLowerCase() ||
                  (currentFormat.accentColor || '').toLowerCase() === color.hex.toLowerCase()
                    ? 'ring-2 ring-[#5CB338] ring-offset-2 border-white shadow-xs'
                    : 'border-slate-300'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {((currentFormat.dividerColor || '').toLowerCase() === color.hex.toLowerCase() ||
                  (currentFormat.accentColor || '').toLowerCase() === color.hex.toLowerCase()) && (
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                )}
              </button>
            ))}

            {/* Custom Color Input */}
            <label 
              className="w-7 h-7 rounded-full border-2 border-dashed border-slate-400 hover:border-slate-600 flex items-center justify-center cursor-pointer relative overflow-hidden"
              title="Pick Custom Color"
            >
              <input
                type="color"
                value={currentFormat.dividerColor || currentFormat.accentColor || '#334155'}
                onChange={(e) => updateThemeColor(e.target.value)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
              <Palette className="w-3.5 h-3.5 text-slate-500" />
            </label>
          </div>
        </div>

        {/* Line Style Types */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700">Line Pattern & Type</label>
          <div className={isCompact ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 sm:grid-cols-6 gap-2'}>
            {[
              { id: 'solid', label: 'Solid', borderClass: 'border-solid border-slate-400' },
              { id: 'dashed', label: 'Dashed', borderClass: 'border-dashed border-slate-400' },
              { id: 'dotted', label: 'Dotted', borderClass: 'border-dotted border-slate-400' },
              { id: 'double', label: 'Double', borderClass: 'border-double border-slate-500 border-b-4' },
              { id: 'gradient', label: 'Gradient', borderClass: 'bg-gradient-to-r from-slate-500 via-slate-400 to-transparent h-0.5' },
              { id: 'none', label: 'None', borderClass: 'border-transparent' },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => updateSetting('dividerStyle', type.id)}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-2 ${
                  currentFormat.dividerStyle === type.id
                    ? 'border-[#5CB338] bg-[#5CB338]/10 text-[#3f8325] font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-full ${type.id === 'gradient' ? type.borderClass : `border-b-2 ${type.borderClass}`}`} />
                <span className="text-xs">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Thickness & Placement */}
        <div className={isCompact ? 'grid grid-cols-1 gap-3 pt-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'}>
          {/* Line Thickness */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Line Thickness</label>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: '1px', label: '1px' },
                { id: '2px', label: '2px' },
                { id: '3px', label: '3px' },
                { id: '4px', label: '4px' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('dividerThickness', opt.id)}
                  className={`py-1 text-center rounded text-xs font-medium transition ${
                    currentFormat.dividerThickness === opt.id
                      ? 'bg-[#5CB338] text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider toggles */}
          <div className="space-y-2 pt-1 flex flex-col justify-center text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFormat.headerDivider !== false}
                onChange={(e) => updateSetting('headerDivider', e.target.checked)}
                className="rounded text-[#5CB338] focus:ring-[#5CB338]"
              />
              <span className="text-slate-700 font-medium">Show line under Candidate Header</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFormat.sectionDividers !== false}
                onChange={(e) => updateSetting('sectionDividers', e.target.checked)}
                className="rounded text-[#5CB338] focus:ring-[#5CB338]"
              />
              <span className="text-slate-700 font-medium">Show lines under Section Headings</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 5: Bold Font Hierarchy */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bold className="w-4 h-4 text-[#5CB338]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Bold Font Options & Weights
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Fine-tune weights for key resume elements</span>
        </div>

        <div className={isCompact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5'}>
          {/* Candidate Name Weight */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
            <span className="text-xs font-bold text-slate-800">Candidate Full Name</span>
            <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded border border-slate-200">
              {[
                { id: 'normal', label: 'Medium' },
                { id: 'bold', label: 'Bold' },
                { id: 'extra', label: 'Black' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('nameBold', opt.id)}
                  className={`py-1 text-center rounded text-[11px] font-medium transition ${
                    currentFormat.nameBold === opt.id
                      ? 'bg-[#5CB338] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Headings Weight */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
            <span className="text-xs font-bold text-slate-800">Section Headings</span>
            <div className="grid grid-cols-4 gap-1 bg-white p-0.5 rounded border border-slate-200">
              {[
                { id: 'normal', label: 'Norm' },
                { id: 'semibold', label: 'Semi' },
                { id: 'bold', label: 'Bold' },
                { id: 'black', label: 'Black' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('headingBold', opt.id)}
                  className={`py-1 text-center rounded text-[11px] font-medium transition ${
                    currentFormat.headingBold === opt.id
                      ? 'bg-[#5CB338] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Titles / Roles */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
            <span className="text-xs font-bold text-slate-800">Job Titles / Roles</span>
            <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded border border-slate-200">
              {[
                { id: 'normal', label: 'Normal' },
                { id: 'semibold', label: 'Semi-Bold' },
                { id: 'bold', label: 'Bold' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('jobTitleBold', opt.id)}
                  className={`py-1 text-center rounded text-[11px] font-medium transition ${
                    currentFormat.jobTitleBold === opt.id
                      ? 'bg-[#5CB338] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Company Names */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
            <span className="text-xs font-bold text-slate-800">Company & School Names</span>
            <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded border border-slate-200">
              {[
                { id: 'normal', label: 'Regular' },
                { id: 'medium', label: 'Medium' },
                { id: 'semibold', label: 'Semi-Bold' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('companyBold', opt.id)}
                  className={`py-1 text-center rounded text-[11px] font-medium transition ${
                    currentFormat.companyBold === opt.id
                      ? 'bg-[#5CB338] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Location */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
            <span className="text-xs font-bold text-slate-800">Dates & Locations</span>
            <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded border border-slate-200">
              {[
                { id: 'normal', label: 'Light/Muted' },
                { id: 'medium', label: 'Medium' },
                { id: 'semibold', label: 'Semi-Bold' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('datesBold', opt.id)}
                  className={`py-1 text-center rounded text-[11px] font-medium transition ${
                    currentFormat.datesBold === opt.id
                      ? 'bg-[#5CB338] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Typical Resume Enhancements */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#5CB338]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Header Layout & Bullet Point Options
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Typical ATS & aesthetic enhancements</span>
        </div>

        <div className={isCompact ? 'grid grid-cols-1 gap-3.5' : 'grid grid-cols-1 sm:grid-cols-3 gap-4'}>
          {/* Header Layout Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Header Layout</span>
              <span className="text-[#3f8325] font-bold text-[10px] px-1.5 py-0.5 bg-[#5CB338]/10 border border-[#5CB338]/30 rounded">
                {currentHeaderAlignOpt?.label || currentFormat.headerAlignment}
              </span>
            </label>
            <div className="relative">
              <select
                value={currentFormat.headerAlignment}
                onChange={(e) => updateSetting('headerAlignment', e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#5CB338] focus:ring-2 focus:ring-[#5CB338]/20 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 pr-8 transition cursor-pointer outline-none shadow-2xs"
              >
                {HEADER_ALIGNMENT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-slate-800 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Bullet Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Bullet Style</label>
            <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'disc', symbol: '•' },
                { id: 'dash', symbol: '–' },
                { id: 'arrow', symbol: '▸' },
                { id: 'square', symbol: '▪' },
                { id: 'dot', symbol: '·' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('bulletStyle', opt.id)}
                  className={`py-1 text-center rounded text-xs font-bold transition ${
                    currentFormat.bulletStyle === opt.id
                      ? 'bg-[#5CB338] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Heading Casing */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Heading Casing</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'uppercase', label: 'ALL CAPS' },
                { id: 'capitalize', label: 'Title Case' },
                { id: 'normal', label: 'Standard' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSetting('headingCase', opt.id)}
                  className={`py-1 text-center rounded text-xs font-medium transition ${
                    currentFormat.headingCase === opt.id
                      ? 'bg-[#5CB338] text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Heading Decorative Style */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700">Section Title Visual Accent</label>
          <div className={isCompact ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'grid grid-cols-2 sm:grid-cols-4 gap-2'}>
            {[
              { id: 'underline', label: 'Bottom Divider Line', desc: 'Classic ATS underline' },
              { id: 'bar', label: 'Left Accent Bar', desc: 'Modern colored vertical stripe' },
              { id: 'pill', label: 'Accent Tag / Pill', desc: 'Soft badge background' },
              { id: 'clean', label: 'Minimal Clean', desc: 'Pure text with whitespace' },
            ].map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => updateSetting('headingStyle', style.id)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  currentFormat.headingStyle === style.id
                    ? 'border-[#5CB338] bg-[#5CB338]/10 ring-1 ring-[#5CB338]/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{style.label}</div>
                <div className="text-[10px] text-slate-500">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
