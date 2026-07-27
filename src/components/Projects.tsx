import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  FolderCheck,
  Github,
  ExternalLink,
  Search,
  Filter,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover, playClick } = useAudio();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', labelFr: 'Tous les projets', labelEn: 'All Projects' },
    { id: 'web', labelFr: 'Web', labelEn: 'Web' },
    { id: 'mobile', labelFr: 'Mobile', labelEn: 'Mobile' },
    { id: 'ai', labelFr: 'IA / AI', labelEn: 'AI & ML' },
    { id: 'cloud', labelFr: 'Cloud', labelEn: 'Cloud' },
    { id: 'db', labelFr: 'Base de données', labelEn: 'Databases' },
  ];

  const filteredProjects = PROJECTS.filter((proj) => {
    const matchesCategory = activeCategory === 'all' || proj.category === activeCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proj.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="relative py-20 lg:py-28 bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <FolderCheck className="w-3.5 h-3.5" />
            <span>{t('Galerie de Projets', 'Project Gallery')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('Réalisations & Prototypes', 'Portfolio & Realized Systems')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Découvrez mes projets phares combinant architectures modernes, intelligence artificielle et souci du détail.',
              'Explore my flagship software engineering projects combining modern architectures and clean design.'
            )}
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={playHover}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activeCategory === cat.id
                    ? 'bg-[#2563EB] border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-105'
                    : 'bg-[#111827] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {t(cat.labelFr, cat.labelEn)}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Rechercher un projet, stack...', 'Search projects, stack...')}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={playHover}
              className="group rounded-3xl bg-[#111827] border border-white/10 overflow-hidden shadow-xl hover:border-[#2563EB]/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Featured Badge */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#1E293B]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent" />

                  {project.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-mono font-bold shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>FEAT</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0B1120]/80 backdrop-blur-md text-slate-300 text-[10px] font-mono border border-white/10">
                    {project.category.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description[language]}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-white/10 mt-4">
                <button
                  onClick={() => {
                    playClick();
                    setSelectedProject(project);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>{t('Détails du projet', 'Project details')}</span>
                  <span>→</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#2563EB] text-white hover:bg-blue-500 transition-colors shadow-sm"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-mono text-xs">
            {t('Aucun projet ne correspond à votre recherche.', 'No projects match your search query.')}
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="relative h-60 sm:h-72 bg-slate-950 overflow-hidden flex-shrink-0">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t('Présentation générale', 'General Overview')}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedProject.fullDescription[language]}
                </p>
              </div>

              {/* Metrics if present */}
              {selectedProject.metrics && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedProject.metrics.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">{m.label[language]}</div>
                      <div className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stack */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {t('Technologies & Architecture', 'Technologies & Architecture')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-300 flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>{t('Code Source GitHub', 'GitHub Source Code')}</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t('Voir la démo en direct', 'View Live Demo')}</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
