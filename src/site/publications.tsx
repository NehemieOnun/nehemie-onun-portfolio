import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Clock, Download, ExternalLink, FileText, Globe, Images, MapPin, X } from 'lucide-react';
import type { AlbumItem, DocumentCategory, DocumentItem, EventItem, EventKind } from '../../shared/types';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { spotlight, useReveal } from '../hooks/useFx';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { onLinkClick } from '../lib/router';
import { safeUrl } from '../lib/safeUrl';
import { Section, SectionHeader } from './ui';

const EVENT_KIND: Record<EventKind, { fr: string; en: string }> = {
  conference: { fr: 'Conférence', en: 'Conference' },
  training: { fr: 'Formation', en: 'Training' },
  hackathon: { fr: 'Hackathon', en: 'Hackathon' },
  meetup: { fr: 'Rencontre', en: 'Meetup' },
  volunteering: { fr: 'Volontariat', en: 'Volunteering' },
  other: { fr: 'Événement', en: 'Event' }
};

const DOC_CATEGORY: Record<DocumentCategory, { fr: string; en: string }> = {
  cv: { fr: 'CV', en: 'Resume' },
  report: { fr: 'Rapport', en: 'Report' },
  thesis: { fr: 'Mémoire / TFC', en: 'Thesis' },
  certificate: { fr: 'Attestation', en: 'Certificate' },
  presentation: { fr: 'Présentation', en: 'Presentation' },
  other: { fr: 'Document', en: 'Document' }
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const isUpcoming = (e: EventItem) => (e.endDate || e.date) >= todayStr();

function dateParts(d: string, lang: 'fr' | 'en') {
  const date = new Date(`${d}T12:00:00Z`);
  const loc = lang === 'fr' ? 'fr-FR' : 'en-GB';
  return {
    day: date.toLocaleDateString(loc, { day: '2-digit' }),
    month: date.toLocaleDateString(loc, { month: 'short' }).replace('.', ''),
    year: date.getFullYear(),
    long: date.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  };
}

/** Lien « Voir tout » en en-tête de section. */
const SeeAll: React.FC<{ href: string }> = ({ href }) => {
  const { t } = useLanguage();
  return (
    <a href={href} onClick={onLinkClick} className="btn btn-secondary">
      {t('Tout voir', 'See all')}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
};

const PageHead: React.FC<{ path: string; title: string; intro: string }> = ({ path, title, intro }) => (
  <>
    <p className="kicker">
      <span className="text-muted">~/</span>
      {path}
    </p>
    <h1 className="display mt-3 text-4xl sm:text-6xl">{title}</h1>
    <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>
  </>
);

// ================================================================== Événements
export const EventCard: React.FC<{ event: EventItem }> = ({ event: e }) => {
  const { t, l, language } = useLanguage();
  const d = dateParts(e.date, language);
  const upcoming = isUpcoming(e);
  const link = safeUrl(e.link);
  return (
    <article onMouseMove={spotlight} className="card card-spotlight reveal flex flex-col sm:flex-row">
      <div className="relative flex shrink-0 items-center gap-4 border-b border-line p-5 sm:w-36 sm:flex-col sm:justify-center sm:border-b-0 sm:border-r">
        <div className="text-center">
          <p className="font-mono text-xs uppercase text-accent">{d.month}</p>
          <p className="text-4xl font-semibold tabular-nums leading-none">{d.day}</p>
          <p className="mt-1 font-mono text-xs text-muted">{d.year}</p>
        </div>
        {upcoming && <span className="rounded-full bg-green/15 px-2 py-0.5 text-xs font-medium text-green">{t('À venir', 'Upcoming')}</span>}
      </div>
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <span className="chip w-fit">{EVENT_KIND[e.kind][language]}</span>
        <h3 className="mt-3 text-lg font-semibold">{l(e.title)}</h3>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {e.time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {e.time}
            </span>
          )}
          {(e.location || e.online) && (
            <span className="inline-flex items-center gap-1.5">
              {e.online ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              {e.online ? t('En ligne', 'Online') : e.location}
            </span>
          )}
        </p>
        {l(e.description) && <p className="mt-3 whitespace-pre-line text-muted">{l(e.description)}</p>}
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-5 w-fit">
            <ExternalLink className="h-4 w-4" />
            {upcoming ? t('Infos et inscription', 'Details and registration') : t('En savoir plus', 'Learn more')}
          </a>
        )}
      </div>
      {e.image && <img src={e.image} alt="" loading="lazy" className="hidden w-56 shrink-0 object-cover lg:block" />}
    </article>
  );
};

