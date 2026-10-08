export const DEFAULT_FORMATTING = {
  // Font Family
  fontFamily: 'times', // 'times' | 'inter' | 'roboto' | 'georgia' | 'garamond' | 'merriweather' | 'arial' | 'calibri' | 'lato' | 'opensans' | 'poppins' | 'montserrat' | 'playfair' | 'jetbrains' | etc.
  
  // Font Size
  fontSize: 'normal', // 'compact-2xs' to 'large-xl'
  nameSize: 'large', // 'compact-sm' to '3xl'
  headingSize: 'normal', // 'compact-xs' to 'xl'
  
  // Margins & Spacing
  pageMargin: 'normal', // 'compact' (18px) | 'normal' (36px) | 'relaxed' (50px) | 'spacious' (64px)
  lineHeight: 'normal', // 'tight' (1.3) | 'normal' (1.5) | 'relaxed' (1.7)
  sectionSpacing: 'normal', // 'compact' (12px) | 'normal' (20px) | 'relaxed' (28px)
  
  // Border Lines & Section Dividers
  dividerStyle: 'solid', // 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient' | 'none'
  dividerThickness: '1px', // '1px' | '2px' | '3px' | '4px'
  dividerColor: '#334155', // default classic charcoal slate divider
  accentColor: '#1e293b', // classic accent color
  linkColor: '#2563eb', // link color
  headerDivider: true, // line under contact info
  sectionDividers: true, // lines under section titles
  
  // Bold Font Options
  nameBold: 'bold', // 'normal' | 'bold' | 'extra'
  headingBold: 'bold', // 'normal' | 'semibold' | 'bold' | 'black'
  jobTitleBold: 'bold', // 'normal' | 'semibold' | 'bold'
  companyBold: 'semibold', // 'normal' | 'medium' | 'semibold'
  datesBold: 'normal', // 'normal' | 'medium' | 'semibold'
  
  // Typical extras
  headingCase: 'uppercase', // 'uppercase' | 'capitalize' | 'normal'
  headingStyle: 'underline', // 'underline' | 'bar' | 'pill' | 'clean'
  bulletStyle: 'disc', // 'disc' | 'dash' | 'arrow' | 'square' | 'dot'
  headerAlignment: 'center', // 'center' | 'left' | 'split'
  template: 'classic', // 'classic' | 'modern' | 'minimal'
};

export const COLOR_SCHEMES = [
  { id: 'forest', name: 'Forest Green', hex: '#5CB338', accent: '#5CB338', divider: '#5CB338', link: '#4ea02e', desc: 'Modern Tech Standard' },
  { id: 'royal', name: 'Royal Blue', hex: '#2563eb', accent: '#2563eb', divider: '#2563eb', link: '#1d4ed8', desc: 'Corporate Tech & Finance' },
  { id: 'slate', name: 'Charcoal Slate', hex: '#334155', accent: '#334155', divider: '#334155', link: '#2563eb', desc: 'Corporate Standard' },
  { id: 'emerald', name: 'Emerald Teal', hex: '#059669', accent: '#059669', divider: '#059669', link: '#047857', desc: 'Clean Modern Engineering' },
  { id: 'indigo', name: 'Modern Indigo', hex: '#4f46e5', accent: '#4f46e5', divider: '#4f46e5', link: '#4338ca', desc: 'Sleek Full-Stack Modern' },
  { id: 'crimson', name: 'Wine Crimson', hex: '#dc2626', accent: '#dc2626', divider: '#dc2626', link: '#b91c1c', desc: 'Executive & Leadership' },
  { id: 'amber', name: 'Amber Bronze', hex: '#d97706', accent: '#d97706', divider: '#d97706', link: '#b45309', desc: 'Warm Consulting & Business' },
  { id: 'teal', name: 'Cyber Teal', hex: '#0d9488', accent: '#0d9488', divider: '#0d9488', link: '#0f766e', desc: 'Data & Cloud Infrastructure' },
  { id: 'violet', name: 'Deep Violet', hex: '#7c3aed', accent: '#7c3aed', divider: '#7c3aed', link: '#6d28d9', desc: 'Creative Portfolio' },
  { id: 'midnight', name: 'Midnight Navy', hex: '#0f172a', accent: '#0f172a', divider: '#334155', link: '#2563eb', desc: 'High-Contrast Minimal' },
];

