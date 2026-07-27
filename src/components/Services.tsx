import React from 'react';
import { SERVICES } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  Code,
  Smartphone,
  Palette,
  Cpu,
  Database,
  Shield,
  Wrench,
  Compass,
  Check,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';

export const Services: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover, playClick } = useAudio();

  const iconMap: Record<string, React.ReactNode> = {
    Code: <Code className="w-5 h-5 text-blue-400" />,
    Smartphone: <Smartphone className="w-5 h-5 text-purple-400" />,
    Palette: <Palette className="w-5 h-5 text-pink-400" />,
    Cpu: <Cpu className="w-5 h-5 text-emerald-400" />,
    Database: <Database className="w-5 h-5 text-indigo-400" />,
    Shield: <Shield className="w-5 h-5 text-sky-400" />,
    Wrench: <Wrench className="w-5 h-5 text-amber-400" />,
    Compass: <Compass className="w-5 h-5 text-teal-400" />
  };

  const scrollToContact = () => {
    playClick();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="relative py-20 lg:py-28 bg-[#0B1120] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t('Mes Services & Expertise', 'My Services & Solutions')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('Des Services Informatiques Sur Mesure', 'Tailored Software & IT Services')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Du développement web au conseil en architecture réseau, j\'accompagne vos projets informatiques de A à Z.',
              'From custom web development to network architecture and IT consulting, I help build your vision.'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              onMouseEnter={playHover}
              className="group relative rounded-3xl bg-[#111827] border border-white/10 p-6 shadow-xl hover:border-[#2563EB]/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {iconMap[service.icon] || <Code className="w-5 h-5 text-blue-400" />}
                  </div>
                  <button
                    onClick={scrollToContact}
                    className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                    title={t('Demander ce service', 'Request this service')}
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-blue-400" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {t(service.title.fr, service.title.en)}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {t(service.description.fr, service.description.en)}
                </p>
              </div>

              {/* Service Features Checklist */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {service.features[language].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#2563EB]/20 via-indigo-600/20 to-[#7C3AED]/20 border border-white/10 p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-bold text-white">
              {t('Un projet informatique en tête ?', 'Have an IT project in mind?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {t(
                'Discutons de vos besoins et trouvons la solution idéale pour votre entreprise ou startup.',
                'Let\'s discuss your requirements and find the perfect solution for your organization.'
              )}
            </p>
          </div>

          <button
            onClick={scrollToContact}
            onMouseEnter={playHover}
            className="px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-900/30 transition-all flex-shrink-0"
          >
            {t('Demander un devis gratuit', 'Get a Free Quote')}
          </button>
        </div>

      </div>
    </section>
  );
};
