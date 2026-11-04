import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AlbumItem, DocumentItem, EventItem, PostSummary, PublicContentResponse, SiteContent } from '../../shared/types';
import { DEFAULT_SITE } from '../../shared/defaults';
import { mergeWithDefaults } from '../../shared/utils';
import { api } from '../lib/api';

interface ContentContextType {
  site: SiteContent;
  /** Articles de blog publiés (hors actualités). */
  posts: PostSummary[];
  news: PostSummary[];
  events: EventItem[];
  albums: AlbumItem[];
  documents: DocumentItem[];
  /** 'loading' tant que rien n'est disponible ; 'offline' si l'API ne répond pas (contenu par défaut). */
  status: 'loading' | 'ready' | 'offline';
  reload: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);
const CACHE_KEY = 'site_content_cache_v2';

function normalize(data: Partial<PublicContentResponse>): PublicContentResponse {
  return {
    site: mergeWithDefaults(DEFAULT_SITE, data.site),
    posts: data.posts ?? [],
    events: data.events ?? [],
    albums: data.albums ?? [],
    documents: data.documents ?? []
  };
}

function readCache(): PublicContentResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return normalize(JSON.parse(raw) as PublicContentResponse);
  } catch {
    return null;
  }
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Affichage immédiat de la dernière version connue (visites suivantes), puis mise à jour.
  const [data, setData] = useState<PublicContentResponse | null>(readCache);
  const [status, setStatus] = useState<ContentContextType['status']>(() => (readCache() ? 'ready' : 'loading'));

  const load = useCallback(async () => {
    try {
      const res = await api<PublicContentResponse>('/api/content');
      const next = normalize(res);
      setData(next);
      setStatus('ready');
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    } catch {
      setStatus((s) => (s === 'ready' ? s : 'offline'));
    }
  }, []);

  useEffect(() => {
    load();
    // Si l'API est lente, on affiche le contenu par défaut au bout de 4 s.
    const timer = setTimeout(() => setStatus((s) => (s === 'loading' ? 'offline' : s)), 4000);
    return () => clearTimeout(timer);
  }, [load]);

  const allPosts = data?.posts ?? [];
  const value: ContentContextType = {
    site: data?.site ?? DEFAULT_SITE,
    posts: allPosts.filter((p) => p.kind !== 'news'),
    news: allPosts.filter((p) => p.kind === 'news'),
    events: data?.events ?? [],
    albums: data?.albums ?? [],
    documents: data?.documents ?? [],
    status,
    reload: load
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