export const FONT_SIZE_OPTIONS = [
  { id: 'compact-2xs', label: '9 px' },
  { id: 'compact-xs', label: '10 px' },
  { id: 'compact-sm', label: '10.5 px' },
  { id: 'compact-md', label: '11 px' },
  { id: 'compact', label: '11.5 px' },
  { id: 'normal-sm', label: '12 px' },
  { id: 'normal', label: '12.5 px' },
  { id: 'medium-sm', label: '13 px' },
  { id: 'medium', label: '13.5 px' },
  { id: 'medium-lg', label: '14 px' },
  { id: 'large-sm', label: '14.5 px' },
  { id: 'large', label: '15 px' },
  { id: 'large-xl', label: '16 px' },
];

export const NAME_SIZE_OPTIONS = [
  { id: 'compact-sm', label: '18 px' },
  { id: 'compact', label: '20 px' },
  { id: 'normal-sm', label: '22 px' },
  { id: 'normal', label: '24 px' },
  { id: 'large-sm', label: '26 px' },
  { id: 'large', label: '28 px' },
  { id: 'xl-sm', label: '32 px' },
  { id: 'xl', label: '36 px' },
  { id: '2xl', label: '40 px' },
  { id: '3xl', label: '44 px' },
];

export const HEADING_SIZE_OPTIONS = [
  { id: 'compact-xs', label: '10 px' },
  { id: 'compact-sm', label: '10.5 px' },
  { id: 'compact', label: '11 px' },
  { id: 'normal-sm', label: '11.5 px' },
  { id: 'normal', label: '12.5 px' },
  { id: 'medium-sm', label: '13 px' },
  { id: 'medium', label: '14 px' },
  { id: 'large-sm', label: '15 px' },
  { id: 'large', label: '16 px' },
  { id: 'xl-sm', label: '17 px' },
  { id: 'xl', label: '18 px' },
];

export const PAGE_MARGIN_OPTIONS = [
  { id: 'compact', label: '0.25 inch' },
  { id: 'normal', label: '0.50 inch' },
  { id: 'relaxed', label: '0.75 inch' },
  { id: 'spacious', label: '1.00 inch' },
];

export const HEADER_ALIGNMENT_OPTIONS = [
  { id: 'center', label: 'Centered' },
  { id: 'left', label: 'Left Aligned' },
  { id: 'split', label: 'Split 2-Column' },
];

