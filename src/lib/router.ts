import type React from 'react';
import { useEffect, useState } from 'react';

/** Mini-routeur basé sur l'historique du navigateur (pas de dépendance externe). */
const EVENT = 'app:navigate';

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (to === window.location.pathname + window.location.search + window.location.hash) return;
  if (opts.replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  window.dispatchEvent(new Event(EVENT));
  const hash = to.includes('#') ? to.split('#')[1] : '';
  requestAnimationFrame(() => {
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0 });
  });
}

export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    window.addEventListener(EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(EVENT, update);
    };
  }, []);
  return path;
}

/** Intercepte les clics sur les liens internes pour éviter un rechargement complet. */
export function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('/') || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (e.currentTarget.target === '_blank') return;
  e.preventDefault();
  navigate(href);
}
