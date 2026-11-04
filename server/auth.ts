import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { getStorage } from './storage.js';

/**
 * Authentification de l'administrateur unique du site.
 * - Mot de passe : celui défini depuis le tableau de bord (chiffré avec scrypt, en base),
 *   sinon la variable d'environnement ADMIN_PASSWORD.
 * - Session : jeton signé (HMAC-SHA256, clé SESSION_SECRET) dans un cookie HttpOnly.
 *   « Déconnecter partout » incrémente une version qui invalide tous les jetons existants.
 */

const COOKIE = 'admin_session';
/** Déconnexion automatique après 30 min sans activité dans le tableau de bord. */
const IDLE_MS = 30 * 60_000;
/** Durée maximale d'une session, même active : 8 h. */
const MAX_MS = 8 * 3600_000;
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const KV_PASSWORD = 'admin_password_hash';
const KV_VERSION = 'session_version';

let devSecret: string | null = null;

function secret(): string {
  const s = process.env.SESSION_SECRET?.trim();
  if (s && s.length >= 32) return s;
  if (IS_PROD) {
    throw new Error('SESSION_SECRET (au moins 32 caractères) doit être défini en production.');
  }
  // En développement : clé aléatoire (les sessions expirent au redémarrage du serveur).
  devSecret ??= crypto.randomBytes(32).toString('hex');
  return devSecret;
}

// ------------------------------------------------------------------ Mot de passe
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [algo, salt, hash] = stored.split(':');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function sameText(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Lève une erreur si la base est injoignable (on refuse alors la connexion plutôt que de revenir au .env). */
async function storedHash(): Promise<string | null> {
  return (await getStorage()).getKv<string>(KV_PASSWORD);
}

/** Le mot de passe a-t-il été défini (dans le tableau de bord ou dans .env) ? */
export async function adminConfigured(): Promise<boolean> {
  if ((process.env.ADMIN_PASSWORD ?? '').length >= 8) return true;
  return !!(await storedHash().catch(() => null));
}

export async function checkPassword(candidate: string): Promise<boolean> {
  if (typeof candidate !== 'string' || !candidate) return false;
  const hash = await storedHash();
  if (hash) return verifyHash(candidate, hash);
  const env = process.env.ADMIN_PASSWORD ?? '';
  return env.length >= 8 && sameText(candidate, env);
}

export async function changePassword(next: string): Promise<void> {
  await (await getStorage()).setKv(KV_PASSWORD, hashPassword(next));
}

/** Indique si le mot de passe vient du tableau de bord ou du fichier .env. */
export async function passwordSource(): Promise<'dashboard' | 'env' | 'none'> {
  if (await storedHash().catch(() => null)) return 'dashboard';
  return (process.env.ADMIN_PASSWORD ?? '').length >= 8 ? 'env' : 'none';
}

// ------------------------------------------------------------------ Sessions
async function sessionVersion(): Promise<number> {
  return (await (await getStorage()).getKv<number>(KV_VERSION)) ?? 0;
}

/** Invalide toutes les sessions ouvertes (tous les appareils). */
export async function revokeAllSessions(): Promise<void> {
  await (await getStorage()).setKv(KV_VERSION, (await sessionVersion()) + 1);
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

async function createToken(iat = Date.now()): Promise<string> {
  const payload = Buffer.from(
    JSON.stringify({ sub: 'admin', v: await sessionVersion(), iat, exp: Math.min(Date.now() + IDLE_MS, iat + MAX_MS) })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Renvoie la date d'ouverture de la session si le jeton est valide, sinon null. */
async function verifyToken(token: string | undefined): Promise<number | null> {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const { exp, iat, v } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const valid = typeof exp === 'number' && typeof iat === 'number' && exp > Date.now() && (v ?? 0) === (await sessionVersion());
    return valid ? iat : null;
  } catch {
    return null;
  }
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

/** Cookie de session (sans durée) : il disparaît à la fermeture du navigateur. */
export async function setSessionCookie(res: Response, iat?: number) {
  res.setHeader('Set-Cookie', `${COOKIE}=${await createToken(iat)}; Path=/api; HttpOnly; SameSite=Strict${IS_PROD ? '; Secure' : ''}`);
}

export function clearSessionCookie(res: Response) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/api; HttpOnly; SameSite=Strict; Max-Age=0${IS_PROD ? '; Secure' : ''}`);
}

async function sessionStart(req: Request): Promise<number | null> {
  try {
    return await verifyToken(readCookie(req, COOKIE));
  } catch {
    return null;
  }
}

export async function isAuthenticated(req: Request): Promise<boolean> {
  return (await sessionStart(req)) !== null;
}

/** Protège les routes du tableau de bord et prolonge la session tant que l'administrateur est actif. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  sessionStart(req)
    .then(async (iat) => {
      if (iat === null) {
        clearSessionCookie(res);
        res.status(401).json({ error: 'Session expirée, reconnectez-vous.' });
        return;
      }
      await setSessionCookie(res, iat);
      next();
    })
    .catch(next);
}
