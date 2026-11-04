import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  FileText,
  FolderKanban,
  FolderOpen,
  Images,
  Layers,
  LayoutDashboard,
  LockKeyhole,
  Megaphone,
  Menu,
  Monitor,
  Moon,
  Route,
  Sun,
  UserRound,
  X
} from 'lucide-react';
import { useAdminSession } from '../hooks/useAdminSession';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { onLinkClick, usePath } from '../lib/router';
import type { SectionId, ThemePreference } from '../../shared/types';

const THEME_ORDER: ThemePreference[] = ['light', 'dark', 'system'];

export const ThemeToggle: React.FC = () => {
  const { preference, setPreference } = useTheme();
  const { t } = useLanguage();
  const next = THEME_ORDER[(THEME_ORDER.indexOf(preference) + 1) % THEME_ORDER.length];
  const label =
    preference === 'system'
      ? t('Thème : automatique', 'Theme: automatic')
      : preference === 'light'
        ? t('Thème : clair', 'Theme: light')
        : t('Thème : sombre', 'Theme: dark');
  const Icon = preference === 'system' ? Monitor : preference === 'light' ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      className="btn-ghost grid h-9 w-9 place-items-center rounded-lg"
      aria-label={`${label}. ${t('Cliquer pour changer', 'Click to change')}`}
      title={label}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
};

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="btn-ghost h-9 rounded-lg px-2.5 font-mono text-xs font-semibold"
      aria-label={t('Read in English', 'Lire en français')}
      title={t('Read in English', 'Lire en français')}
    >
      {language === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};

/** Logo NDS (Nehemie Digital Solutions) : version claire et version sombre. */
export const BrandLogo: React.FC<{ variant?: 'mark' | 'full'; className?: string }> = ({ variant = 'mark', className = 'h-7' }) => (
  <>
    <img src={`/brand/logo-${variant}.png`} alt="NDS — Nehemie Digital Solutions" className={`${className} w-auto dark:hidden`} />
    <img src={`/brand/logo-${variant}-dark.png`} alt="NDS — Nehemie Digital Solutions" className={`${className} hidden w-auto dark:block`} />
  </>
);

/** Ancien logo à initiales : conservé pour compatibilité, affiche désormais le logo NDS. */
export const Logo: React.FC<{ initials?: string }> = () => <BrandLogo />;

interface MenuLink {
  id: SectionId | 'cv';
  fr: string;
  en: string;
  descFr: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Page dédiée ; sinon ancre sur la page d'accueil. */
  page?: string;
}

interface MenuGroup {
  id: string;
  fr: string;
  en: string;
  links: MenuLink[];
}

const MENU: MenuGroup[] = [
  {
    id: 'profile',
    fr: 'Profil',
    en: 'Profile',
    links: [
      { id: 'about', fr: 'À propos', en: 'About', descFr: 'Qui je suis, ce que je fais', descEn: 'Who I am, what I do', icon: UserRound },
      { id: 'skills', fr: 'Compétences', en: 'Skills', descFr: 'Ma stack technique', descEn: 'My tech stack', icon: Layers },
      { id: 'timeline', fr: 'Parcours', en: 'Journey', descFr: 'Formation et expériences', descEn: 'Education and experience', icon: Route },
      { id: 'certifications', fr: 'Certifications', en: 'Certifications', descFr: 'Diplômes et attestations', descEn: 'Credentials', icon: Award },
      { id: 'cv', fr: 'CV', en: 'Resume', descFr: 'Version imprimable / PDF', descEn: 'Printable / PDF version', icon: FileText, page: '/cv' }
    ]
  },
  {
    id: 'work',
    fr: 'Réalisations',
    en: 'Work',
    links: [
      { id: 'projects', fr: 'Projets', en: 'Projects', descFr: 'Applications conçues et livrées', descEn: 'Applications I built', icon: FolderKanban },
      { id: 'services', fr: 'Services', en: 'Services', descFr: 'Ce que je peux faire pour vous', descEn: 'What I can do for you', icon: Briefcase }
    ]
  },
  {
    id: 'publications',
    fr: 'Publications',
    en: 'Publications',
    links: [
      { id: 'news', fr: 'Actualités', en: 'News', descFr: 'Annonces et nouvelles', descEn: 'Announcements', icon: Megaphone, page: '/actualites' },
      { id: 'blog', fr: 'Blog', en: 'Blog', descFr: 'Articles et tutoriels', descEn: 'Articles and tutorials', icon: BookOpen, page: '/blog' },
      { id: 'events', fr: 'Événements', en: 'Events', descFr: 'Conférences, formations, hackathons', descEn: 'Conferences, trainings', icon: CalendarDays, page: '/evenements' },
      { id: 'gallery', fr: 'Galerie', en: 'Gallery', descFr: 'Photos de mes activités', descEn: 'Photos of my activities', icon: Images, page: '/galerie' },
      { id: 'documents', fr: 'Documents', en: 'Documents', descFr: 'Fichiers à télécharger', descEn: 'Files to download', icon: FolderOpen, page: '/documents' }
    ]
  }
];

