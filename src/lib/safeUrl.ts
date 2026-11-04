/** N'autorise que les liens http(s), mailto, tel et internes (bloque javascript:, data:…). */
export function safeUrl(url: string | undefined | null): string | undefined {
  const u = (url ?? '').trim();
  if (!u) return undefined;
  if (u.startsWith('/') && !u.startsWith('//')) return u;
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return `https://${u}`;
  return undefined;
}

/** Lien WhatsApp à partir d'un numéro ou d'un lien déjà formé. */
export function whatsappUrl(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (/^https?:/i.test(v)) return safeUrl(v);
  const digits = v.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : undefined;
}
