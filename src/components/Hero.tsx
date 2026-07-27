import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { ProfileCameraModal } from './ProfileCameraModal';
import {
  ArrowRight,
  FileDown,
  Mail,
  Sparkles,
  MapPin,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Brain,
  Cloud,
  Camera
} from 'lucide-react';

const DEFAULT_AVATAR = '/src/assets/images/profile_portrait_final_1784811907008.jpg';

interface HeroProps {
  onOpenCvModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCvModal }) => {
  const { language, t } = useLanguage();
  const { playClick, playHover } = useAudio();

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    try {
      return localStorage.getItem('custom_profile_photo') || DEFAULT_AVATAR;
    } catch {
      return DEFAULT_AVATAR;
    }
  });
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  useEffect(() => {
    const handlePhotoUpdate = () => {
      try {
        const saved = localStorage.getItem('custom_profile_photo');
        setProfilePhoto(saved || DEFAULT_AVATAR);
      } catch {
        setProfilePhoto(DEFAULT_AVATAR);
      }
    };
    window.addEventListener('profile_photo_updated', handlePhotoUpdate);
    return () => window.removeEventListener('profile_photo_updated', handlePhotoUpdate);
  }, []);

  const handleSavePhoto = (newPhotoUrl: string) => {
    try {
      localStorage.setItem('custom_profile_photo', newPhotoUrl);
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }
    setProfilePhoto(newPhotoUrl);
    window.dispatchEvent(new Event('profile_photo_updated'));
  };

  const handleResetPhoto = () => {
    try {
      localStorage.removeItem('custom_profile_photo');
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }
    setProfilePhoto(DEFAULT_AVATAR);
    window.dispatchEvent(new Event('profile_photo_updated'));
  };

  // Typewriter effect state
  const titles = PERSONAL_INFO.typewriterTitles[language];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = titles[currentTitleIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && currentText === fullText) {
      speed = 2200; // Pause at end of word
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      speed = 300;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && currentText === fullText) {
        setIsDeleting(true);
      } else if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTitleIndex, titles]);

  const scrollTo = (id: string) => {
    playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Bento Grid Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">

          {/* BENTO CARD 1: MAIN HERO BANNER */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1E293B] border border-white/10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
            {/* Glowing Orbs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#2563EB]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 bg-[#2563EB]/15 border border-[#2563EB]/40 text-blue-400 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Full Stack Developer</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-mono font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>Lubumbashi, RDC</span>
                </span>
              </div>

              {/* Title & Typewriter */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  {t('Transformer les idées en', 'Transforming Ideas Into')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-indigo-400 to-[#7C3AED]">
                    {t('solutions numériques', 'Digital Solutions')}
                  </span>
                </h1>

                {/* Typewriter Dynamic Title */}
                <div className="h-10 sm:h-12 flex items-center pt-1">
                  <span className="font-mono text-lg sm:text-2xl font-bold text-slate-200">
                    {currentText}
                    <span className="inline-block w-2 sm:w-2.5 h-5 sm:h-7 bg-[#2563EB] ml-1 animate-pulse" />
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-xl font-normal">
                {PERSONAL_INFO.slogan[language]}{' '}
                {t(
                  'Ingénieur en Génie Informatique passionné par l\'Intelligence Artificielle, le Cloud et la Cybersécurité.',
                  'Computer Engineer passionate about Artificial Intelligence, Cloud, and Cybersecurity.'
                )}
              </p>

              {/* High Tech Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: t('Génie Informatique', 'Computer Eng.'), icon: Sparkles, color: 'text-purple-400' },
                  { label: t('IA & Python', 'AI & Python'), icon: Brain, color: 'text-sky-400' },
                  { label: t('Cloud & Sécurité', 'Cloud & Security'), icon: ShieldCheck, color: 'text-emerald-400' },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                  >
                    <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6 mt-4 border-t border-white/10">
              <button
                onClick={() => scrollTo('projects')}
                onMouseEnter={playHover}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>{t('Voir mes projets', 'View My Projects')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  onOpenCvModal();
                }}
                onMouseEnter={playHover}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <FileDown className="w-4 h-4 text-blue-400" />
                <span>{t('Télécharger CV', 'Download Resume')}</span>
              </button>

              <button
                onClick={() => scrollTo('contact')}
                onMouseEnter={playHover}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all"
              >
                <Mail className="w-4 h-4 text-purple-400" />
                <span>{t('Me contacter', 'Contact Me')}</span>
              </button>
            </div>
          </div>

          {/* BENTO COLUMN 2: PROFILE & STATS */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* BENTO CARD 2: PROFILE & LOCATION */}
            <div className="rounded-3xl bg-[#111827] border border-white/10 p-6 flex items-center gap-5 relative overflow-hidden shadow-2xl group hover:border-[#2563EB]/40 transition-colors">
              <div className="relative flex-shrink-0 group/avatar">
                {/* Animated Circle Avatar with Camera Button Overlay */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#2563EB]/40 p-0.5 overflow-hidden bg-[#1E293B] shadow-inner cursor-pointer"
                     onClick={() => {
                       playClick();
                       setIsCameraModalOpen(true);
                     }}>
                  <img
                    src={profilePhoto}
                    alt={PERSONAL_INFO.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top rounded-full group-hover/avatar:scale-110 transition-transform duration-500"
                  />

                  {/* Camera Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 rounded-full flex flex-col items-center justify-center text-white p-1">
                    <Camera className="w-6 h-6 text-blue-400 mb-0.5 animate-bounce" />
                    <span className="text-[9px] font-bold text-center leading-tight font-mono">
                      {t('Changer', 'Change')}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-1 left-1 w-5 h-5 bg-emerald-500 border-4 border-[#111827] rounded-full" title="Available for projects" />

                {/* Camera Trigger Badge Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setIsCameraModalOpen(true);
                  }}
                  onMouseEnter={playHover}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-[#2563EB] hover:bg-blue-500 text-white border-2 border-[#111827] shadow-lg hover:scale-110 active:scale-90 transition-all"
                  title={t('Prendre une photo avec l\'appareil photo', 'Capture photo with camera')}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white truncate">{PERSONAL_INFO.name}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-blue-400 font-mono font-medium">
                  {PERSONAL_INFO.title[language]}
                </p>
                <p className="text-xs text-[#CBD5E1] flex items-center gap-1">
                  <span>📍 Lubumbashi, RDC 🇨🇩</span>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase text-slate-300 font-mono">Français</span>
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase text-slate-300 font-mono">Anglais</span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/30 uppercase font-mono">Bac+3 Eng</span>
                </div>
              </div>
            </div>

            {/* BENTO CARD 3: QUICK STATS GRID */}
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center text-center shadow-lg hover:border-blue-500/40 transition-colors">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] font-mono">18+</span>
                <span className="text-[10px] text-[#CBD5E1] font-mono uppercase tracking-wider mt-1">{t('Projets', 'Projects')}</span>
              </div>

              <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center text-center shadow-lg hover:border-purple-500/40 transition-colors">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#7C3AED] font-mono">07+</span>
                <span className="text-[10px] text-[#CBD5E1] font-mono uppercase tracking-wider mt-1">{t('Certs', 'Certs')}</span>
              </div>

              <div className="bg-[#111827] rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/40 transition-colors">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">3e</span>
                <span className="text-[10px] text-[#CBD5E1] font-mono uppercase tracking-wider mt-1">{t('Année Eng', '3rd Year')}</span>
              </div>
            </div>

          </div>

        </div>

        {/* BENTO ROW 2: TECH STACK PREVIEW & FEATURED PROJECTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6 items-stretch">

          {/* BENTO CARD 4: TECH STACK BENTO PREVIEW */}
          <div className="lg:col-span-4 bg-[#111827] rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#CBD5E1] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>{t('Compétences Clés', 'Core Tech Stack')}</span>
                </h3>
                <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full animate-ping" />
              </div>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 text-slate-300 font-medium">
                    <span>Frontend (React, TypeScript, Tailwind)</span>
                    <span className="font-mono font-bold text-blue-400">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 text-slate-300 font-medium">
                    <span>Backend (Node.js, Express, Java, SQL)</span>
                    <span className="font-mono font-bold text-indigo-400">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-[#2563EB] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 text-slate-300 font-medium">
                    <span>Réseaux Cisco & Cybersécurité</span>
                    <span className="font-mono font-bold text-purple-400">82%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[82%] h-full bg-[#7C3AED] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-5 mt-4 border-t border-white/10">
              <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-blue-400">TS</div>
              <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-purple-400">Py</div>
              <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">SQL</div>
              <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-amber-400">Java</div>
              <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-sky-400">Git</div>
            </div>
          </div>

          {/* BENTO CARD 5: FEATURED PROJECTS PREVIEW */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Project Preview 1 */}
            <div
              onClick={() => scrollTo('projects')}
              onMouseEnter={playHover}
              className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden group cursor-pointer hover:border-blue-500/50 transition-all p-5 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="h-32 sm:h-36 rounded-2xl overflow-hidden relative mb-4 bg-[#1E293B]">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                    alt="UR-GEDT Portal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#2563EB] text-white text-[10px] font-mono font-bold rounded-lg shadow">
                    WEB APP
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors mb-1">
                  UR-GEDT Portal
                </h4>
                <p className="text-[#CBD5E1] text-xs line-clamp-2 leading-relaxed">
                  {t(
                    'Système de gestion académique avec génération de documents et QR-codes sécurisés.',
                    'Academic document management system with verified QR-codes and student portal.'
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300">React</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300">Node.js</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300">MySQL</span>
                </div>
                <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Project Preview 2 */}
            <div
              onClick={() => scrollTo('projects')}
              onMouseEnter={playHover}
              className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden group cursor-pointer hover:border-purple-500/50 transition-all p-5 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="h-32 sm:h-36 rounded-2xl overflow-hidden relative mb-4 bg-[#1E293B]">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
                    alt="SmartFix AI RDC"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#7C3AED] text-white text-[10px] font-mono font-bold rounded-lg shadow">
                    AI DIAGNOSTIC
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-purple-400 transition-colors mb-1">
                  SmartFix AI RDC
                </h4>
                <p className="text-[#CBD5E1] text-xs line-clamp-2 leading-relaxed">
                  {t(
                    'Application de diagnostic intelligent de pannes matérielles informatiques et cartes mères.',
                    'AI-powered hardware diagnostic tool for IT technicians and motherboard repair.'
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300">Python</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300">Gemini AI</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300">React</span>
                </div>
                <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Camera Capture & Photo Upload Modal */}
      <ProfileCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSavePhoto={handleSavePhoto}
        onResetDefault={handleResetPhoto}
        currentPhotoUrl={profilePhoto}
      />
    </section>
  );
};
