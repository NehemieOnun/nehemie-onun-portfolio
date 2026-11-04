import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Loader2, Save, Undo2 } from 'lucide-react';
import type { SiteContent, SiteSettings } from '../../shared/types';
import { api } from '../lib/api';

interface SiteEditorContextType {
  site: SiteContent | null;
  update: (fn: (s: SiteContent) => SiteContent) => void;
  dirty: boolean;
  saving: boolean;
  save: () => Promise<void>;
  discard: () => void;
  error: string;
  /** Enregistre immédiatement un ou plusieurs réglages (sans toucher aux autres modifications en cours). */
  patchSettings: (patch: Partial<SiteSettings>) => Promise<void>;
}

const Ctx = createContext<SiteEditorContextType | undefined>(undefined);

/** Garde une copie du contenu du site en cours de modification, enregistrée d'un seul coup. */
export const SiteEditorProvider: React.FC<{ children: React.ReactNode; onUnauthorized: () => void }> = ({
  children,
  onUnauthorized
}) => {
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [site, setSite] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api<SiteContent>('/api/admin/site')
      .then((s) => {
        setSaved(s);
        setSite(s);
      })
      .catch((err) => (err?.status === 401 ? onUnauthorized() : setError(err.message)));
  }, [onUnauthorized]);

  const dirty = !!site && !!saved && JSON.stringify(site) !== JSON.stringify(saved);

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = useCallback((fn: (s: SiteContent) => SiteContent) => setSite((s) => (s ? fn(s) : s)), []);

  const save = async () => {
    if (!site) return;
    setSaving(true);
    setError('');
    try {
      const res = await api<SiteContent>('/api/admin/site', { method: 'PUT', json: site });
      setSaved(res);
      setSite(res);
      // Le site public relit le contenu au prochain chargement.
      try {
        localStorage.removeItem('site_content_cache_v2');
      } catch {
        /* ignore */
      }
    } catch (err) {
      if ((err as { status?: number })?.status === 401) onUnauthorized();
      setError(err instanceof Error ? err.message : 'Échec de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const patchSettings = useCallback(
    async (patch: Partial<SiteSettings>) => {
      if (!saved) return;
      try {
        const res = await api<SiteContent>('/api/admin/site', {
          method: 'PUT',
          json: { ...saved, settings: { ...saved.settings, ...patch } }
        });
        setSaved(res);
        setSite((s) => (s ? { ...s, settings: { ...s.settings, ...patch } } : res));
        try {
          localStorage.removeItem('site_content_cache_v2');
        } catch {
          /* ignore */
        }
      } catch (err) {
        if ((err as { status?: number })?.status === 401) onUnauthorized();
        throw err;
      }
    },
    [saved, onUnauthorized]
  );

  return (
    <Ctx.Provider value={{ site, update, dirty, saving, save, discard: () => setSite(saved), error, patchSettings }}>{children}</Ctx.Provider>
  );
};

export function useSiteEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSiteEditor must be used within SiteEditorProvider');
  return ctx;
}

/** Barre d'enregistrement affichée en bas d'écran dès qu'une modification est en attente. */
export const SaveBar: React.FC = () => {
  const { dirty, saving, save, discard, error } = useSiteEditor();
  if (!dirty && !error) return null;
  return (
    <div className="sticky bottom-4 z-20 mt-10 rounded-2xl border border-line-strong bg-surface/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm ${error ? 'text-danger' : 'text-muted'}`} role={error ? 'alert' : undefined}>
          {error || 'Modifications non enregistrées.'}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost" onClick={discard} disabled={saving || !dirty}>
            <Undo2 className="h-4 w-4" />
            Annuler
          </button>
          <button type="button" className="btn btn-accent" onClick={save} disabled={saving || !dirty}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};
