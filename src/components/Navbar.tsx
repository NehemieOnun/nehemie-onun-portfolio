import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  FileDown,
  Menu,
  X,
  Sparkles,
  MousePointer,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onOpenCvModal: () => void;
  cursorEnabled: boolean;
  toggleCursor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCvModal,
  cursorEnabled,
  toggleCursor
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick, playHover } = useAudio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track current active section
      const sections = ['hero', 'about', 'skills', 'services', 'projects', 'timeline', 'certifications', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', labelFr: 'Accueil', labelEn: 'Home' },
    { id: 'about', labelFr: 'À propos', labelEn: 'About' },
    { id: 'skills', labelFr: 'Compétences', labelEn: 'Skills' },
    { id: 'services', labelFr: 'Services', labelEn: 'Services' },
    { id: 'projects', labelFr: 'Projets', labelEn: 'Projects' },
    { id: 'timeline', labelFr: 'Parcours', labelEn: 'Timeline' },
    { id: 'certifications', labelFr: 'Certifications', labelEn: 'Certifications' },
    { id: 'blog', labelFr: 'Blog', labelEn: 'Blog' },
    { id: 'contact', labelFr: 'Contact', labelEn: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 dark:bg-slate-950/85 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/60 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('hero');
          }}
          onMouseEnter={playHover}
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="font-mono text-base font-extrabold">NOK</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
              NÉHÉMIE ONUN
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">
              Full Stack Dev
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                onMouseEnter={playHover}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {t(link.labelFr, link.labelEn)}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Custom Cursor Toggle */}
          <button
            onClick={() => {
              playClick();
              toggleCursor();
            }}
            onMouseEnter={playHover}
            title={t('Activer/Désactiver le curseur sur mesure', 'Toggle custom cursor')}
            className={`p-2 rounded-xl border transition-all ${
              cursorEnabled
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-500'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>

          {/* Sound Effect Toggle */}
          <button
            onClick={() => {
              playClick();
              toggleSound();
            }}
            onMouseEnter={playHover}
            title={soundEnabled ? t('Effets sonores activés', 'Sound FX Enabled') : t('Effets sonores désactivés', 'Sound FX Muted')}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-500 dark:text-purple-400'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language FR/EN Toggle */}
          <button
            onClick={() => {
              playClick();
              toggleLanguage();
            }}
            onMouseEnter={playHover}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500/50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Dark/Light Toggle */}
          <button
            onClick={() => {
              playClick();
              toggleTheme();
            }}
            onMouseEnter={playHover}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-blue-400 hover:scale-105 transition-all"
            title={t('Changer de thème', 'Toggle theme')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Download CV CTA */}
          <button
            onClick={() => {
              playClick();
              onOpenCvModal();
            }}
            onMouseEnter={playHover}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{t('CV', 'Resume')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => {
              playClick();
              toggleLanguage();
            }}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => {
              playClick();
              toggleTheme();
            }}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-blue-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-slate-950/95 dark:bg-slate-950/95 bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 mt-3 space-y-3 shadow-2xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-2 text-left text-xs font-medium rounded-xl transition-colors ${
                  activeSection === link.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t(link.labelFr, link.labelEn)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                playClick();
                toggleSound();
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Son ON' : 'Son OFF'}</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onOpenCvModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              <FileDown className="w-4 h-4" />
              <span>{t('Télécharger CV', 'Download Resume')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
