import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  Code2,
  Layout,
  Server,
  Database,
  Terminal,
  ShieldCheck,
  Cloud,
  Star,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover, playClick } = useAudio();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryIcons: Record<string, React.ReactNode> = {
    frontend: <Layout className="w-4 h-4 text-blue-400" />,
    backend: <Server className="w-4 h-4 text-purple-400" />,
    database: <Database className="w-4 h-4 text-emerald-400" />,
    programming: <Terminal className="w-4 h-4 text-amber-400" />,
    networks: <ShieldCheck className="w-4 h-4 text-sky-400" />,
    devops: <Cloud className="w-4 h-4 text-indigo-400" />
  };

  const categories = [
    { id: 'all', labelFr: 'Toutes les compétences', labelEn: 'All Skills' },
    ...SKILL_CATEGORIES.map((cat) => ({
      id: cat.id,
      labelFr: cat.title.fr,
      labelEn: cat.title.en
    }))
  ];

  const filteredCategories = activeCategory === 'all'
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter((cat) => cat.id === activeCategory);

  return (
    <section id="skills" className="relative py-20 lg:py-28 bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-purple-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>{t('Stack Technique', 'Technical Stack')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('Compétences & Maîtrise', 'Skills & Technical Mastery')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Un éventail complet de technologies modernes maîtrisées à travers des projets académiques et professionnels.',
              'A complete toolkit of modern languages, frameworks, and network protocols.'
            )}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                setActiveCategory(cat.id);
              }}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat.id
                  ? 'bg-[#2563EB] border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-105'
                  : 'bg-[#111827] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {t(cat.labelFr, cat.labelEn)}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-3xl bg-[#111827] border border-white/10 p-6 shadow-xl backdrop-blur-xl hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {categoryIcons[category.id] || <Code2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {t(category.title.fr, category.title.en)}
                  </h3>
                </div>

                {/* Skill Items & Progress Bars */}
                <div className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          {skill.name}
                          {skill.isFavorite && (
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" title="Favorite Tech" />
                          )}
                        </span>
                        <span className="font-mono text-xs text-blue-400 font-bold">{skill.level}%</span>
                      </div>

                      {/* Animated Bar */}
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#2563EB] via-indigo-500 to-[#7C3AED] rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Footer Indicator */}
              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {category.skills.length} {t('Compétences', 'Skills')}
                </span>
                <span className="text-slate-400">{t('Vérifié', 'Verified')}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
