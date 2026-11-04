import type { L10n, L10nList, Language, Post, PostSummary, SiteContent } from './types.js';

/** Renvoie le texte dans la langue demandée, ou le français si la traduction est vide. */
export function tr(value: L10n | undefined, lang: Language): string {
  if (!value) return '';
  return (lang === 'en' && value.en?.trim()) ? value.en : value.fr ?? '';
}

export function trList(value: L10nList | undefined, lang: Language): string[] {
  if (!value) return [];
  const en = (value.en ?? []).filter((s) => s.trim());
  return lang === 'en' && en.length ? en : (value.fr ?? []).filter((s) => s.trim());
}

/** « React | 90 » → { name: 'React', level: 90 } */
export function parseSkill(line: string): { name: string; level: number | null } {
  const [name, level] = line.split('|').map((s) => s.trim());
  const n = Number(level);
  return { name, level: level && Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null };
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function newId(prefix = ''): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return prefix ? `${prefix}-${rand}` : rand;
}

export function readingMinutes(post: Pick<Post, 'content'>): number {
  const words = `${post.content.fr} `.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toSummary(post: Post): PostSummary {
  const { content, ...rest } = post;
  return { ...rest, readingMinutes: readingMinutes({ content }) };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Fusionne le contenu enregistré avec les valeurs par défaut, pour que les champs
 * ajoutés dans une future version du site existent toujours.
 */
export function mergeWithDefaults(defaults: SiteContent, stored: unknown): SiteContent {
  if (!isPlainObject(stored)) return structuredClone(defaults);
  const merge = (d: unknown, s: unknown): unknown => {
    if (Array.isArray(d)) return Array.isArray(s) ? s : d;
    if (isPlainObject(d)) {
      const out: Record<string, unknown> = {};
      const src = isPlainObject(s) ? s : {};
      for (const key of Object.keys(d)) out[key] = merge(d[key], src[key]);
      return out;
    }
    return s === undefined || s === null || typeof s !== typeof d ? d : s;
  };
  return merge(defaults, stored) as SiteContent;
}