export const TEMPLATE_PRESETS = {
  classic: {
    id: 'classic',
    name: 'Classic',
    settings: {
      fontFamily: 'times',
      fontSize: 'normal',
      nameSize: 'large',
      headingSize: 'normal',
      pageMargin: 'normal',
      lineHeight: 'normal',
      sectionSpacing: 'normal',
      dividerStyle: 'solid',
      dividerThickness: '1px',
      dividerColor: '#334155',
      accentColor: '#1e293b',
      linkColor: '#2563eb',
      headerDivider: true,
      sectionDividers: true,
      nameBold: 'bold',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      datesBold: 'normal',
      headerAlignment: 'center',
      headingStyle: 'underline',
      headingCase: 'uppercase',
      bulletStyle: 'disc',
      template: 'classic'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    settings: {
      fontFamily: 'inter',
      fontSize: 'normal',
      nameSize: 'large',
      headingSize: 'normal',
      pageMargin: 'normal',
      lineHeight: 'normal',
      sectionSpacing: 'normal',
      dividerStyle: 'solid',
      dividerThickness: '1px',
      dividerColor: '#5CB338',
      accentColor: '#5CB338',
      linkColor: '#4ea02e',
      headerDivider: true,
      sectionDividers: true,
      nameBold: 'extra',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      datesBold: 'normal',
      headerAlignment: 'left',
      headingStyle: 'bar',
      headingCase: 'uppercase',
      bulletStyle: 'arrow',
      template: 'modern'
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    settings: {
      fontFamily: 'roboto',
      fontSize: 'normal',
      nameSize: 'large',
      headingSize: 'normal',
      pageMargin: 'normal',
      lineHeight: 'relaxed',
      sectionSpacing: 'relaxed',
      dividerStyle: 'none',
      dividerThickness: '1px',
      dividerColor: '#e2e8f0',
      accentColor: '#334155',
      linkColor: '#2563eb',
      headerDivider: false,
      sectionDividers: false,
      nameBold: 'bold',
      headingBold: 'semibold',
      jobTitleBold: 'semibold',
      companyBold: 'normal',
      datesBold: 'normal',
      headerAlignment: 'left',
      headingStyle: 'clean',
      headingCase: 'uppercase',
      bulletStyle: 'dot',
      template: 'minimal'
    }
  }
};

// Clean presets with NO emojis
export const STYLE_PRESETS = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    badge: 'Tech Standard',
    desc: 'Clean Inter, vibrant green accents, solid thin lines',
    settings: {
      fontFamily: 'inter',
      fontSize: 'normal',
      nameSize: 'large',
      pageMargin: 'normal',
      dividerStyle: 'solid',
      dividerThickness: '1px',
      dividerColor: '#5CB338',
      accentColor: '#4ea02e',
      nameBold: 'extra',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      headerAlignment: 'left',
      headingStyle: 'bar',
      headingCase: 'uppercase',
      bulletStyle: 'arrow'
    }
  },
  {
    id: 'executive-times',
    name: 'Times New Roman Executive',
    badge: 'Legal & Corporate',
    desc: 'Classic Times New Roman serif with formal double line dividers',
    settings: {
      fontFamily: 'times',
      fontSize: 'normal',
      nameSize: 'large',
      pageMargin: 'normal',
      dividerStyle: 'solid',
      dividerThickness: '1px',
      dividerColor: '#334155',
      accentColor: '#0f172a',
      nameBold: 'bold',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      headerAlignment: 'center',
      headingStyle: 'underline',
      headingCase: 'uppercase',
      bulletStyle: 'disc'
    }
  },
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    badge: 'Executive',
    desc: 'Distinguished Merriweather Serif, charcoal double border',
    settings: {
      fontFamily: 'merriweather',
      fontSize: 'normal',
      nameSize: 'large',
      pageMargin: 'relaxed',
      dividerStyle: 'double',
      dividerThickness: '3px',
      dividerColor: '#334155',
      accentColor: '#1e293b',
      nameBold: 'bold',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      headerAlignment: 'center',
      headingStyle: 'underline',
      headingCase: 'uppercase',
      bulletStyle: 'disc'
    }
  },
  {
    id: 'ats-gold',
    name: 'ATS Clean Standard',
    badge: 'ATS Gold',
    desc: 'Zero-friction standard formatting optimized for scanners',
    settings: {
      fontFamily: 'roboto',
      fontSize: 'normal',
      nameSize: 'normal',
      pageMargin: 'normal',
      dividerStyle: 'solid',
      dividerThickness: '1px',
      dividerColor: '#94a3b8',
      accentColor: '#0f172a',
      nameBold: 'bold',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      headerAlignment: 'center',
      headingStyle: 'underline',
      headingCase: 'uppercase',
      bulletStyle: 'disc'
    }
  },
  {
    id: 'compact-1page',
    name: '1-Page Compact',
    badge: 'Dense 1-Page',
    desc: 'Tight margins & spacing designed to fit dense experience',
    settings: {
      fontFamily: 'lato',
      fontSize: 'compact',
      nameSize: 'normal',
      pageMargin: 'compact',
      lineHeight: 'tight',
      sectionSpacing: 'compact',
      dividerStyle: 'solid',
      dividerThickness: '1px',
      dividerColor: '#cbd5e1',
      accentColor: '#334155',
      nameBold: 'bold',
      headingBold: 'bold',
      jobTitleBold: 'semibold',
      companyBold: 'medium',
      headerAlignment: 'center',
      headingStyle: 'underline',
      headingCase: 'uppercase',
      bulletStyle: 'dash'
    }
  },
  {
    id: 'creative-chic',
    name: 'Creative Luxe',
    badge: 'Design Portfolio',
    desc: 'Playfair Display heading flair with emerald tones',
    settings: {
      fontFamily: 'playfair',
      fontSize: 'normal',
      nameSize: 'xl',
      pageMargin: 'normal',
      dividerStyle: 'dashed',
      dividerThickness: '2px',
      dividerColor: '#059669',
      accentColor: '#047857',
      nameBold: 'extra',
      headingBold: 'bold',
      jobTitleBold: 'bold',
      companyBold: 'semibold',
      headerAlignment: 'left',
      headingStyle: 'pill',
      headingCase: 'capitalize',
      bulletStyle: 'square'
    }
  }
];

