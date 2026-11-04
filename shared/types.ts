// Types partagés entre le site public, le tableau de bord et le serveur.

export type Language = 'fr' | 'en';
export type ThemePreference = 'system' | 'light' | 'dark';

/** Texte bilingue. L'anglais est optionnel : s'il est vide, le français est affiché. */
export interface L10n {
  fr: string;
  en: string;
}

export interface L10nList {
  fr: string[];
  en: string[];
}

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  photo: string;
  title: L10n;
  headline: L10n;
  slogan: L10n;
  bio: L10n;
  vision: L10n;
  goals: L10nList;
  location: L10n;
  studyLevel: L10n;
  availability: L10n;
  spokenLanguages: string[];
  email: string;
  phone: string;
  whatsapp: string;
  cvUrl: string;
}

export type SocialIcon =
  | 'github'
  | 'linkedin'
  | 'facebook'
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'whatsapp'
  | 'website';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: SocialIcon;
}

export interface StatItem {
  id: string;
  value: string;
  label: L10n;
}

export type ProjectCategory = 'web' | 'mobile' | 'ai' | 'cloud' | 'db' | 'network' | 'other';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: L10n;
  fullDescription: L10n;
  image: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
}

export interface SkillCategory {
  id: string;
  title: L10n;
  icon: string;
  /** Une compétence par ligne, au format « Nom » ou « Nom | 85 » (niveau en %). */
  skills: string[];
}

export interface Service {
  id: string;
  title: L10n;
  description: L10n;
  icon: string;
  features: L10nList;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
  description: L10n;
}

export type TimelineCategory = 'education' | 'experience' | 'achievement' | 'volunteering' | 'future';

export interface TimelineEvent {
  id: string;
  year: string;
  title: L10n;
  institution: L10n;
  description: L10n;
  category: TimelineCategory;
  skills: string[];
}

export type SectionId =
  | 'about'
  | 'skills'
  | 'services'
  | 'projects'
  | 'timeline'
  | 'certifications'
  | 'stats'
  | 'blog'
  | 'news'
  | 'events'
  | 'gallery'
  | 'documents'
  | 'contact';

export interface SiteSettings {
  sections: Record<SectionId, boolean>;
  defaultTheme: ThemePreference;
  /** Langue proposée aux nouveaux visiteurs (ils peuvent toujours changer). */
  defaultLanguage: Language;
  /** Affiche le badge « Disponible » et le statut dans le terminal. */
  availableForWork: boolean;
  chatEnabled: boolean;
  contactFormEnabled: boolean;
  analyticsEnabled: boolean;
  /** Mode maintenance : le site public affiche un message (l'administrateur connecté voit le site). */
  maintenanceMode: boolean;
  maintenanceMessage: L10n;
  /** Bouton « Espace privé » (connexion) dans le menu du site. */
  showLoginInMenu: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface SiteContent {
  profile: Profile;
  socials: SocialLink[];
  stats: StatItem[];
  projects: Project[];
  skillCategories: SkillCategory[];
  services: Service[];
  certifications: Certification[];
  timeline: TimelineEvent[];
  settings: SiteSettings;
}

export type PostKind = 'article' | 'news';

export interface Post {
  id: string;
  slug: string;
  kind: PostKind;
  title: L10n;
  excerpt: L10n;
  /** Contenu en Markdown. */
  content: L10n;
  image: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Version allégée renvoyée dans les listes publiques (sans le contenu complet). */
export type PostSummary = Omit<Post, 'content'> & { readingMinutes: number };

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ------------------------------------------------------------------
// Contenus publiés depuis le tableau de bord : événements, galerie, documents
// ------------------------------------------------------------------

export type ItemType = 'event' | 'album' | 'document';

interface ItemBase {
  id: string;
  title: L10n;
  description: L10n;
  published: boolean;
  /** Date principale (AAAA-MM-JJ) : date de l'événement, de l'album ou du document. */
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type EventKind = 'conference' | 'training' | 'hackathon' | 'meetup' | 'volunteering' | 'other';

export interface EventItem extends ItemBase {
  type: 'event';
  kind: EventKind;
  endDate: string;
  time: string;
  location: string;
  online: boolean;
  link: string;
  image: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface AlbumItem extends ItemBase {
  type: 'album';
  cover: string;
  images: GalleryImage[];
}

export type DocumentCategory = 'cv' | 'report' | 'thesis' | 'certificate' | 'presentation' | 'other';

export interface DocumentItem extends ItemBase {
  type: 'document';
  category: DocumentCategory;
  fileUrl: string;
  fileName: string;
}

export type ContentItem = EventItem | AlbumItem | DocumentItem;

export interface PublicContentResponse {
  site: SiteContent;
  posts: PostSummary[];
  events: EventItem[];
  albums: AlbumItem[];
  documents: DocumentItem[];
}
