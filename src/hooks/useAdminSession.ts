import { useEffect, useState } from 'react';
import { api } from '../lib/api';

let cache: Promise<boolean> | null = null;

/** À appeler après une connexion ou une déconnexion pour relire l'état. */
export function resetAdminSession() {
  cache = null;
}

/** L'administrateur est-il connecté ? (une seule requête partagée par page) */
export function useAdminSession(): boolean | null {
  const [logged, setLogged] = useState<boolean | null>(null);
  useEffect(() => {
    cache ??= api<{ authenticated: boolean }>('/api/auth/me')
      .then((r) => r.authenticated)
      .catch(() => false);
    let alive = true;
    cache.then((v) => alive && setLogged(v));
    return () => {
      alive = false;
    };
  }, []);
  return logged;
}
