import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ExternalLink,
  FileText,
  Images,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import type {
  AlbumItem,
  ContentItem,
  DocumentCategory,
  DocumentItem,
  EventItem,
  EventKind,
  GalleryImage,
  ItemType
} from '../../shared/types';
import { api } from '../lib/api';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { PageTitle } from './ContentPages';
import { FileField, ImageField, L10nField, SelectField, TextField, Toggle, uploadEnabled, uploadImage } from './fields';

// ------------------------------------------------------------------ Libellés partagés
export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  conference: 'Conférence',
  training: 'Formation',
  hackathon: 'Hackathon',
  meetup: 'Rencontre',
  volunteering: 'Volontariat',
  other: 'Autre'
};

export const DOC_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  cv: 'CV',
  report: 'Rapport',
  thesis: 'Mémoire / TFC',
  certificate: 'Attestation',
  presentation: 'Présentation',
  other: 'Autre'
};

const fmtDate = (d: string) =>
  d ? new Date(`${d}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const today = () => new Date().toISOString().slice(0, 10);
const empty = { fr: '', en: '' };

// ------------------------------------------------------------------ Panneau latéral d'édition
const Drawer: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer: React.ReactNode }> = ({
  open,
  onClose,
  title,
  children,
  footer
}) => {
  useModalBehavior(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="flex h-full w-full max-w-2xl flex-col border-l border-line-strong bg-canvas shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">{children}</div>
        <div className="border-t border-line bg-surface px-6 py-4">{footer}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ Gestionnaire générique
interface Config<T extends ContentItem> {
  type: ItemType;
  title: string;
  intro: string;
  one: string;
  newLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  publicPath: string;
  create: () => Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
  columns: { label: string; render: (item: T) => React.ReactNode; className?: string }[];
  thumb: (item: T) => string;
  form: (draft: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}

function ItemsManager<T extends ContentItem>({ config }: { config: Config<T> }) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const Icon = config.icon;

  useEffect(() => {
    api<T[]>(`/api/admin/items/${config.type}`)
      .then(setItems)
      .catch((e) => setError(e.message));
  }, [config.type]);

  const q = query.trim().toLowerCase();
  const shown = (items ?? []).filter(
    (i) =>
      (filter === 'all' || (filter === 'published' ? i.published : !i.published)) &&
      (!q || `${i.title.fr} ${i.description.fr}`.toLowerCase().includes(q))
  );
  const count = (f: typeof filter) => (items ?? []).filter((i) => f === 'all' || (f === 'published' ? i.published : !i.published)).length;

  const openNew = () => {
    setFormError('');
    setDraft({ ...(config.create() as T), id: '', createdAt: '', updatedAt: '' });
  };
  const openEdit = (item: T) => {
    setFormError('');
    setDraft(structuredClone(item));
  };
  const close = () => {
    if (!saving) setDraft(null);
  };

  const save = async (published: boolean) => {
    if (!draft) return;
    setSaving(true);
    setFormError('');
    try {
      const body = { ...draft, published };
      const saved = draft.id
        ? await api<T>(`/api/admin/items/${config.type}/${draft.id}`, { method: 'PUT', json: body })
        : await api<T>(`/api/admin/items/${config.type}`, { method: 'POST', json: body });
      setItems((list) => {
        const rest = (list ?? []).filter((i) => i.id !== saved.id);
        return [saved, ...rest].sort((a, b) => b.date.localeCompare(a.date));
      });
      try {
        localStorage.removeItem('site_content_cache_v2');
      } catch {
        /* ignore */
      }
      setDraft(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Échec de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: T) => {
    if (!window.confirm(`Supprimer « ${item.title.fr} » ?`)) return;
    await api(`/api/admin/items/${config.type}/${item.id}`, { method: 'DELETE' });
    setItems((list) => list?.filter((i) => i.id !== item.id) ?? null);
    setDraft(null);
  };

  return (
    <>
      <PageTitle title={config.title} intro={config.intro}>
        <div className="flex gap-2">
          <a href={config.publicPath} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink className="h-4 w-4" />
            Page publique
          </a>
          <button type="button" onClick={openNew} className="btn btn-accent">
            <Plus className="h-4 w-4" />
            {config.newLabel}
          </button>
        </div>
      </PageTitle>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div className="flex gap-1 text-sm">
            {(
              [
                ['all', 'Tous'],
                ['published', 'Publiés'],
                ['draft', 'Brouillons']
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                aria-pressed={filter === id}
                className={`rounded-lg px-3 py-1.5 ${filter === id ? 'bg-surface-2 font-medium' : 'text-muted hover:text-ink'}`}
              >
                {label} <span className="font-mono text-xs text-muted">{count(id)}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="field py-1.5 pl-9" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher" />
          </div>
        </div>

        {error && <p className="p-4 text-danger">{error}</p>}
        {!items && !error && <p className="p-4 text-muted">Chargement…</p>}
        {items && shown.length === 0 && (
          <div className="p-10 text-center text-muted">
            <Icon className="mx-auto mb-3 h-8 w-8" />
            {items.length === 0 ? (
              <>
                <p>Rien ici pour le moment.</p>
                <button type="button" onClick={openNew} className="btn btn-secondary mt-4">
                  <Plus className="h-4 w-4" />
                  {config.newLabel}
                </button>
              </>
            ) : (
              'Aucun résultat.'
            )}
          </div>
        )}
        {shown.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted">
                <tr className="border-b border-line">
                  <th className="px-4 py-3 font-medium">Titre</th>
                  {config.columns.map((c) => (
                    <th key={c.label} className={`px-4 py-3 font-medium ${c.className ?? ''}`}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((item) => (
                  <tr key={item.id} className="group cursor-pointer hover:bg-surface-2/60" onClick={() => openEdit(item)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {config.thumb(item) ? (
                          <img src={config.thumb(item)} alt="" className="h-9 w-14 shrink-0 rounded-md object-cover" />
                        ) : (
                          <span className="grid h-9 w-14 shrink-0 place-items-center rounded-md bg-gradient-to-br from-brand/25 to-navy/15">
                            <Icon className="h-4 w-4 text-muted" />
                          </span>
                        )}
                        <span className="truncate font-medium group-hover:text-accent">{item.title.fr}</span>
                      </div>
                    </td>
                    {config.columns.map((c) => (
                      <td key={c.label} className={`px-4 py-3.5 text-muted ${c.className ?? ''}`}>
                        {c.render(item)}
                      </td>
                    ))}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.published ? 'bg-green/15 text-green' : 'bg-surface-2 text-muted'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${item.published ? 'bg-green' : 'bg-muted'}`} />
                        {item.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? `Modifier : ${config.one}` : config.newLabel}
        footer={
          draft && (
            <div className="flex flex-wrap items-center gap-2">
              {draft.id && (
                <button type="button" className="btn btn-ghost text-danger" onClick={() => remove(draft)} disabled={saving}>
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              )}
              {formError && (
                <p role="alert" className="text-sm text-danger">
                  {formError}
                </p>
              )}
              <div className="ml-auto flex gap-2">
                <button type="button" className="btn btn-secondary" disabled={saving || !draft.title.fr.trim()} onClick={() => save(false)}>
                  {draft.published ? 'Dépublier' : 'Brouillon'}
                </button>
                <button type="button" className="btn btn-accent" disabled={saving || !draft.title.fr.trim()} onClick={() => save(true)}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {draft.published ? 'Mettre à jour' : 'Publier'}
                </button>
              </div>
            </div>
          )
        }
      >
        {draft && config.form(draft, (patch) => setDraft((d) => (d ? ({ ...d, ...patch } as T) : d)))}
      </Drawer>
    </>
  );
}

