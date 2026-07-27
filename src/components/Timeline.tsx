import React from 'react';
import { TIMELINE_EVENTS } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  Clock,
  Sparkles,
  Code,
  Laptop,
  Award,
  Brain,
  GraduationCap
} from 'lucide-react';

export const Timeline: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover } = useAudio();

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-4 h-4 text-amber-400" />,
    Code: <Code className="w-4 h-4 text-blue-400" />,
    Laptop: <Laptop className="w-4 h-4 text-purple-400" />,
    Award: <Award className="w-4 h-4 text-emerald-400" />,
    Brain: <Brain className="w-4 h-4 text-sky-400" />
  };

  return (
    <section id="timeline" className="relative py-20 lg:py-28 bg-slate-900/40 dark:bg-slate-950/40 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('Mon Parcours & Évolution', 'My Journey & Milestones')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('Feuille de Route du Développeur', 'Developer Roadmap & Timeline')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            {t(
              'De la découverte passionnée de l\'informatique aux certifications internationales et projets universitaires.',
              'From self-taught programming discovery to academic engineering and international achievements.'
            )}
          </p>
        </div>

        {/* Vertical Animated Timeline */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-12">
          {TIMELINE_EVENTS.map((event) => (
            <div
              key={event.id}
              onMouseEnter={playHover}
              className="relative pl-8 sm:pl-10 group"
            >
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-slate-950 border-2 border-blue-500 group-hover:border-purple-400 group-hover:scale-125 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20">
                {iconMap[event.icon] || <GraduationCap className="w-3.5 h-3.5 text-blue-400" />}
              </div>

              {/* Year Badge on the Left for Desktop */}
              <div className="hidden sm:block absolute -left-32 top-2 text-right w-24">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 shadow-sm">
                  {event.year}
                </span>
              </div>

              {/* Event Content Card */}
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl hover:border-blue-500/40 transition-all duration-300">
                
                {/* Mobile Year Badge */}
                <div className="sm:hidden mb-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-blue-400">
                    {event.year}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {t(event.title.fr, event.title.en)}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {t(event.institution.fr, event.institution.en)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {t(event.description.fr, event.description.en)}
                </p>

                {/* Skills tags */}
                {event.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                    {event.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-purple-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