export const EventsSection: React.FC = () => {
  const { events } = useContent();
  const { t } = useLanguage();
  if (!events.length) return null;
  const upcoming = events.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  const shown = (upcoming.length ? upcoming : events).slice(0, 3);
  return (
    <Section id="events">
      <SectionHeader
        id="events"
        path="evenements"
        title={upcoming.length ? t('Prochains événements', 'Upcoming events') : t('Événements', 'Events')}
        intro={t('Conférences, formations et hackathons auxquels je participe.', 'Conferences, trainings and hackathons I take part in.')}
        action={<SeeAll href="/evenements" />}
      />
      <div className="space-y-4">
        {shown.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </Section>
  );
};

export const EventsListPage: React.FC = () => {
  const { events, status } = useContent();
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();
  const upcoming = events.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => !isUpcoming(e));
  useEffect(() => {
    document.title = `${t('Événements', 'Events')} — Néhémie Onun`;
  }, [t]);
  return (
    <div ref={ref} className="container-page py-14 sm:py-20">
      <PageHead
        path="evenements"
        title={t('Événements', 'Events')}
        intro={t('Conférences, formations, hackathons et rencontres.', 'Conferences, trainings, hackathons and meetups.')}
      />
      {events.length === 0 && <p className="mt-12 text-muted">{status === 'loading' ? t('Chargement…', 'Loading…') : t('Aucun événement pour le moment.', 'No events yet.')}</p>}
      {upcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">{t('À venir', 'Upcoming')}</h2>
          <div className="space-y-4">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xl font-semibold">{t('Passés', 'Past')}</h2>
          <div className="space-y-4">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ================================================================== Galerie
export const AlbumCard: React.FC<{ album: AlbumItem }> = ({ album: a }) => {
  const { t, l, language } = useLanguage();
  const cover = a.cover || a.images[0]?.url;
  const href = `/galerie/${a.id}`;
  return (
    <a href={href} onClick={onLinkClick} onMouseMove={spotlight} className="card card-spotlight reveal group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-brand/20 to-navy/15">
            <Images className="h-8 w-8 text-muted" />
          </div>
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur">
          <Images className="h-3.5 w-3.5" />
          {a.images.length}
        </span>
      </div>
      <div className="relative p-5">
        <h3 className="font-semibold group-hover:text-accent">{l(a.title)}</h3>
        <p className="mt-1 text-sm text-muted">
          {dateParts(a.date, language).long}
          {a.images.length === 0 && ` · ${t('vide', 'empty')}`}
        </p>
      </div>
    </a>
  );
};

export const GallerySection: React.FC = () => {
  const { albums } = useContent();
  const { t } = useLanguage();
  if (!albums.length) return null;
  return (
    <Section id="gallery">
      <SectionHeader
        id="gallery"
        path="galerie"
        title={t('Galerie', 'Gallery')}
        intro={t('Quelques images de mes activités et projets.', 'Pictures of my activities and projects.')}
        action={<SeeAll href="/galerie" />}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.slice(0, 3).map((a) => (
          <AlbumCard key={a.id} album={a} />
        ))}
      </div>
    </Section>
  );
};

export const GalleryListPage: React.FC = () => {
  const { albums, status } = useContent();
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();
  useEffect(() => {
    document.title = `${t('Galerie', 'Gallery')} — Néhémie Onun`;
  }, [t]);
  return (
    <div ref={ref} className="container-page py-14 sm:py-20">
      <PageHead path="galerie" title={t('Galerie', 'Gallery')} intro={t('Albums photo de mes activités et projets.', 'Photo albums of my activities and projects.')} />
      {albums.length === 0 ? (
        <p className="mt-12 text-muted">{status === 'loading' ? t('Chargement…', 'Loading…') : t('Aucun album pour le moment.', 'No albums yet.')}</p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      )}
    </div>
  );
};

const Lightbox: React.FC<{ album: AlbumItem; index: number | null; onIndex: (i: number | null) => void }> = ({ album, index, onIndex }) => {
  const { t } = useLanguage();
  const open = index !== null;
  const close = () => onIndex(null);
  useModalBehavior(open, close);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex(((index ?? 0) + 1) % album.images.length);
      if (e.key === 'ArrowLeft') onIndex(((index ?? 0) - 1 + album.images.length) % album.images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, album.images.length, onIndex]);
  if (index === null) return null;
  const img = album.images[index];
  return (
    <div role="dialog" aria-modal="true" aria-label={img.caption || `Photo ${index + 1}`} className="fixed inset-0 z-50 flex flex-col bg-black/95">
      <div className="flex items-center justify-between p-4 text-sm text-white/80">
        <span className="font-mono">
          {index + 1} / {album.images.length}
        </span>
        <button type="button" onClick={close} className="rounded-full p-2 hover:bg-white/10" aria-label={t('Fermer', 'Close')}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.target === e.currentTarget && close()}>
        <img src={img.url} alt={img.caption} className="max-h-full max-w-full rounded-lg object-contain" />
        {album.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => onIndex((index - 1 + album.images.length) % album.images.length)}
              className="absolute left-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label={t('Précédente', 'Previous')}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => onIndex((index + 1) % album.images.length)}
              className="absolute right-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label={t('Suivante', 'Next')}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {img.caption && <p className="px-4 pb-6 text-center text-white/85">{img.caption}</p>}
    </div>
  );
};

