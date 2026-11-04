import React, { useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Cloud,
  Code2,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  Github,
  GraduationCap,
  HeartHandshake,
  Layout,
  Network,
  Smartphone,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Wrench
} from 'lucide-react';
import type { Certification, Project, ProjectCategory, TimelineCategory } from '../../shared/types';
import { parseSkill } from '../../shared/utils';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { spotlight } from '../hooks/useFx';
import { safeUrl } from '../lib/safeUrl';
import { Modal, Section, SectionHeader } from './ui';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  layout: Layout,
  server: Server,
  database: Database,
  terminal: Terminal,
  shield: ShieldCheck,
  cloud: Cloud,
  code: Code2,
  cpu: Cpu,
  wrench: Wrench,
  compass: Compass,
  sparkles: Sparkles,
  briefcase: Briefcase
};
export const ICON_NAMES = Object.keys(ICONS);
const iconFor = (name: string) => ICONS[name] ?? Code2;

// ---------------------------------------------------------------- Projets
const CATEGORY_LABEL: Record<ProjectCategory, { fr: string; en: string }> = {
  web: { fr: 'Web', en: 'Web' },
  mobile: { fr: 'Mobile', en: 'Mobile' },
  ai: { fr: 'IA', en: 'AI' },
  cloud: { fr: 'Cloud', en: 'Cloud' },
  db: { fr: 'Données', en: 'Data' },
  network: { fr: 'Réseaux', en: 'Networking' },
  other: { fr: 'Autre', en: 'Other' }
};
export const PROJECT_CATEGORIES = Object.keys(CATEGORY_LABEL) as ProjectCategory[];

/** Icône de couverture utilisée quand un projet n'a pas d'image. */
const CATEGORY_ICON: Record<ProjectCategory, React.ComponentType<{ className?: string }>> = {
  web: Layout,
  mobile: Smartphone,
  ai: Sparkles,
  cloud: Cloud,
  db: Database,
  network: Network,
  other: Code2
};

/** Couverture générée (dégradé + icône + titre) pour les projets sans capture. */
const ProjectCover: React.FC<{ project: Project; big: boolean }> = ({ project, big }) => {
  const Icon = CATEGORY_ICON[project.category] ?? Code2;
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-brand/25 via-surface-2 to-navy/30 px-6 text-center ${big ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--c-glow-1),transparent_60%)]" />
      <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-surface/70 text-accent shadow-lg transition-transform duration-500 group-hover:scale-110">
        <Icon className="h-7 w-7" />
      </span>
      <span className="relative line-clamp-2 max-w-[90%] text-sm font-medium text-ink/80">{project.title}</span>
    </div>
  );
};

