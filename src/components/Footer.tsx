import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  ArrowUp,
  Github,
  Linkedin,
  Facebook,
  Mail,
  MessageSquare,
  Heart,
  Volume2,
  VolumeX,
  Code
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { soundEnabled, toggleSound, playClick, playHover } = useAudio();

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 text-slate-400 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-mono font-extrabold text-lg shadow-lg shadow-blue-500/20">
                NOK
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block">
                  {PERSONAL_INFO.name}
                </span>
                <span className="text-xs text-blue-400 font-mono">
                  {t('Développeur Full Stack | Génie Informatique', 'Full Stack Developer | Computer Engineering')}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {PERSONAL_INFO.slogan[language]}{' '}
              {t(
                'Passionné par l\'innovation technologique, le Cloud et la cybersécurité en Afrique.',
                'Dedicated to tech innovation, cloud engineering, and cybersecurity in Africa.'
              )}
            </p>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                playClick();
                toggleSound();
              }}
              onMouseEnter={playHover}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{soundEnabled ? t('Sons Activés', 'Sound FX On') : t('Sons Muets', 'Sound FX Off')}</span>
            </button>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'hero', labelFr: 'Accueil', labelEn: 'Home' },
                { id: 'about', labelFr: 'À propos', labelEn: 'About' },
                { id: 'skills', labelFr: 'Compétences', labelEn: 'Skills' },
                { id: 'services', labelFr: 'Services', labelEn: 'Services' },
                { id: 'projects', labelFr: 'Projets', labelEn: 'Projects' },
                { id: 'timeline', labelFr: 'Parcours', labelEn: 'Timeline' },
                { id: 'certifications', labelFr: 'Certifications', labelEn: 'Certifications' },
                { id: 'contact', labelFr: 'Contact', labelEn: 'Contact' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  onMouseEnter={playHover}
                  className="text-left text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {t(link.labelFr, link.labelEn)}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Social & Location */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {t('Réseaux & Contact', 'Social & Contact')}
            </h4>
            <p className="text-xs text-slate-400">
              Lubumbashi, République Démocratique du Congo
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-all"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500 transition-all"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>React 19 & Tailwind CSS</span>
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={playHover}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md"
            title={t('Retour en haut', 'Back to top')}
          >
            <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