export const AVAILABLE_FONTS = [
  // Serif
  { id: 'times', name: 'Times New Roman', preview: 'The quick brown fox jumps over the lazy dog', group: 'Serif', description: 'Classic gold standard for academic, corporate & legal CVs' },
  { id: 'georgia', name: 'Georgia', preview: 'The quick brown fox jumps over the lazy dog', group: 'Serif', description: 'Elegant screen-optimized serif with high legibility' },
  { id: 'garamond', name: 'EB Garamond', preview: 'The quick brown fox jumps over the lazy dog', group: 'Serif', description: 'Timeless humanist serif design with literary flair' },
  { id: 'merriweather', name: 'Merriweather', preview: 'The quick brown fox jumps over the lazy dog', group: 'Serif', description: 'Modern, highly readable editorial serif' },
  { id: 'playfair', name: 'Playfair Display', preview: 'The quick brown fox jumps over the lazy dog', group: 'Serif', description: 'Sophisticated editorial serif with high contrast' },
  { id: 'cambria', name: 'Cambria', preview: 'The quick brown fox jumps over the lazy dog', group: 'Serif', description: 'Clean Microsoft system serif built for reading' },
  
  // Sans-Serif
  { id: 'inter', name: 'Inter', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Modern tech industry gold standard typeface' },
  { id: 'roboto', name: 'Roboto', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Crisp geometric & humanist sans by Google' },
  { id: 'arial', name: 'Arial', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Universal ATS-compliant corporate workhorse' },
  { id: 'calibri', name: 'Calibri', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Friendly modern standard Microsoft sans' },
  { id: 'lato', name: 'Lato', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Warm and professional semi-rounded sans' },
  { id: 'opensans', name: 'Open Sans', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Neutral, open forms optimized for print and web' },
  { id: 'poppins', name: 'Poppins', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Clean geometric sans-serif with contemporary feel' },
  { id: 'montserrat', name: 'Montserrat', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Urban architectural geometric styling' },
  { id: 'trebuchet', name: 'Trebuchet MS', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Distinct personality with open counters' },
  { id: 'verdana', name: 'Verdana', preview: 'The quick brown fox jumps over the lazy dog', group: 'Sans-Serif', description: 'Extremely legible even at very small font sizes' },
  
  // Monospace
  { id: 'jetbrains', name: 'JetBrains Mono', preview: 'The quick brown fox jumps over the lazy dog', group: 'Monospace', description: 'Developer-oriented monospaced font with coding clarity' },
  { id: 'courier', name: 'Courier New', preview: 'The quick brown fox jumps over the lazy dog', group: 'Monospace', description: 'Classic typewriter monospace for technical CVs' },
  { id: 'sourcecode', name: 'Source Code Pro', preview: 'The quick brown fox jumps over the lazy dog', group: 'Monospace', description: 'Clean Adobe monospaced font designed for code' },
];

export function getResumeFormatting(resume) {
  if (!resume) return { ...DEFAULT_FORMATTING };
  
  let current = { ...DEFAULT_FORMATTING };
  if (resume.formatting && typeof resume.formatting === 'object') {
    current = { ...DEFAULT_FORMATTING, ...resume.formatting };
  } else if (resume.formattingJson) {
    try {
      const parsed = JSON.parse(resume.formattingJson);
      current = { ...DEFAULT_FORMATTING, ...parsed };
    } catch {
      // ignore
    }
  }

  if (!current.linkColor) {
    current.linkColor = current.accentColor || '#2563eb';
  }
  
  return current;
}
