import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Bot,
  Briefcase,
  Check,
  Construction,
  Eye,
  Globe,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Palette,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { Language, SectionId, SiteSettings, ThemePreference } from '../../shared/types';
import { api } from '../lib/api';
import { onLinkClick } from '../lib/router';
import { L10nField, SelectField, Switch, TextField } from './fields';
import { SaveBar, useSiteEditor } from './SiteEditor';
import { PageTitle } from './ContentPages';

export const SECTION_LABELS: Record<SectionId, string> = {
  about: 'À propos',
  stats: 'Chiffres clés',
  skills: 'Compétences',
  timeline: 'Parcours',
  certifications: 'Certifications',
  projects: 'Projets',
  services: 'Services',
  news: 'Actualités',
  blog: 'Blog',
  events: 'Événements',
  gallery: 'Galerie photos',
  documents: 'Documents',
  contact: 'Contact'
};

const SECTION_GROUPS: { title: string; ids: SectionId[] }[] = [
  { title: 'Profil', ids: ['about', 'stats', 'skills', 'timeline', 'certifications'] },
  { title: 'Réalisations', ids: ['projects', 'services'] },
  { title: 'Publications', ids: ['news', 'blog', 'events', 'gallery', 'documents'] },
  { title: 'Contact', ids: ['contact'] }
];

/** Réglages rapides : interrupteurs enregistrés immédiatement. */
const FEATURES: { key: keyof SiteSettings; label: string; hint: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'availableForWork', label: 'Disponible pour missions', hint: 'Badge « Disponible » sur l’accueil', icon: Briefcase },
  { key: 'contactFormEnabled', label: 'Formulaire de contact', hint: 'Sinon, seul le bouton e-mail est affiché', icon: Mail },
  { key: 'chatEnabled', label: 'Assistant IA', hint: 'Bouton de discussion (Gemini)', icon: Bot },
  { key: 'analyticsEnabled', label: 'Statistiques de visite', hint: 'Mesure anonyme, sans cookie', icon: BarChart3 },
  { key: 'showLoginInMenu', label: 'Accès « Espace privé » dans le menu', hint: '/admin reste accessible directement', icon: LockKeyhole },
  { key: 'maintenanceMode', label: 'Mode maintenance', hint: 'Le site public affiche un message d’attente', icon: Construction }
];