// ------------------------------------------------------------------ Événements
export const EventsPage: React.FC = () => (
  <ItemsManager<EventItem>
    config={{
      type: 'event',
      title: 'Événements',
      intro: 'Conférences, formations, hackathons… Les événements à venir sont mis en avant sur le site.',
      one: 'événement',
      newLabel: 'Nouvel événement',
      icon: CalendarDays,
      publicPath: '/evenements',
      create: () => ({
        type: 'event',
        title: { ...empty },
        description: { ...empty },
        published: false,
        date: today(),
        kind: 'conference',
        endDate: '',
        time: '',
        location: '',
        online: false,
        link: '',
        image: ''
      }),
      thumb: (e) => e.image,
      columns: [
        { label: 'Date', render: (e) => fmtDate(e.date) },
        { label: 'Type', render: (e) => EVENT_KIND_LABELS[e.kind], className: 'hidden md:table-cell' },
        { label: 'Lieu', render: (e) => (e.online ? 'En ligne' : e.location || '—'), className: 'hidden lg:table-cell' }
      ],
      form: (e, set) => (
        <>
          <L10nField label="Titre" value={e.title} onChange={(title) => set({ title })} />
          <div className="grid gap-5 sm:grid-cols-3">
            <SelectField<EventKind>
              label="Type"
              value={e.kind}
              options={Object.entries(EVENT_KIND_LABELS).map(([value, label]) => ({ value: value as EventKind, label }))}
              onChange={(kind) => set({ kind })}
            />
            <TextField label="Date" type="date" value={e.date} onChange={(date) => set({ date })} />
            <TextField label="Fin (facultatif)" type="date" value={e.endDate} onChange={(endDate) => set({ endDate })} />
          </div>
          <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
            <TextField label="Heure" value={e.time} onChange={(time) => set({ time })} placeholder="14h00" />
            <TextField label="Lieu" value={e.location} onChange={(location) => set({ location })} placeholder="UNILU, Lubumbashi" />
          </div>
          <Toggle label="Événement en ligne" checked={e.online} onChange={(online) => set({ online })} />
          <TextField label="Lien (inscription, programme, replay…)" value={e.link} onChange={(link) => set({ link })} placeholder="https://…" />
          <ImageField label="Image" value={e.image} onChange={(image) => set({ image })} />
          <L10nField label="Description" value={e.description} onChange={(description) => set({ description })} multiline rows={5} />
        </>
      )
    }}
  />
);

