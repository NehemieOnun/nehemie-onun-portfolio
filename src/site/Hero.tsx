import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Clock, FileText, GraduationCap, Languages, Mail, MapPin, Sparkles } from 'lucide-react';
import { parseSkill } from '../../shared/utils';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { prefersReducedMotion, spotlight, useClock, useReveal } from '../hooks/useFx';
import { onLinkClick } from '../lib/router';
import { safeUrl } from '../lib/safeUrl';
import { SOCIAL_ICONS, TerminalWindow } from './ui';

// ------------------------------------------------------------------ Terminal animé
interface Line {
  cmd: string;
  out: React.ReactNode;
}

const TypedTerminal: React.FC<{ lines: Line[]; host: string }> = ({ lines, host }) => {
  const reduce = prefersReducedMotion();
  const [step, setStep] = useState(reduce ? lines.length : 0); // nombre de commandes terminées
  const [typed, setTyped] = useState(0); // caractères tapés de la commande en cours

  useEffect(() => {
    if (step >= lines.length) return;
    const cmd = lines[step].cmd;
    if (typed < cmd.length) {
      const id = setTimeout(() => setTyped((n) => n + 1), 38 + Math.random() * 40);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setStep((s) => s + 1);
      setTyped(0);
    }, 380);
    return () => clearTimeout(id);
  }, [step, typed, lines]);

  const prompt = (
    <span className="select-none">
      <span className="font-semibold text-accent">{host}</span>
      <span className="text-muted">:</span>
      <span className="text-cyan">~</span>
      <span className="text-muted">$ </span>
    </span>
  );

  return (
    <TerminalWindow title={`${host} — zsh`}>
      <div className="min-h-[19rem] space-y-3 p-5 font-mono text-[0.82rem] leading-relaxed sm:text-sm" aria-hidden="true">
        {lines.slice(0, step).map((l, i) => (
          <div key={i}>
            <p>
              {prompt}
              {l.cmd}
            </p>
            <div className="mt-1">{l.out}</div>
          </div>
        ))}
        <p>
          {prompt}
          {step < lines.length ? lines[step].cmd.slice(0, typed) : ''}
          <span className="cursor-blink ml-0.5" />
        </p>
      </div>
    </TerminalWindow>
  );
};

