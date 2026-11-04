import React, { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import type { L10n, L10nList } from '../../shared/types';

// -------------------------------------------------------------- Champs de base

export const Field: React.FC<{ label: string; hint?: string; children: (id: string) => React.ReactNode }> = ({
  label,
  hint,
  children
}) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
};

export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  autoComplete?: string;
}> = ({ label, value, onChange, hint, placeholder, type = 'text', multiline, rows = 4, autoComplete }) => (
  <Field label={label} hint={hint}>
    {(id) =>
      multiline ? (
        <textarea id={id} className="field resize-y" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={type} className="field" value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )
    }
  </Field>
);

/** Texte bilingue : français (obligatoire) et anglais (facultatif). */
export const L10nField: React.FC<{
  label: string;
  value: L10n;
  onChange: (v: L10n) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}> = ({ label, value, onChange, multiline, rows = 4, hint }) => {
  const id = useId();
  const v = value ?? { fr: '', en: '' };
  const input = (lang: 'fr' | 'en') => {
    const props = {
      id: `${id}-${lang}`,
      className: 'field resize-y',
      value: v[lang] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...v, [lang]: e.target.value }),
      placeholder: lang === 'en' ? 'English (facultatif)' : undefined
    };
    return multiline ? <textarea rows={rows} {...props} /> : <input {...props} />;
  };
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <label htmlFor={`${id}-fr`} className="mb-1 block text-xs font-semibold text-muted">
            Français
          </label>
          {input('fr')}
        </div>
        <div>
          <label htmlFor={`${id}-en`} className="mb-1 block text-xs font-semibold text-muted">
            English
          </label>
          {input('en')}
        </div>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </fieldset>
  );
};

const toLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

/** Liste de textes : un élément par ligne. */
export const LinesField: React.FC<{ label: string; value: string[]; onChange: (v: string[]) => void; hint?: string; rows?: number }> = ({
  label,
  value,
  onChange,
  hint,
  rows = 4
}) => {
  // On garde le texte brut pendant la saisie (sinon les lignes vides disparaissent en tapant).
  const [draft, setDraft] = useState(() => (value ?? []).join('\n'));
  return (
    <Field label={label} hint={hint ?? 'Un élément par ligne.'}>
      {(id) => (
        <textarea
          id={id}
          rows={rows}
          className="field resize-y"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(toLines(e.target.value));
          }}
        />
      )}
    </Field>
  );
};

/** Liste de mots-clés séparés par des virgules. */
export const TagsField: React.FC<{ label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }> = ({
  label,
  value,
  onChange,
  hint
}) => {
  const [draft, setDraft] = useState(() => (value ?? []).join(', '));
  return (
    <Field label={label} hint={hint ?? 'Séparés par des virgules.'}>
      {(id) => (
        <input
          id={id}
          className="field"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(e.target.value.split(',').map((x) => x.trim()).filter(Boolean));
          }}
        />
      )}
    </Field>
  );
};

export const L10nLinesField: React.FC<{ label: string; value: L10nList; onChange: (v: L10nList) => void; hint?: string }> = ({
  label,
  value,
  onChange,
  hint
}) => {
  const v = value ?? { fr: [], en: [] };
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="grid gap-2 md:grid-cols-2">
        <LinesField label="Français" value={v.fr} onChange={(fr) => onChange({ ...v, fr })} hint={hint ?? 'Un élément par ligne.'} />
        <LinesField label="English" value={v.en} onChange={(en) => onChange({ ...v, en })} hint="Facultatif." />
      </div>
    </fieldset>
  );
};

export const SelectField = <T extends string>({
  label,
  value,
  options,
  onChange,
  hint
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  hint?: string;
}) => (
  <Field label={label} hint={hint}>
    {(id) => (
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )}
  </Field>
);

export const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }> = ({
  label,
  checked,
  onChange,
  hint
}) => (
  <label className="flex cursor-pointer items-start gap-3">
    <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--c-accent)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>
      <span className="font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </span>
  </label>
);

/** Interrupteur (style iOS) avec libellé et aide. */
export const Switch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}> = ({ label, checked, onChange, hint, disabled, icon: Icon }) => (
  <label className={`flex items-center gap-3 rounded-xl px-1 py-2 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
    {Icon && (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2">
        <Icon className="h-4 w-4 text-accent" />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </span>
    <input
      type="checkbox"
      role="switch"
      className="peer sr-only"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span
      aria-hidden="true"
      className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
    />
  </label>
);

// -------------------------------------------------------------- Image

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const uploadEnabled = Boolean(CLOUD && PRESET);

/**
 * Téléverse un fichier sur Cloudinary (préréglage « unsigned ») et renvoie son URL.
 * Les images reçoivent une version optimisée automatiquement ; les PDF gardent leur adresse d'origine.
 */
export async function uploadFile(file: File, kind: 'image' | 'document' = 'image'): Promise<string> {
  if (!uploadEnabled) throw new Error('Téléversement non configuré.');
  if (kind === 'image' && !file.type.startsWith('image/')) throw new Error('Le fichier doit être une image.');
  const max = kind === 'image' ? 8 : 10;
  if (file.size > max * 1024 * 1024) throw new Error(`Fichier trop lourd (${max} Mo maximum).`);
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', PRESET!);
  body.append('folder', kind === 'image' ? 'portfolio' : 'portfolio/documents');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/${kind === 'image' ? 'image' : 'auto'}/upload`, { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || 'Échec du téléversement.');
  const url = String(data.secure_url);
  return kind === 'image' ? url.replace('/upload/', '/upload/f_auto,q_auto,w_1600/') : url;
}

export const uploadImage = (file: File) => uploadFile(file, 'image');

export const ImageField: React.FC<{ label: string; value: string; onChange: (v: string) => void; hint?: string }> = ({
  label,
  value,
  onChange,
  hint
}) => {
  const id = useId();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du téléversement.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-sunken">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-muted" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <input id={id} className="field" value={value} placeholder="https://… ou /images/…" onChange={(e) => onChange(e.target.value)} />
            {value && (
              <button type="button" className="btn btn-ghost px-2" onClick={() => onChange('')} aria-label="Retirer l'image">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {uploadEnabled ? (
            <>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              <button type="button" className="btn btn-secondary py-1.5 text-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {busy ? 'Téléversement…' : 'Téléverser une image'}
              </button>
            </>
          ) : (
            <p className="text-xs text-muted">
              Collez l'adresse d'une image. Pour téléverser depuis votre ordinateur, configurez Cloudinary (voir README).
            </p>
          )}
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
};

// -------------------------------------------------------------- Fichier (PDF…)
export const FileField: React.FC<{
  label: string;
  value: string;
  onChange: (url: string, fileName?: string) => void;
  hint?: string;
}> = ({ label, value, onChange, hint }) => {
  const id = useId();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadFile(file, 'document'), file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du téléversement.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <input id={id} className="field min-w-0 flex-1" value={value} placeholder="https://… (PDF, Google Drive, etc.)" onChange={(e) => onChange(e.target.value)} />
        {uploadEnabled && (
          <>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {busy ? 'Envoi…' : 'Téléverser'}
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      <p className="mt-1 text-xs text-muted">
        {hint ??
          (uploadEnabled
            ? 'Téléversez un fichier (10 Mo max) ou collez un lien de partage.'
            : 'Collez un lien de partage (Google Drive, OneDrive…). Le téléversement direct nécessite Cloudinary (voir README).')}
      </p>
    </div>
  );
};
