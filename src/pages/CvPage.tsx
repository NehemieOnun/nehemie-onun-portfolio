import React, { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { parseSkill } from '../../shared/utils';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { onLinkClick } from '../lib/router';
import { safeUrl } from '../lib/safeUrl';

/** CV généré à partir du contenu du site, prêt à imprimer ou enregistrer en PDF. */
export const CvPage: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  const p = site.profile;

  useEffect(() => {
    document.title = `CV — ${p.name}`;
  }, [p.name]);

  const contact = [p.email, p.phone, l(p.location), ...site.socials.map((s) => safeUrl(s.url)?.replace(/^https?:\/\//, ''))].filter(Boolean);

  return (
    <div className="container-page py-10">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <a href="/" onClick={onLinkClick} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          {t('Retour au site', 'Back to site')}
        </a>
        <button type="button" onClick={() => window.print()} className="btn btn-primary">
          <Printer className="h-4 w-4" />
          {t('Imprimer ou enregistrer en PDF', 'Print or save as PDF')}
        </button>
      </div>

      <div className="print-sheet mx-auto max-w-3xl space-y-8 rounded-xl border border-line bg-surface p-8 sm:p-12">
        <header>
          <h1 className="display text-4xl">{p.name}</h1>
          <p className="mt-2 text-lg font-semibold text-accent">{l(p.title)}</p>
          <p className="mt-3 text-sm text-muted">{contact.join('  |  ')}</p>
        </header>

        <section>
          <h2 className="heading border-b border-line pb-1 text-lg">{t('Profil', 'Profile')}</h2>
          <p className="mt-3">{l(p.bio)}</p>
        </section>

        {site.timeline.length > 0 && (
          <section>
            <h2 className="heading border-b border-line pb-1 text-lg">{t('Parcours', 'Experience and education')}</h2>
            <ul className="mt-3 space-y-3">
              {site.timeline.map((e) => (
                <li key={e.id} className="grid grid-cols-[6.5rem_1fr] gap-4">
                  <span className="text-sm font-semibold text-muted">{e.year}</span>
                  <div>
                    <p className="font-semibold">
                      {l(e.title)}
                      {l(e.institution) && <span className="font-normal text-muted">, {l(e.institution)}</span>}
                    </p>
                    {l(e.description) && <p className="text-sm">{l(e.description)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {site.projects.length > 0 && (
          <section>
            <h2 className="heading border-b border-line pb-1 text-lg">{t('Projets', 'Projects')}</h2>
            <ul className="mt-3 space-y-3">
              {site.projects.map((pr) => (
                <li key={pr.id}>
                  <p className="font-semibold">
                    {pr.title} <span className="text-sm font-normal text-muted">({pr.tags.slice(0, 5).join(', ')})</span>
                  </p>
                  <p className="text-sm">{l(pr.description)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {site.skillCategories.length > 0 && (
          <section>
            <h2 className="heading border-b border-line pb-1 text-lg">{t('Compétences', 'Skills')}</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              {site.skillCategories.map((c) => (
                <div key={c.id} className="grid grid-cols-[10rem_1fr] gap-4">
                  <dt className="font-semibold">{l(c.title)}</dt>
                  <dd>{c.skills.map((s) => parseSkill(s).name).join(', ')}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {site.certifications.length > 0 && (
          <section>
            <h2 className="heading border-b border-line pb-1 text-lg">{t('Certifications', 'Certifications')}</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {site.certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold">{c.title}</span>, {c.issuer} ({c.issueDate})
                </li>
              ))}
            </ul>
          </section>
        )}

        {p.spokenLanguages.length > 0 && (
          <section>
            <h2 className="heading border-b border-line pb-1 text-lg">{t('Langues', 'Languages')}</h2>
            <p className="mt-3 text-sm">{p.spokenLanguages.join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );
};