// ------------------------------------------------------------------ Hero
export const Hero: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  const p = site.profile;
  const cv = safeUrl(p.cvUrl) ?? '/cv';
  const host = `${p.shortName.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}@lubumbashi`;
  const stack = site.skillCategories.flatMap((c) => c.skills.map((s) => parseSkill(s).name)).slice(0, 8);

  const lines = useMemo<Line[]>(
    () => [
      { cmd: 'whoami', out: <p className="text-ink">{p.name}</p> },
      { cmd: 'cat role.txt', out: <p className="text-accent">{l(p.title)}</p> },
      {
        cmd: 'ls stack/',
        out: (
          <p className="flex flex-wrap gap-x-4 gap-y-0.5 text-cyan">
            {stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        )
      },
      site.settings.availableForWork
        ? {
            cmd: 'echo $STATUS',
            out: (
              <p className="text-green">
                <span aria-hidden="true">✔ </span>
                {l(p.availability)}
              </p>
            )
          }
        : { cmd: 'cat location.txt', out: <p className="text-cyan">{l(p.location)}</p> }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.name, l(p.title), l(p.availability), stack.join(), site.settings.availableForWork]
  );

  return (
    <section id="top" aria-label={p.name} className="relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      <div aria-hidden="true" className="bg-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />

      <div className="container-page relative grid items-center gap-14 pb-10 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_1fr] lg:pb-16">
        <div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 py-1 pl-1.5 pr-3 text-sm text-muted backdrop-blur hover:border-line-strong"
          >
            {site.settings.availableForWork && (
              <span className="relative flex h-5 items-center gap-1.5 rounded-full bg-green/15 px-2 text-xs font-medium text-green">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
                </span>
                {t('Disponible', 'Available')}
              </span>
            )}
            {l(p.studyLevel)}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl xl:text-7xl">
            <span className="text-gradient">{p.name}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">{l(p.headline)}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            {site.settings.sections.projects && (
              <a href="#projects" className="btn btn-accent">
                {t('Voir mes projets', 'See my projects')}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            <a href="#contact" className="btn btn-secondary">
              <Mail className="h-4 w-4" />
              {t('Me contacter', 'Contact me')}
            </a>
            <a
              href={cv}
              onClick={cv.startsWith('/') ? onLinkClick : undefined}
              target={cv.startsWith('/') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <FileText className="h-4 w-4" />
              CV
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {l(p.location)}
            </span>
            {site.socials.length > 0 && (
              <span className="flex items-center gap-1">
                {site.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon] ?? SOCIAL_ICONS.website;
                  const href = safeUrl(s.url);
                  return href ? (
                    <a
                      key={s.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-2 hover:text-ink"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ) : null;
                })}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-8 rounded-[2rem] bg-gradient-to-tr from-brand/15 via-transparent to-navy/15 blur-3xl" />
          <TypedTerminal lines={lines} host={host} />
          {p.photo && (
            <img
              src={p.photo}
              alt={p.name}
              width={112}
              height={112}
              fetchPriority="high"
              className="absolute -right-3 -top-8 h-24 w-24 rounded-2xl border-4 border-canvas object-cover shadow-xl sm:-right-6 sm:h-28 sm:w-28"
            />
          )}
        </div>
      </div>
    </section>
  );
};

// ------------------------------------------------------------------ Grille « bento »
const BentoCard: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div onMouseMove={spotlight} className={`card card-spotlight reveal p-6 ${className}`}>
    <div className="relative h-full">{children}</div>
  </div>
);

export const Bento: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  const ref = useReveal<HTMLElement>();
  const time = useClock('Africa/Lubumbashi');
  const p = site.profile;
  const featured = site.projects.find((x) => x.featured) ?? site.projects[0];
  const allSkills = site.skillCategories.flatMap((c) => c.skills.map((s) => parseSkill(s).name));
  const github = site.socials.find((s) => s.icon === 'github' && safeUrl(s.url));

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="relative py-20">
      <div className="container-page">
        <h2 id="about-title" className="sr-only">
          {t('À propos', 'About')}
        </h2>
        <div className="grid auto-rows-[minmax(10rem,auto)] gap-4 md:grid-cols-4">
          {/* Présentation */}
          <BentoCard className="md:col-span-2 md:row-span-2">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-4">
                {p.photo ? (
                  <img src={p.photo} alt="" className="h-16 w-16 rounded-2xl object-cover" loading="lazy" />
                ) : (
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-navy to-brand font-mono text-lg font-bold text-white">
                    {p.initials}
                  </span>
                )}
                <div>
                  <p className="text-lg font-semibold">{p.name}</p>
                  <p className="text-sm text-muted">{l(p.title)}</p>
                </div>
              </div>
              <p className="mt-6 text-[1.05rem] leading-relaxed">{l(p.bio)}</p>
              <dl className="mt-auto grid gap-3 pt-6 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2 text-muted">
                  <GraduationCap className="h-4 w-4 text-accent" />
                  <dd>{l(p.studyLevel)}</dd>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Languages className="h-4 w-4 text-accent" />
                  <dd>{p.spokenLanguages.join(', ')}</dd>
                </div>
              </dl>
            </div>
          </BentoCard>

          {/* Chiffres */}
          {site.settings.sections.stats &&
            site.stats.slice(0, 2).map((s) => (
              <BentoCard key={s.id}>
                <div className="flex h-full flex-col justify-between">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{s.value}</p>
                    <p className="mt-1 text-sm text-muted">{l(s.label)}</p>
                  </div>
                </div>
              </BentoCard>
            ))}

          {/* Heure locale */}
          <BentoCard>
            <div className="flex h-full flex-col justify-between">
              <Clock className="h-5 w-5 text-cyan" />
              <div>
                <p className="font-mono text-4xl font-medium tabular-nums">{time}</p>
                <p className="mt-1 text-sm text-muted">{t(`à ${l(p.location).split(',')[0]} (UTC+2)`, `in ${l(p.location).split(',')[0]} (UTC+2)`)}</p>
              </div>
            </div>
          </BentoCard>

          {/* Projet phare */}
          {featured && (
            <BentoCard className="!p-0">
              <a href="#projects" className="group flex h-full flex-col">
                {featured.image ? (
                  <img src={featured.image} alt="" loading="lazy" className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-28 bg-gradient-to-br from-brand/35 to-navy/25" />
                )}
                <div className="flex flex-1 items-center justify-between gap-2 p-4">
                  <div>
                    <p className="text-xs text-muted">{t('Projet phare', 'Featured project')}</p>
                    <p className="font-semibold">{featured.title}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>
              </a>
            </BentoCard>
          )}

          {/* Stack défilante */}
          <BentoCard className="md:col-span-3 !px-0">
            <p className="px-6 font-mono text-xs text-muted">{t('// technologies que j’utilise', '// technologies I use')}</p>
            <div className="marquee-wrap mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
              <div className="marquee gap-3">
                {[...allSkills, ...allSkills].map((s, i) => (
                  <span key={i} className="mr-3 rounded-xl border border-line bg-surface-2 px-4 py-2 font-mono text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-5 px-6 text-sm text-muted">{l(p.vision)}</p>
          </BentoCard>

          {/* GitHub / contact */}
          <BentoCard>
            {github ? (
              <a href={safeUrl(github.url)} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between">
                <SOCIAL_ICONS.github className="h-7 w-7" />
                <div>
                  <p className="font-semibold">GitHub</p>
                  <p className="flex items-center gap-1 text-sm text-muted group-hover:text-ink">
                    {t('Voir mon code', 'See my code')}
                    <ArrowUpRight className="h-4 w-4" />
                  </p>
                </div>
              </a>
            ) : (
              <a href="#contact" className="group flex h-full flex-col justify-between">
                <Mail className="h-7 w-7" />
                <p className="font-semibold">{t('Écrivez-moi', 'Write to me')}</p>
              </a>
            )}
          </BentoCard>
        </div>
      </div>
    </section>
  );
};
