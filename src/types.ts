export type Language = 'id' | 'en' | 'zh' | 'ru';

export interface LanguageOption {
  code: Language;
  label: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface NodeExperience {
  id: string;
  name: string;
  tagline: string;
  logoText: string;
  role: string;
  period: string;
  status: 'Active' | 'Synchronized' | 'Mainnet Ready';
  badgeColor: string;
  networkType: string;
  description: string;
  keyResponsibilities: string[];
  metrics: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  techStack: string[];
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    network: string;
  };
  link?: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: string;
    description: string;
  }[];
}

export interface MilestoneItem {
  id: string;
  year: string;
  period: string;
  title: string;
  role: string;
  network?: string;
  badgeColor?: string;
  description: string;
  achievements: string[];
  metrics?: { label: string; value: string }[];
  isCurrent?: boolean;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  node: string;
  type: 'info' | 'success' | 'warning';
  message: string;
}

