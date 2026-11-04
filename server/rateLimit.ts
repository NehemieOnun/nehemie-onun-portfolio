import type { Request, Response, NextFunction } from 'express';

/**
 * Limiteur de requêtes en mémoire. Sur Vercel, chaque instance a sa propre mémoire :
 * la protection est donc approximative, mais suffisante pour un portfolio.
 */
export function rateLimit(name: string, max: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${name}:${req.ip || 'unknown'}`;
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
    } else if (++entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.reset - now) / 1000));
      res.status(429).json({ error: 'Trop de requêtes, réessayez plus tard.' });
      return;
    }
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    next();
  };
}