export const AlbumPage: React.FC<{ id: string }> = ({ id }) => {
  const { albums, status } = useContent();
  const { t, l, language } = useLanguage();
  const [index, setIndex] = useState<number | null>(null);
  const album = albums.find((a) => a.id === id);

  useEffect(() => {
    if (album) document.title = `${l(album.title)} — Néhémie Onun`;
  }, [album, l]);

  const back = (
    <a href="/galerie" onClick={onLinkClick} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
      <ArrowLeft className="h-4 w-4" />
      {t('Tous les albums', 'All albums')}
    </a>
  );

  if (!album) {
    return (
      <div className="container-page py-20">
        {back}
        <p className="mt-8 text-muted">{status === 'loading' ? t('Chargement…', 'Loading…') : t('Album introuvable.', 'Album not found.')}</p>
      </div>
    );
  }

  return (
    <div className="container-page py-12 sm:py-16">
      {back}
      <h1 className="display mt-8 text-4xl sm:text-5xl">{l(album.title)}</h1>
      <p className="mt-3 text-muted">
        {dateParts(album.date, language).long} · {album.images.length} photo{album.images.length > 1 ? 's' : ''}
      </p>
      {l(album.description) && <p className="mt-5 max-w-3xl whitespace-pre-line text-lg">{l(album.description)}</p>}
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {album.images.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="group mb-4 block w-full overflow-hidden rounded-xl border border-line text-left"
            aria-label={img.caption || `${t('Agrandir la photo', 'Enlarge photo')} ${i + 1}`}
          >
            <img src={img.url} alt={img.caption} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.02]" />
            {img.caption && <p className="border-t border-line bg-surface px-3 py-2 text-sm text-muted">{img.caption}</p>}
          </button>
        ))}
      </div>
      <Lightbox album={album} index={index} onIndex={setIndex} />
    </div>
  );
};

// ================================================================== Documents
export const DocumentRow: React.FC<{ doc: DocumentItem }> = ({ doc: d }) => {
  const { t, l, language } = useLanguage();
  const href = safeUrl(d.fileUrl);
  const isPdf = /\.pdf($|\?)/i.test(d.fileUrl) || /\.pdf$/i.test(d.fileName);
  return (
    <li className="reveal">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={spotlight}
        className="card card-spotlight group flex items-center gap-4 p-4 sm:p-5"
      >
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-2">
          <FileText className="h-5 w-5 text-accent" />
          {isPdf && <span className="absolute -bottom-1.5 rounded bg-danger px-1 font-mono text-[9px] font-bold text-white">PDF</span>}
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="block font-semibold group-hover:text-accent">{l(d.title)}</span>
          <span className="block truncate text-sm text-muted">
            {DOC_CATEGORY[d.category][language]} · {dateParts(d.date, language).long}
            {l(d.description) ? ` · ${l(d.description)}` : ''}
          </span>
        </span>
        <span className="relative hidden items-center gap-1.5 text-sm font-medium sm:inline-flex">
          <Download className="h-4 w-4" />
          {t('Ouvrir', 'Open')}
        </span>
      </a>
    </li>
  );
};

export const DocumentsSection: React.FC = () => {
  const { documents } = useContent();
  const { t } = useLanguage();
  if (!documents.length) return null;
  return (
    <Section id="documents">
      <SectionHeader
        id="documents"
        path="documents"
        title={t('Documents', 'Documents')}
        intro={t('CV, rapports et attestations à télécharger.', 'Resume, reports and certificates to download.')}
        action={documents.length > 4 ? <SeeAll href="/documents" /> : undefined}
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {documents.slice(0, 4).map((d) => (
          <DocumentRow key={d.id} doc={d} />
        ))}
      </ul>
    </Section>
  );
};

export const DocumentsListPage: React.FC = () => {
  const { documents, status } = useContent();
  const { t, language } = useLanguage();
  const ref = useReveal<HTMLDivElement>();
  const [cat, setCat] = useState<'all' | DocumentCategory>('all');
  const cats = (Object.keys(DOC_CATEGORY) as DocumentCategory[]).filter((c) => documents.some((d) => d.category === c));
  const shown = documents.filter((d) => cat === 'all' || d.category === cat);
  useEffect(() => {
    document.title = `Documents — Néhémie Onun`;
  }, []);
  return (
    <div ref={ref} className="container-page py-14 sm:py-20">
      <PageHead path="documents" title="Documents" intro={t('CV, rapports, mémoires, attestations et présentations.', 'Resume, reports, theses, certificates and presentations.')} />
      {cats.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {(['all', ...cats] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs ${cat === c ? 'border-accent bg-accent-soft' : 'border-line text-muted hover:text-ink'}`}
            >
              {c === 'all' ? t('tous', 'all') : DOC_CATEGORY[c][language].toLowerCase()}
            </button>
          ))}
        </div>
      )}
      {documents.length === 0 ? (
        <p className="mt-12 text-muted">{status === 'loading' ? t('Chargement…', 'Loading…') : t('Aucun document pour le moment.', 'No documents yet.')}</p>
      ) : (
        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {shown.map((d) => (
            <DocumentRow key={d.id} doc={d} />
          ))}
        </ul>
      )}
    </div>
  );
};

