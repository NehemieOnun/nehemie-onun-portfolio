export type Language = 'fr' | 'en';
export type Theme = 'dark' | 'light';

export interface Project {
  id: string;
  title: string;
  category: 'web' | 'mobile' | 'ai' | 'cloud' | 'db';
  description: Record<Language, string>;
  fullDescription: Record<Language, string>;
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  metrics?: { label: Record<Language, string>; value: string }[];
}

export interface SkillCategory {
  id: string;
  title: Record<Language, string>;
  icon: string;
  skills: {
    name: string;
    level: number; // 0 to 100
    icon?: string;
    description?: Record<Language, string>;
    isFavorite?: boolean;
  }[];
}

export interface Service {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  features: Record<Language, string[]>;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  category: 'tech' | 'management' | 'international' | 'digital';
  skills: string[];
  description: Record<Language, string>;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: Record<Language, string>;
  institution: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  category: 'education' | 'experience' | 'achievement' | 'future';
  skills?: string[];
}

export interface BlogPost {
  id: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

export interface StatItem {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: Record<Language, string>;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
