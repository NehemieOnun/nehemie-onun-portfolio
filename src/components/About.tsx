import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO, STATS } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { InteractiveGlobe } from './InteractiveGlobe';
import {
  GraduationCap,
  Target,
  Compass,
  Heart,
  Award,
  Code2,
  Briefcase,
  FolderCheck,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe2
} from 'lucide-react';

const DEFAULT_AVATAR = '/src/assets/images/profile_portrait_final_1784811907008.jpg';

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover } = useAudio();

  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    try {
      return localStorage.getItem('custom_profile_photo') || DEFAULT_AVATAR;
    } catch {
      return DEFAULT_AVATAR;
    }
  });

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

  const passions = [
    { titleFr: 'Intelligence Artificielle', titleEn: 'Artificial Intelligence', icon: Zap, descFr: 'Intégration de modèles LLM & Vision', descEn: 'LLM models & Computer Vision' },
    { titleFr: 'Cloud Computing', titleEn: 'Cloud Computing', icon: Globe2, descFr: 'Architectures résilientes & microservices', descEn: 'Resilient Cloud & microservices' },
    { titleFr: 'Cybersécurité', titleEn: 'Cybersecurity', icon: ShieldCheck, descFr: 'Audit d\'APIs & Sécurité réseau Cisco', descEn: 'API audits & Cisco network security' },
    { titleFr: 'Open Source', titleEn: 'Open Source', icon: Code2, descFr: 'Partage de connaissances & contribution', descEn: 'Knowledge sharing & community' }
  ];

  return (
    <section id="about" className="relative py-20 lg:py-28 overflow-hidden bg-[#0B1120] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('À Propos de Moi', 'About Me')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('Parcours, Vision & Ambitions', 'Journey, Vision & Ambitions')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Découvrez qui je suis, mon profil d\'ingénieur informatique et ma passion pour la création de logiciels haut de gamme.',
              'Learn more about my software engineering background and my passion for building high-end systems.'
            )}
          </p>
        </div>

        {/* Grid: Left Profile Card & Stats | Right Journey, Vision, Passions & Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Profile Card with Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl bg-[#111827] border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl group hover:border-[#2563EB]/40 transition-all duration-300">
              
              {/* Card Header Profile Photo & Quick Details */}
              <div className="flex items-center gap-5 pb-6 border-b border-white/10">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#2563EB]/50 shadow-md flex-shrink-0">
                  <img
                    src={profilePhoto}
                    alt={PERSONAL_INFO.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {PERSONAL_INFO.name}
                  </h3>
                  <p className="text-xs text-blue-400 font-mono mt-1">
                    {t('Ingénieur en Génie Informatique', 'Computer Engineer')}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>📍 Lubumbashi, RDC</span>
                  </p>
                </div>
              </div>

              {/* Stats Grid inside Card */}
              <div className="grid grid-cols-2 gap-3 py-6 border-b border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{t('Expérience', 'Experience')}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">3+ {t('Ans', 'Years')}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                    <FolderCheck className="w-3.5 h-3.5" />
                    <span>{t('Projets', 'Projects')}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">18+</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{t('Certifications', 'Certifications')}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">7 {t('Titres', 'Titles')}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{t('Langages', 'Languages')}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">6+</div>
                </div>
              </div>

              {/* Bio Excerpt */}
              <p className="text-xs sm:text-sm text-slate-300 pt-6 leading-relaxed">
                {PERSONAL_INFO.bio[language]}
              </p>
            </div>

            {/* Interactive 3D Globe Component */}
            <InteractiveGlobe />
          </div>

          {/* Right Column: Vision, Goals, Passions */}
          <div className="lg:col-span-7 space-y-6">

            {/* Vision & Objectives Card */}
            <div className="rounded-3xl bg-[#111827] border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#2563EB]/20 text-blue-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {t('Ma Vision & Mes Objectifs', 'My Vision & Goals')}
                </h3>
              </div>

              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                {t(
                  'Mon ambition est de contribuer activement à la souveraineté numérique africaine en développant des outils informatiques robustes, adaptés aux spécificités locales tout en respectant les standards internationaux les plus exigeants.',
                  'My ambition is to actively contribute to African digital empowerment by developing resilient software tailored to regional requirements while adhering to global standards.'
                )}
              </p>

              <div className="space-y-3">
                {PERSONAL_INFO.goals[language].map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200 font-medium">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Passions Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-400" />
                <h3 className="text-lg font-bold text-white">
                  {t('Domaines de Prédilection', 'Areas of Passion')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {passions.map((p, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={playHover}
                    className="p-4 rounded-2xl bg-[#111827] border border-white/10 hover:border-[#2563EB]/40 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-[#7C3AED]/10 text-purple-400 group-hover:scale-110 transition-transform">
                        <p.icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        {t(p.titleFr, p.titleEn)}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      {t(p.descFr, p.descEn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
