import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bold, ExternalLink, FileText, Heading2, ImagePlus, Italic, Link2, List, Loader2, Plus, Quote, Search, Trash2 } from 'lucide-react';
import type { Post, PostKind } from '../../shared/types';
import { slugify } from '../../shared/utils';
import { api } from '../lib/api';
import { navigate, onLinkClick } from '../lib/router';
import { Markdown } from '../site/Markdown';
import { ImageField, SelectField, TagsField, TextField, uploadEnabled, uploadImage } from './fields';
import { PageTitle } from './ContentPages';

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

// ----------------------------------------------------------------- Liste
const KIND_INFO: Record<PostKind, { title: string; one: string; intro: string; list: string; publicBase: string }> = {
  article: {
    title: 'Blog',
    one: 'article',
    intro: 'Articles de fond : tutoriels, retours d’expérience, analyses. Rédigés en Markdown.',
    list: '/admin/blog',
    publicBase: '/blog'
  },
  news: {
    title: 'Actualités',
    one: 'actualité',
    intro: 'Annonces courtes : nouveau projet, certification obtenue, participation à un événement…',
    list: '/admin/news',
    publicBase: '/actualites'
  }
};

export const PostsListPage: React.FC<{ kind: PostKind }> = ({ kind }) => {
  const info = KIND_INFO[kind];
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setPosts(null);
    api<Post[]>('/api/admin/posts')
      .then((all) => setPosts(all.filter((p) => p.kind === kind)))
      .catch((e) => setError(e.message));
  }, [kind]);

  const q = query.trim().toLowerCase();
  const shown = (posts ?? []).filter(
    (p) =>
      (filter === 'all' || (filter === 'published' ? p.published : !p.published)) &&
      (!q || `${p.title.fr} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(q))
  );
  const count = (f: typeof filter) => (posts ?? []).filter((p) => f === 'all' || (f === 'published' ? p.published : !p.published)).length;

  return (
    <>
      <PageTitle title={info.title} intro={info.intro}>
        <a href={`/admin/posts/new?kind=${kind}`} onClick={onLinkClick} className="btn btn-accent">
          <Plus className="h-4 w-4" />
          {kind === 'news' ? 'Nouvelle actualité' : 'Nouvel article'}
        </a>
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
            <input className="field py-1.5 pl-9" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher un article" />
          </div>
        </div>

        {error && <p className="p-4 text-danger">{error}</p>}
        {!posts && !error && <p className="p-4 text-muted">Chargement…</p>}
        {posts && shown.length === 0 && (
          <div className="p-10 text-center text-muted">
            <FileText className="mx-auto mb-3 h-8 w-8" />
            {posts.length === 0 ? `Aucun(e) ${info.one} pour le moment. Rédigez le premier ou la première.` : 'Aucun résultat.'}
          </div>
        )}
        {shown.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted">
                <tr className="border-b border-line">
                  <th className="px-4 py-3 font-medium">Titre</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((p) => (
                  <tr key={p.id} className="group cursor-pointer hover:bg-surface-2/60" onClick={() => navigate(`/admin/posts/${p.id}`)}>
                    <td className="px-4 py-3.5">
                      <a href={`/admin/posts/${p.id}`} onClick={(e) => { e.stopPropagation(); onLinkClick(e); }} className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt="" className="h-9 w-14 shrink-0 rounded-md object-cover" />
                        ) : (
                          <span className="h-9 w-14 shrink-0 rounded-md bg-gradient-to-br from-brand/25 to-navy/15" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-medium group-hover:text-accent">{p.title.fr}</span>
                          <span className="block truncate text-xs text-muted">
                            {info.publicBase}/{p.slug}
                          </span>
                        </span>
                      </a>
                    </td>
                    <td className="hidden px-4 py-3.5 text-muted md:table-cell">
                      {p.kind === 'news' ? 'Actualité' : 'Article'}
                      {p.category ? ` · ${p.category}` : ''}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.published ? 'bg-green/15 text-green' : 'bg-surface-2 text-muted'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.published ? 'bg-green' : 'bg-muted'}`} />
                        {p.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3.5 font-mono text-xs text-muted sm:table-cell">{fmt(p.publishedAt ?? p.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

// ----------------------------------------------------------------- Éditeur Markdown
const MarkdownEditor: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [uploading, setUploading] = useState(false);

  /** Entoure la sélection (ou insère) du texte Markdown. */
  const wrap = (before: string, after = '', placeholder = 'texte') => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };
  const linePrefix = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart));
    requestAnimationFrame(() => el.focus());
  };
  const insertImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      wrap(`\n![`, `](${url})\n`, 'description de l’image');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Échec du téléversement.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const tools = [
    { icon: Heading2, label: 'Intertitre', run: () => linePrefix('## ') },
    { icon: Bold, label: 'Gras', run: () => wrap('**', '**') },
    { icon: Italic, label: 'Italique', run: () => wrap('*', '*') },
    { icon: Link2, label: 'Lien', run: () => wrap('[', '](https://)', 'texte du lien') },
    { icon: List, label: 'Liste', run: () => linePrefix('- ') },
    { icon: Quote, label: 'Citation', run: () => linePrefix('> ') }
  ];

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="label mb-0">{label}</span>
        <div className="flex rounded-lg border border-line p-0.5 text-sm">
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1 ${tab === t ? 'bg-sunken font-semibold' : 'text-muted'}`}
            >
              {t === 'write' ? 'Écrire' : 'Aperçu'}
            </button>
          ))}
        </div>
      </div>
      {tab === 'write' ? (
        <div className="rounded-lg border border-line focus-within:border-accent">
          <div className="flex flex-wrap gap-0.5 border-b border-line p-1">
            {tools.map(({ icon: Icon, label: l, run }) => (
              <button key={l} type="button" onClick={run} className="rounded-md p-2 text-muted hover:bg-sunken hover:text-ink" title={l} aria-label={l}>
                <Icon className="h-4 w-4" />
              </button>
            ))}
            {uploadEnabled && (
              <>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => insertImage(e.target.files?.[0])} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-md p-2 text-muted hover:bg-sunken hover:text-ink"
                  title="Insérer une image"
                  aria-label="Insérer une image"
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                </button>
              </>
            )}
          </div>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={18}
            className="block w-full resize-y rounded-b-lg bg-surface p-3 font-mono text-sm leading-relaxed outline-none"
            aria-label={label}
          />
        </div>
      ) : (
        <div className="min-h-[18rem] rounded-lg border border-line bg-surface p-5">
          {value.trim() ? <Markdown source={value} /> : <p className="text-muted">Rien à afficher.</p>}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------- Formulaire
type Draft = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

const blank: Draft = {
  slug: '',
  kind: 'article',
  title: { fr: '', en: '' },
  excerpt: { fr: '', en: '' },
  content: { fr: '', en: '' },
  image: '',
  category: '',
  tags: [],
  published: false,
  publishedAt: null
};

export const PostEditorPage: React.FC<{ id: string | null }> = ({ id }) => {
  const initialKind: PostKind = new URLSearchParams(window.location.search).get('kind') === 'news' ? 'news' : 'article';
  const [draft, setDraft] = useState<Draft | null>(id ? null : { ...blank, kind: initialKind });
  const [original, setOriginal] = useState<Post | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!id);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id || original?.id === id) return;
    api<Post[]>('/api/admin/posts')
      .then((all) => {
        const p = all.find((x) => x.id === id);
        if (!p) throw new Error('Article introuvable.');
        setOriginal(p);
        setDraft(p);
      })
      .catch((e) => setMessage({ type: 'error', text: e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!draft) return <p className="text-muted">{message?.text ?? 'Chargement…'}</p>;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = async (publish: boolean) => {
    setSaving(true);
    setMessage(null);
    try {
      const body = { ...draft, published: publish, slug: draft.slug || slugify(draft.title.fr) };
      const saved = id
        ? await api<Post>(`/api/admin/posts/${id}`, { method: 'PUT', json: body })
        : await api<Post>('/api/admin/posts', { method: 'POST', json: body });
      setOriginal(saved);
      setDraft(saved);
      setMessage({ type: 'ok', text: publish ? 'Article publié.' : 'Brouillon enregistré.' });
      try {
        localStorage.removeItem('site_content_cache_v2');
      } catch {
        /* ignore */
      }
      if (!id) navigate(`/admin/posts/${saved.id}`, { replace: true });
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Échec de l’enregistrement.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!id || !window.confirm('Supprimer définitivement cet article ?')) return;
    try {
      await api(`/api/admin/posts/${id}`, { method: 'DELETE' });
      navigate(KIND_INFO[draft?.kind ?? 'article'].list);
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Échec de la suppression.' });
    }
  };

  return (
    <>
      <a href={KIND_INFO[draft.kind].list} onClick={onLinkClick} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        {KIND_INFO[draft.kind].title}
      </a>
      <PageTitle title={id ? `Modifier : ${KIND_INFO[draft.kind].one}` : draft.kind === 'news' ? 'Nouvelle actualité' : 'Nouvel article'}>
        {original?.published && (
          <a href={`${KIND_INFO[original.kind].publicBase}/${original.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink className="h-4 w-4" />
            Voir sur le site
          </a>
        )}
      </PageTitle>

      <div className="grid gap-8 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <div className="flex rounded-lg border border-line p-0.5 text-sm w-fit" role="tablist" aria-label="Langue du contenu">
            {(['fr', 'en'] as const).map((l) => (
              <button
                key={l}
                role="tab"
                aria-selected={lang === l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-md px-3 py-1 ${lang === l ? 'bg-sunken font-semibold' : 'text-muted'}`}
              >
                {l === 'fr' ? 'Français' : 'English (facultatif)'}
              </button>
            ))}
          </div>
          <TextField
            label="Titre"
            value={draft.title[lang]}
            onChange={(v) => {
              setDraft((d) => {
                if (!d) return d;
                const title = { ...d.title, [lang]: v };
                return { ...d, title, slug: !slugTouched && lang === 'fr' ? slugify(v) : d.slug };
              });
            }}
          />
          <TextField
            label="Résumé"
            value={draft.excerpt[lang]}
            onChange={(v) => set('excerpt', { ...draft.excerpt, [lang]: v })}
            multiline
            rows={2}
            hint="Affiché dans la liste des articles."
          />
          <MarkdownEditor key={lang} label="Contenu" value={draft.content[lang]} onChange={(v) => set('content', { ...draft.content, [lang]: v })} />
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <div className="card space-y-3 p-5">
            <p className="text-sm">
              Statut :{' '}
              <span className="font-semibold">{draft.published ? `publié le ${fmt(draft.publishedAt)}` : 'brouillon'}</span>
            </p>
            <button type="button" className="btn btn-accent w-full" disabled={saving || !draft.title.fr.trim()} onClick={() => save(true)}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {draft.published ? 'Mettre à jour' : 'Publier'}
            </button>
            <button type="button" className="btn btn-secondary w-full" disabled={saving || !draft.title.fr.trim()} onClick={() => save(false)}>
              {draft.published ? 'Dépublier (brouillon)' : 'Enregistrer le brouillon'}
            </button>
            {!draft.title.fr.trim() && <p className="text-xs text-muted">Le titre en français est obligatoire.</p>}
            {message && (
              <p role="status" className={`text-sm ${message.type === 'ok' ? 'text-accent' : 'text-danger'}`}>
                {message.text}
              </p>
            )}
          </div>
          <div className="card space-y-5 p-5">
            <SelectField<PostKind>
              label="Type"
              value={draft.kind}
              options={[
                { value: 'article', label: 'Article de blog' },
                { value: 'news', label: 'Actualité' }
              ]}
              onChange={(v) => set('kind', v)}
            />
            <TextField label="Catégorie" value={draft.category} onChange={(v) => set('category', v)} placeholder="Cybersécurité, IA…" />
            <TagsField label="Mots-clés" value={draft.tags} onChange={(v) => set('tags', v)} />
            <ImageField label="Image de couverture" value={draft.image} onChange={(v) => set('image', v)} />
            <TextField
              label="Adresse de l'article"
              value={draft.slug}
              onChange={(v) => {
                setSlugTouched(true);
                set('slug', slugify(v));
              }}
              hint={`/blog/${draft.slug || '…'}`}
            />
            {draft.published && (
              <TextField
                label="Date de publication"
                type="date"
                value={draft.publishedAt ? draft.publishedAt.slice(0, 10) : ''}
                onChange={(v) => set('publishedAt', v ? new Date(v).toISOString() : null)}
              />
            )}
          </div>
          {id && (
            <button type="button" className="btn btn-ghost w-full text-danger" onClick={remove}>
              <Trash2 className="h-4 w-4" />
              Supprimer l’article
            </button>
          )}
        </aside>
      </div>
    </>
  );
};