function useQuickToggle() {
  const { site, patchSettings } = useSiteEditor();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const toggle = async (key: string, patch: Partial<SiteSettings>) => {
    setBusy(key);
    setError('');
    try {
      await patchSettings(patch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l’enregistrement.');
    } finally {
      setBusy(null);
    }
  };
  return { settings: site?.settings, busy, error, toggle };
}

// ------------------------------------------------------------ Panneau rapide
export const QuickSettings: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { settings, busy, error, toggle } = useQuickToggle();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !settings) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Réglages rapides">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-canvas shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              Réglages rapides
            </h2>
            <p className="text-xs text-muted">Chaque changement est enregistré aussitôt.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost grid h-9 w-9 place-items-center rounded-lg" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <p className="mb-2 font-mono text-[11px] text-muted">Fonctionnalités</p>
            <div className="divide-y divide-line rounded-2xl border border-line px-3">
              {FEATURES.map((f) => (
                <Switch
                  key={f.key}
                  icon={f.icon}
                  label={f.label}
                  hint={busy === f.key ? 'Enregistrement…' : f.hint}
                  checked={!!settings[f.key]}
                  disabled={busy !== null}
                  onChange={(v) => toggle(f.key, { [f.key]: v } as Partial<SiteSettings>)}
                />
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 font-mono text-[11px] text-muted">Apparence par défaut</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['light', 'Clair'],
                  ['dark', 'Sombre'],
                  ['system', 'Auto']
                ] as [ThemePreference, string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => toggle('theme', { defaultTheme: v })}
                  className={`rounded-xl border px-3 py-2 text-sm ${settings.defaultTheme === v ? 'border-accent bg-accent/10 font-medium text-ink' : 'border-line text-muted hover:text-ink'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ['fr', 'Français'],
                  ['en', 'English']
                ] as [Language, string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => toggle('lang', { defaultLanguage: v })}
                  className={`rounded-xl border px-3 py-2 text-sm ${settings.defaultLanguage === v ? 'border-accent bg-accent/10 font-medium text-ink' : 'border-line text-muted hover:text-ink'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 font-mono text-[11px] text-muted">Sections visibles</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SECTION_LABELS) as SectionId[]).map((id) => {
                const on = settings.sections[id];
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    disabled={busy !== null}
                    onClick={() => toggle(`s-${id}`, { sections: { ...settings.sections, [id]: !on } })}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${on ? 'border-accent/50 bg-accent/10 text-ink' : 'border-line text-muted line-through'}`}
                  >
                    {on && <Check className="h-3.5 w-3.5 text-accent" />}
                    {SECTION_LABELS[id]}
                  </button>
                );
              })}
            </div>
          </section>
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className="border-t border-line p-4">
          <a
            href="/admin/settings"
            className="btn btn-secondary w-full"
            onClick={(e) => {
              onClose();
              onLinkClick(e);
            }}
          >
            Tous les paramètres
          </a>
        </footer>
      </aside>
    </div>
  );
};

// ------------------------------------------------------------ Page complète
type Tab = 'general' | 'sections' | 'features' | 'seo' | 'security';
const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'general', label: 'Général', icon: Palette },
  { id: 'sections', label: 'Sections', icon: Eye },
  { id: 'features', label: 'Fonctionnalités', icon: SlidersHorizontal },
  { id: 'seo', label: 'Référencement', icon: Search },
  { id: 'security', label: 'Sécurité', icon: ShieldCheck }
];

const Panel: React.FC<{ title: string; intro?: string; children: React.ReactNode }> = ({ title, intro, children }) => (
  <section className="card space-y-5 p-5 sm:p-6">
    <div className="border-b border-line pb-4">
      <h2 className="font-semibold">{title}</h2>
      {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
    </div>
    {children}
  </section>
);

export const AppSettingsPage: React.FC = () => {
  const { site, update } = useSiteEditor();
  const quick = useQuickToggle();
  const [tab, setTab] = useState<Tab>(() => {
    const h = window.location.hash.slice(1) as Tab;
    return TABS.some((t) => t.id === h) ? h : 'general';
  });
  useEffect(() => {
    window.history.replaceState(window.history.state, '', `#${tab}`);
  }, [tab]);

  const settings = site?.settings;
  if (!settings) return <p className="text-muted">Chargement…</p>;
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => update((s) => ({ ...s, settings: { ...s.settings, [k]: v } }));

  return (
    <>
      <PageTitle title="Paramètres de l’application" intro="Réglez le comportement du site public et la sécurité de votre espace." />
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${
              tab === id ? 'bg-canvas font-medium text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            <Icon className={`h-4 w-4 ${tab === id ? 'text-accent' : ''}`} />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {tab === 'general' && (
          <Panel title="Apparence et langue" intro="Valeurs proposées au premier passage ; le visiteur peut les changer dans le menu.">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField<ThemePreference>
                label="Thème par défaut"
                value={settings.defaultTheme}
                options={[
                  { value: 'light', label: 'Clair (bleu et blanc)' },
                  { value: 'dark', label: 'Sombre' },
                  { value: 'system', label: 'Automatique (selon l’appareil)' }
                ]}
                onChange={(v) => set('defaultTheme', v)}
              />
              <SelectField<Language>
                label="Langue par défaut"
                value={settings.defaultLanguage}
                options={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' }
                ]}
                onChange={(v) => set('defaultLanguage', v)}
              />
            </div>
          </Panel>
        )}

        {tab === 'sections' && (
          <Panel title="Sections du site" intro="Une section masquée disparaît de l’accueil et du menu.">
            <div className="grid gap-6 sm:grid-cols-2">
              {SECTION_GROUPS.map((g) => (
                <div key={g.title}>
                  <p className="mb-1 font-mono text-[11px] text-muted">{g.title}</p>
                  <div className="divide-y divide-line rounded-2xl border border-line px-3">
                    {g.ids.map((id) => (
                      <Switch
                        key={id}
                        label={SECTION_LABELS[id]}
                        checked={settings.sections[id]}
                        onChange={(v) => set('sections', { ...settings.sections, [id]: v })}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === 'features' && (
          <>
            <Panel title="Fonctionnalités" intro="Ces interrupteurs sont enregistrés immédiatement.">
              <div className="divide-y divide-line">
                {FEATURES.map((f) => (
                  <Switch
                    key={f.key}
                    icon={f.icon}
                    label={f.label}
                    hint={quick.busy === f.key ? 'Enregistrement…' : f.hint}
                    checked={!!settings[f.key]}
                    disabled={quick.busy !== null}
                    onChange={(v) => quick.toggle(f.key, { [f.key]: v } as Partial<SiteSettings>)}
                  />
                ))}
              </div>
              {quick.error && <p className="text-sm text-danger">{quick.error}</p>}
            </Panel>
            <Panel title="Message de maintenance" intro="Affiché aux visiteurs quand le mode maintenance est actif. Vous, connecté, voyez toujours le site.">
              <L10nField label="Message" value={settings.maintenanceMessage} onChange={(v) => set('maintenanceMessage', v)} multiline />
            </Panel>
          </>
        )}

        {tab === 'seo' && (
          <Panel title="Référencement (Google, partage)" intro="Utilisé pour le titre de l’onglet et l’aperçu des liens partagés.">
            <TextField label="Titre de la page d’accueil" value={settings.seoTitle} onChange={(v) => set('seoTitle', v)} />
            <TextField
              label="Description"
              value={settings.seoDescription}
              onChange={(v) => set('seoDescription', v)}
              multiline
              rows={3}
              hint={`${settings.seoDescription.length} / ~155 caractères`}
            />
            <div className="rounded-xl border border-line bg-surface-2 p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Globe className="h-3.5 w-3.5" />
                Aperçu Google
              </p>
              <p className="mt-1 truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{settings.seoTitle || site.profile.name}</p>
              <p className="line-clamp-2 text-sm text-muted">{settings.seoDescription}</p>
            </div>
          </Panel>
        )}

        {tab === 'security' && <SecurityPanel />}
      </div>
      {tab !== 'security' && <SaveBar />}
    </>
  );
};

// ------------------------------------------------------------ Sécurité
const SecurityPanel: React.FC = () => {
  const [source, setSource] = useState<'dashboard' | 'env' | 'none' | null>(null);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<{ busy?: boolean; ok?: string; error?: string }>({});

  useEffect(() => {
    api<{ passwordSource: 'dashboard' | 'env' | 'none' }>('/api/admin/security')
      .then((r) => setSource(r.passwordSource))
      .catch(() => undefined);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return setState({ error: 'Les deux nouveaux mots de passe ne correspondent pas.' });
    if (next.length < 10) return setState({ error: 'Au moins 10 caractères.' });
    setState({ busy: true });
    try {
      await api('/api/admin/password', { method: 'POST', json: { current, next } });
      setCurrent('');
      setNext('');
      setConfirm('');
      setSource('dashboard');
      setState({ ok: 'Mot de passe modifié. Les autres appareils ont été déconnectés.' });
    } catch (err) {
      setState({ error: err instanceof Error ? err.message : 'Échec.' });
    }
  };

  const logoutAll = async () => {
    if (!window.confirm('Déconnecter tous les appareils, y compris celui-ci ?')) return;
    await api('/api/admin/logout-all', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/admin';
  };

  return (
    <>
      <Panel
        title="Mot de passe administrateur"
        intro={
          source === 'env'
            ? 'Actuellement défini dans le fichier .env (ADMIN_PASSWORD). Le modifier ici le remplace de façon sécurisée (chiffré en base).'
            : source === 'dashboard'
              ? 'Défini depuis le tableau de bord (chiffré en base).'
              : undefined
        }
      >
        <form onSubmit={submit} className="grid max-w-lg gap-4">
          <TextField label="Mot de passe actuel" type="password" value={current} onChange={setCurrent} autoComplete="current-password" />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            hint="10 caractères minimum. Une phrase de passe est idéale."
          />
          <TextField label="Confirmer le nouveau mot de passe" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          {state.error && (
            <p className="text-sm text-danger" role="alert">
              {state.error}
            </p>
          )}
          {state.ok && (
            <p className="flex items-center gap-2 text-sm text-accent" role="status">
              <Check className="h-4 w-4" />
              {state.ok}
            </p>
          )}
          <div>
            <button type="submit" className="btn btn-accent" disabled={state.busy || !current || !next}>
              {state.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Changer le mot de passe
            </button>
          </div>
        </form>
      </Panel>
      <Panel title="Sessions" intro="Utile si vous vous êtes connecté sur un appareil qui n’est pas le vôtre.">
        <button type="button" className="btn btn-secondary" onClick={logoutAll}>
          <LogOut className="h-4 w-4" />
          Déconnecter tous les appareils
        </button>
      </Panel>
    </>
  );
};