/** Bouton d'accès à l'espace privé (connexion au tableau de bord). */
export const PrivateAccess: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const logged = useAdminSession();
  const { t } = useLanguage();
  const label = logged ? t('Tableau de bord', 'Dashboard') : t('Espace privé', 'Private area');
  return (
    <a
      href="/admin"
      onClick={onLinkClick}
      className={
        compact
          ? 'btn btn-secondary w-full'
          : 'inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink'
      }
      aria-label={label}
      title={label}
    >
      {logged ? <LayoutDashboard className="h-[18px] w-[18px]" /> : <LockKeyhole className="h-[18px] w-[18px]" />}
      <span className={compact ? '' : 'hidden xl:inline'}>{label}</span>
    </a>
  );
};

export const Header: React.FC = () => {
  const { site } = useContent();
  const { t } = useLanguage();
  const path = usePath();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isHome = path === '/';
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [path]);

  // Fermer le menu déroulant au clic à l'extérieur ou avec Échap.
  useEffect(() => {
    if (!menu) return;
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const groups = MENU.map((g) => ({
    ...g,
    links: g.links
      .filter((l) => l.id === 'cv' || site.settings.sections[l.id as SectionId])
      .map((l) => ({ ...l, href: l.page ?? (isHome ? `#${l.id}` : `/#${l.id}`) }))
  })).filter((g) => g.links.length > 0);

  const contactHref = isHome ? '#contact' : '/#contact';
  const linkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    setMenu(null);
    if (href.startsWith('/')) onLinkClick(e);
  };
  const groupActive = (g: (typeof groups)[number]) => g.links.some((l) => l.page && (path === l.page || path.startsWith(`${l.page}/`)));

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div
        className={`container-page flex h-14 items-center justify-between gap-4 rounded-2xl border transition-all ${
          scrolled || open || menu ? 'border-line bg-canvas/85 shadow-lg shadow-black/10 backdrop-blur-xl' : 'border-transparent'
        }`}
      >
        <a href="/" onClick={onLinkClick} className="flex items-center gap-2.5" aria-label={t('Accueil', 'Home')}>
          <BrandLogo className="h-7 sm:h-8" />
          <span className="hidden border-l border-line pl-2.5 font-semibold tracking-tight sm:inline">{site.profile.shortName}</span>
        </a>

        <nav ref={navRef} aria-label={t('Navigation principale', 'Main navigation')} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 text-sm">
            {groups.map((g) => (
              <li key={g.id} className="relative">
                <button
                  type="button"
                  onClick={() => setMenu((m) => (m === g.id ? null : g.id))}
                  aria-expanded={menu === g.id}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-surface-2 hover:text-ink ${
                    menu === g.id || groupActive(g) ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {t(g.fr, g.en)}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menu === g.id ? 'rotate-180' : ''}`} />
                </button>
                {menu === g.id && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                    <ul className="grid w-[22rem] gap-0.5 rounded-2xl border border-line bg-canvas p-2 shadow-2xl shadow-black/15">
                      {g.links.map((l) => {
                        const Icon = l.icon;
                        return (
                          <li key={l.id}>
                            <a href={l.href} onClick={linkClick(l.href)} className="group flex items-start gap-3 rounded-xl p-2.5 hover:bg-surface-2">
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface group-hover:border-accent/40">
                                <Icon className="h-[18px] w-[18px] text-accent" />
                              </span>
                              <span>
                                <span className="block font-medium text-ink">{t(l.fr, l.en)}</span>
                                <span className="block text-xs text-muted">{t(l.descFr, l.descEn)}</span>
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            {site.settings.sections.contact && (
              <li>
                <a href={contactHref} onClick={linkClick(contactHref)} className="rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink">
                  Contact
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          {site.settings.showLoginInMenu && (
            <span className="hidden sm:inline-flex">
              <PrivateAccess />
            </span>
          )}
          {site.settings.sections.contact && (
            <a href={contactHref} onClick={linkClick(contactHref)} className="btn btn-primary ml-1 hidden px-3.5 py-2 sm:inline-flex">
              {t('Me contacter', 'Contact me')}
            </a>
          )}
          <button
            type="button"
            className="btn-ghost grid h-9 w-9 place-items-center rounded-lg lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('Fermer le menu', 'Close menu') : t('Ouvrir le menu', 'Open menu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={t('Navigation principale', 'Main navigation')}
          className="container-page mt-2 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-line bg-canvas p-3 shadow-xl lg:hidden"
        >
          {groups.map((g) => (
            <div key={g.id} className="mb-3">
              <p className="px-2 pb-1 font-mono text-[11px] text-muted">{t(g.fr, g.en)}</p>
              <ul className="grid grid-cols-2 gap-1">
                {g.links.map((l) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.id}>
                      <a href={l.href} onClick={linkClick(l.href)} className="flex items-center gap-2 rounded-xl px-2.5 py-2.5 hover:bg-surface-2">
                        <Icon className="h-4 w-4 text-accent" />
                        {t(l.fr, l.en)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="grid gap-2 border-t border-line pt-3 sm:grid-cols-2">
            {site.settings.sections.contact && (
              <a href={contactHref} onClick={linkClick(contactHref)} className="btn btn-primary">
                {t('Me contacter', 'Contact me')}
              </a>
            )}
            {site.settings.showLoginInMenu && <PrivateAccess compact />}
          </div>
        </nav>
      )}
    </header>
  );
};