// ------------------------------------------------------------------ Galerie
const AlbumImagesEditor: React.FC<{ images: GalleryImage[]; onChange: (images: GalleryImage[]) => void }> = ({ images, onChange }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState('');

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    const list = Array.from(files).slice(0, 30);
    setBusy(list.length);
    const added: GalleryImage[] = [];
    for (const f of list) {
      try {
        added.push({ url: await uploadImage(f), caption: '' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Échec du téléversement.');
      }
      setBusy((n) => n - 1);
    }
    onChange([...images, ...added]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...images];
    const [it] = next.splice(i, 1);
    next.splice(i + dir, 0, it);
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="label">Photos ({images.length})</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <div key={`${img.url}-${i}`} className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="relative">
              <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute right-1 top-1 flex gap-1">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md bg-black/60 p-1 text-white disabled:opacity-30" aria-label="Avancer">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={i === images.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded-md bg-black/60 p-1 text-white disabled:opacity-30"
                  aria-label="Reculer"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="rounded-md bg-black/60 p-1 text-white" aria-label="Retirer">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <input
              className="w-full border-t border-line bg-transparent px-2 py-1.5 text-xs outline-none"
              placeholder="Légende"
              value={img.caption}
              onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
              aria-label={`Légende de la photo ${i + 1}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {uploadEnabled && (
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
            <button type="button" className="btn btn-secondary" disabled={busy > 0} onClick={() => fileRef.current?.click()}>
              {busy > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {busy > 0 ? `Envoi (${busy})…` : 'Téléverser des photos'}
            </button>
          </>
        )}
        <div className="flex min-w-0 flex-1 gap-2">
          <input className="field" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="ou collez l’adresse d’une image" aria-label="Adresse d'une image" />
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!url.trim()}
            onClick={() => {
              onChange([...images, { url: url.trim(), caption: '' }]);
              setUrl('');
            }}
          >
            Ajouter
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </fieldset>
  );
};

export const GalleryPage: React.FC = () => (
  <ItemsManager<AlbumItem>
    config={{
      type: 'album',
      title: 'Galerie photos',
      intro: 'Albums de photos : activités, événements, coulisses de projets.',
      one: 'album',
      newLabel: 'Nouvel album',
      icon: Images,
      publicPath: '/galerie',
      create: () => ({ type: 'album', title: { ...empty }, description: { ...empty }, published: false, date: today(), cover: '', images: [] }),
      thumb: (a) => a.cover || a.images[0]?.url || '',
      columns: [
        { label: 'Date', render: (a) => fmtDate(a.date) },
        { label: 'Photos', render: (a) => a.images.length, className: 'hidden md:table-cell' }
      ],
      form: (a, set) => (
        <>
          <L10nField label="Titre de l'album" value={a.title} onChange={(title) => set({ title })} />
          <TextField label="Date" type="date" value={a.date} onChange={(date) => set({ date })} />
          <L10nField label="Description" value={a.description} onChange={(description) => set({ description })} multiline rows={3} />
          <AlbumImagesEditor images={a.images} onChange={(images) => set({ images })} />
          <ImageField label="Couverture (facultatif)" value={a.cover} onChange={(cover) => set({ cover })} hint="Par défaut : la première photo." />
        </>
      )
    }}
  />
);

// ------------------------------------------------------------------ Documents
export const DocumentsPage: React.FC = () => (
  <ItemsManager<DocumentItem>
    config={{
      type: 'document',
      title: 'Documents',
      intro: 'Fichiers à télécharger : CV, rapports, mémoires, attestations, présentations.',
      one: 'document',
      newLabel: 'Nouveau document',
      icon: FileText,
      publicPath: '/documents',
      create: () => ({ type: 'document', title: { ...empty }, description: { ...empty }, published: false, date: today(), category: 'report', fileUrl: '', fileName: '' }),
      thumb: () => '',
      columns: [
        { label: 'Catégorie', render: (d) => DOC_CATEGORY_LABELS[d.category] },
        { label: 'Date', render: (d) => fmtDate(d.date), className: 'hidden md:table-cell' }
      ],
      form: (d, set) => (
        <>
          <L10nField label="Titre" value={d.title} onChange={(title) => set({ title })} />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField<DocumentCategory>
              label="Catégorie"
              value={d.category}
              options={Object.entries(DOC_CATEGORY_LABELS).map(([value, label]) => ({ value: value as DocumentCategory, label }))}
              onChange={(category) => set({ category })}
            />
            <TextField label="Date" type="date" value={d.date} onChange={(date) => set({ date })} />
          </div>
          <FileField
            label="Fichier"
            value={d.fileUrl}
            onChange={(fileUrl, fileName) => set(fileName ? { fileUrl, fileName } : { fileUrl })}
          />
          <TextField label="Nom affiché du fichier (facultatif)" value={d.fileName} onChange={(fileName) => set({ fileName })} placeholder="rapport-de-stage.pdf" />
          <L10nField label="Description" value={d.description} onChange={(description) => set({ description })} multiline rows={3} />
        </>
      )
    }}
  />
);

