export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...rest,
    headers: { ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: json !== undefined ? JSON.stringify(json) : rest.body
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* réponse vide */
  }
  if (!res.ok) {
    // Session du tableau de bord expirée : l'écran de connexion s'affiche partout.
    if (res.status === 401 && path.startsWith('/api/admin')) window.dispatchEvent(new Event('admin-session-expired'));
    const msg = (data as { error?: string } | null)?.error || `Erreur ${res.status}`;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}
