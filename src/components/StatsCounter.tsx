import React, { useEffect, useState, useRef } from 'react';
import { STATS } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import {
  FolderCheck,
  Briefcase,
  Award,
  Code2,
  Sparkles
} from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const { language, t } = useLanguage();
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const iconMap: Record<string, React.ReactNode> = {
    FolderCheck: <FolderCheck className="w-6 h-6 text-blue-400" />,
    Briefcase: <Briefcase className="w-6 h-6 text-purple-400" />,
    Award: <Award className="w-6 h-6 text-emerald-400" />,
    Code2: <Code2 className="w-6 h-6 text-sky-400" />
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40 border-y border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-3 group-hover:scale-110 transition-transform">
                {iconMap[stat.icon] || <Sparkles className="w-6 h-6 text-blue-400" />}
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {stat.prefix}
                {hasAnimated ? stat.value : 0}
                {stat.suffix}
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
                {t(stat.label.fr, stat.label.en)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