const ProjectLinks: React.FC<{ project: Project; compact?: boolean }> = ({ project, compact }) => {
  const { t } = useLanguage();
  const demo = safeUrl(project.demoUrl);
  const code = safeUrl(project.githubUrl);
  if (!demo && !code) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {demo && (
        <a href={demo} target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${compact ? 'px-3 py-1.5 text-xs' : ''}`}>
          <ExternalLink className="h-4 w-4" />
          {t('Démo', 'Live demo')}
        </a>
      )}
      {code && (
        <a href={code} target="_blank" rel="noopener noreferrer" className={`btn btn-secondary ${compact ? 'px-3 py-1.5 text-xs' : ''}`}>
          <Github className="h-4 w-4" />
          {t('Code', 'Code')}
        </a>
      )}
    </div>
  );
};

export const Projects: React.FC = () => {
  const { site } = useContent();
  const { t, l, language } = useLanguage();
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  if (!site.projects.length) return null;

  const cats = PROJECT_CATEGORIES.filter((c) => site.projects.some((p) => p.category === c));
  const shown = [...site.projects]
    .filter((p) => filter === 'all' || p.category === filter)
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <Section id="projects">
      <SectionHeader
        id="projects"
        path="projets"
        title={t('Projets réalisés', 'Selected work')}
        intro={t('Des applications conçues de bout en bout : interface, API, base de données et déploiement.', 'Applications built end to end: interface, API, database and deployment.')}
      />

      {cats.length > 1 && (
        <div role="tablist" aria-label={t('Filtrer les projets', 'Filter projects')} className="reveal mb-8 flex flex-wrap gap-2">
          {(['all', ...cats] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                filter === c ? 'border-accent bg-accent-soft text-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              {c === 'all' ? t('tous', 'all') : CATEGORY_LABEL[c][language].toLowerCase()}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => {
          const big = p.featured && i === 0 && filter === 'all';
          // Badge « phare » limité aux deux premiers projets mis en avant
          const highlight = p.featured && i < 2;
          return (
            <article
              key={p.id}
              onMouseMove={spotlight}
              className={`card card-spotlight reveal group flex flex-col ${big ? 'md:col-span-2' : ''}`}
            >
              <button type="button" onClick={() => setSelected(p)} className="block overflow-hidden border-b border-line text-left" aria-label={`${t('Détails', 'Details')} : ${p.title}`}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${big ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}
                  />
                ) : (
                  <ProjectCover project={p} big={big} />
                )}
              </button>
              <div className="relative flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="chip">{CATEGORY_LABEL[p.category]?.[language] ?? p.category}</span>
                  {highlight && <span className="font-mono text-xs text-accent">★ {t('phare', 'featured')}</span>}
                </div>
                <h3 className={`mt-4 font-semibold tracking-tight ${big ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                  <button type="button" onClick={() => setSelected(p)} className="text-left hover:text-accent">
                    {p.title}
                  </button>
                </h3>
                <p className={`mt-2 text-muted ${big ? 'text-lg' : 'line-clamp-3'}`}>{l(p.description)}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, big ? 10 : 5).map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                  <button type="button" onClick={() => setSelected(p)} className="inline-flex items-center gap-1 text-sm font-medium hover:text-accent">
                    {t('En savoir plus', 'Learn more')}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <ProjectLinks project={p} compact />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} label={selected?.title ?? ''} wide>
        {selected && (
          <div>
            {selected.image && <img src={selected.image} alt="" className="aspect-[16/8] w-full object-cover" />}
            <div className="space-y-5 p-6 sm:p-8">
              <span className="chip">{CATEGORY_LABEL[selected.category]?.[language] ?? selected.category}</span>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{selected.title}</h3>
              <p className="whitespace-pre-line leading-relaxed">{l(selected.fullDescription) || l(selected.description)}</p>
              <ul className="flex flex-wrap gap-1.5">
                {selected.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
              <ProjectLinks project={selected} />
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
};

// ---------------------------------------------------------------- Compétences
export const Skills: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  if (!site.skillCategories.length) return null;
  return (
    <Section id="skills">
      <SectionHeader
        id="skills"
        path="stack"
        title={t('Ma stack technique', 'My tech stack')}
        intro={t('Les outils que j’utilise au quotidien, du front-end à l’infrastructure.', 'The tools I use every day, from front-end to infrastructure.')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.skillCategories.map((cat) => {
          const Icon = iconFor(cat.icon);
          return (
            <div key={cat.id} onMouseMove={spotlight} className="card card-spotlight reveal p-6">
              <div className="relative">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface-2">
                  <Icon className="h-5 w-5 text-accent" />
                </span>
                <h3 className="mt-5 font-semibold">{l(cat.title)}</h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {cat.skills.map((line) => {
                    const s = parseSkill(line);
                    return (
                      <li key={line} className="chip" title={s.level !== null ? `${s.level} %` : undefined}>
                        {s.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

// ---------------------------------------------------------------- Services
export const Services: React.FC = () => {
  const { site } = useContent();
  const { t, l, ll } = useLanguage();
  if (!site.services.length) return null;
  return (
    <Section id="services">
      <SectionHeader
        id="services"
        path="services"
        title={t('Ce que je peux faire pour vous', 'What I can do for you')}
        intro={t('Pour un stage, une mission ou un projet.', 'For an internship, an assignment or a project.')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {site.services.map((s) => {
          const Icon = iconFor(s.icon);
          return (
            <div key={s.id} onMouseMove={spotlight} className="card card-spotlight reveal p-7">
              <div className="relative flex gap-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/15 to-navy/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{l(s.title)}</h3>
                  <p className="mt-1.5 text-muted">{l(s.description)}</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {ll(s.features).map((f) => (
                      <li key={f} className="flex gap-2">
                        <span aria-hidden="true" className="font-mono text-cyan">
                          ›
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

// ---------------------------------------------------------------- Parcours
const TIMELINE_ICON: Record<TimelineCategory, React.ComponentType<{ className?: string }>> = {
  education: GraduationCap,
  experience: Briefcase,
  achievement: Trophy,
  volunteering: HeartHandshake,
  future: Sparkles
};
export const TIMELINE_CATEGORIES = Object.keys(TIMELINE_ICON) as TimelineCategory[];

export const Timeline: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  if (!site.timeline.length) return null;
  return (
    <Section id="timeline">
      <SectionHeader id="timeline" path="parcours" title={t('Parcours', 'Journey')} />
      <ol className="relative ml-4 border-l border-line sm:ml-0 sm:border-l-0">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[-1px] top-0 hidden w-px bg-gradient-to-b from-accent via-cyan to-transparent sm:left-[10.5rem] sm:block"
        />
        {site.timeline.map((e) => {
          const Icon = TIMELINE_ICON[e.category] ?? Sparkles;
          return (
            <li key={e.id} className="reveal relative pb-10 pl-8 last:pb-0 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-14 sm:pl-0">
              <p className="mb-2 font-mono text-sm text-accent sm:mb-0 sm:pt-5 sm:text-right">{e.year}</p>
              <span className="absolute -left-[17px] top-0 grid h-8 w-8 place-items-center rounded-full border border-line-strong bg-canvas text-accent sm:left-[calc(10.5rem-16px)] sm:top-4">
                <Icon className="h-4 w-4" />
              </span>
              <div onMouseMove={spotlight} className="card card-spotlight p-5 sm:p-6">
                <div className="relative">
                  <h3 className="text-lg font-semibold">{l(e.title)}</h3>
                  {l(e.institution) && <p className="text-sm text-muted">{l(e.institution)}</p>}
                  {l(e.description) && <p className="mt-3">{l(e.description)}</p>}
                  {e.skills.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {e.skills.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
};

// ---------------------------------------------------------------- Certifications
export const Certifications: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  const [selected, setSelected] = useState<Certification | null>(null);
  if (!site.certifications.length) return null;
  return (
    <Section id="certifications">
      <SectionHeader id="certifications" path="certifications" title={t('Certifications', 'Certifications')} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.certifications.map((c) => (
          <button
            key={c.id}
            type="button"
            onMouseMove={spotlight}
            onClick={() => setSelected(c)}
            className="card card-spotlight reveal flex flex-col p-5 text-left"
          >
            <div className="relative flex w-full items-start justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface-2">
                <BadgeCheck className={`h-5 w-5 ${c.credentialUrl ? 'text-green' : 'text-accent'}`} />
              </span>
              <span className="font-mono text-xs text-muted">{c.issueDate}</span>
            </div>
            <p className="relative mt-4 font-semibold leading-snug">{c.title}</p>
            <p className="relative mt-1 text-sm text-muted">{c.issuer}</p>
            {c.credentialUrl && <p className="relative mt-3 font-mono text-xs text-green">{t('✔ vérifiable', '✔ verifiable')}</p>}
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} label={selected?.title ?? ''}>
        {selected && (
          <div className="space-y-4 p-6 sm:p-8">
            <h3 className="pr-8 text-2xl font-semibold tracking-tight">{selected.title}</h3>
            <p className="text-muted">
              {selected.issuer}, {selected.issueDate}
            </p>
            {l(selected.description) && <p>{l(selected.description)}</p>}
            {selected.skills.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {selected.skills.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            )}
            {selected.credentialId && (
              <p className="text-sm">
                <span className="text-muted">{t('Identifiant', 'Credential ID')} : </span>
                <span className="break-all font-mono">{selected.credentialId}</span>
              </p>
            )}
            {safeUrl(selected.credentialUrl) && (
              <a href={safeUrl(selected.credentialUrl)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <ExternalLink className="h-4 w-4" />
                {t('Vérifier le certificat', 'Verify credential')}
              </a>
            )}
          </div>
        )}
      </Modal>
    </Section>
  );
};
