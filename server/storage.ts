import fs from 'fs/promises';
import path from 'path';
import type { ContactMessage, ContentItem, ItemType, Post, SiteContent } from '../shared/types.js';
import { DEFAULT_POSTS, DEFAULT_SITE } from '../shared/defaults.js';
import { mergeWithDefaults } from '../shared/utils.js';

/**
 * Stockage du contenu modifiable depuis /admin.
 * - Avec DATABASE_URL (Neon / PostgreSQL) : base de données (obligatoire sur Vercel).
 * - Sans DATABASE_URL : fichier local data/local-db.json (pratique pour le développement).
 */
export interface Storage {
  readonly kind: 'postgres' | 'file';
  getSite(): Promise<SiteContent>;
  saveSite(site: SiteContent): Promise<void>;
  listPosts(includeDrafts: boolean): Promise<Post[]>;
  getPost(id: string): Promise<Post | null>;
  getPostBySlug(slug: string): Promise<Post | null>;
  savePost(post: Post): Promise<void>;
  deletePost(id: string): Promise<void>;
  listMessages(): Promise<ContactMessage[]>;
  createMessage(message: ContactMessage): Promise<void>;
  setMessageRead(id: string, read: boolean): Promise<void>;
  deleteMessage(id: string): Promise<void>;
  /** Statistiques anonymes : une vue de page (jour AAAA-MM-JJ, chemin, empreinte anonyme du visiteur). */
  recordView(day: string, path: string, visitor: string): Promise<void>;
  getAnalytics(sinceDay: string): Promise<AnalyticsRaw>;
  /** Événements, albums photo et documents. */
  listItems(type: ItemType, includeDrafts: boolean): Promise<ContentItem[]>;
  getItem(id: string): Promise<ContentItem | null>;
  saveItem(item: ContentItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
  /** Petits réglages internes (mot de passe admin chiffré, version des sessions…). */
  getKv<T = unknown>(key: string): Promise<T | null>;
  setKv(key: string, value: unknown): Promise<void>;
}

export interface AnalyticsRaw {
  daily: { day: string; views: number; visitors: number }[];
  pages: { path: string; views: number }[];
}

type Query = (text: string, params?: unknown[]) => Promise<Record<string, any>[]>;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS site_content (
     id INTEGER PRIMARY KEY,
     data JSONB NOT NULL,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS posts (
     id TEXT PRIMARY KEY,
     slug TEXT NOT NULL UNIQUE,
     published BOOLEAN NOT NULL DEFAULT false,
     published_at TIMESTAMPTZ,
     data JSONB NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS page_views (
     day DATE NOT NULL,
     path TEXT NOT NULL,
     views INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (day, path)
   )`,
  `CREATE TABLE IF NOT EXISTS daily_visitors (
     day DATE NOT NULL,
     hash TEXT NOT NULL,
     PRIMARY KEY (day, hash)
   )`,
  `CREATE TABLE IF NOT EXISTS items (
     id TEXT PRIMARY KEY,
     type TEXT NOT NULL,
     published BOOLEAN NOT NULL DEFAULT false,
     date TEXT NOT NULL DEFAULT '',
     data JSONB NOT NULL,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS items_type_date ON items (type, date DESC)`,
  `CREATE TABLE IF NOT EXISTS app_kv (
     key TEXT PRIMARY KEY,
     value JSONB NOT NULL,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS messages (
     id TEXT PRIMARY KEY,
     data JSONB NOT NULL,
     read BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`
];

class SqlStorage implements Storage {
  readonly kind = 'postgres' as const;
  private ready: Promise<void> | null = null;

  constructor(private readonly q: Query) {}

  private init() {
    if (!this.ready) {
      this.ready = (async () => {
        for (const stmt of SCHEMA) await this.q(stmt);
        const existing = await this.q('SELECT count(*)::int AS n FROM posts');
        const site = await this.q('SELECT 1 FROM site_content WHERE id = 1');
        // Premier démarrage : on enregistre les brouillons d'articles par défaut.
        if (existing[0].n === 0 && site.length === 0) {
          for (const p of DEFAULT_POSTS) await this.savePostRaw(p);
        }
      })().catch((err) => {
        this.ready = null; // réessayer à la prochaine requête
        throw err;
      });
    }
    return this.ready;
  }

  async getSite() {
    await this.init();
    const rows = await this.q('SELECT data FROM site_content WHERE id = 1');
    return mergeWithDefaults(DEFAULT_SITE, rows[0]?.data);
  }

  async saveSite(site: SiteContent) {
    await this.init();
    await this.q(
      `INSERT INTO site_content (id, data, updated_at) VALUES (1, $1::jsonb, now())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [JSON.stringify(site)]
    );
  }

  async listPosts(includeDrafts: boolean) {
    await this.init();
    const rows = await this.q(
      `SELECT data FROM posts ${includeDrafts ? '' : 'WHERE published = true'}
       ORDER BY COALESCE(published_at, created_at) DESC`
    );
    return rows.map((r) => r.data as Post);
  }

  async getPost(id: string) {
    await this.init();
    const rows = await this.q('SELECT data FROM posts WHERE id = $1', [id]);
    return (rows[0]?.data as Post) ?? null;
  }

  async getPostBySlug(slug: string) {
    await this.init();
    const rows = await this.q('SELECT data FROM posts WHERE slug = $1', [slug]);
    return (rows[0]?.data as Post) ?? null;
  }

  private async savePostRaw(post: Post) {
    await this.q(
      `INSERT INTO posts (id, slug, published, published_at, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
       ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, published = EXCLUDED.published,
         published_at = EXCLUDED.published_at, data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
      [post.id, post.slug, post.published, post.publishedAt, JSON.stringify(post), post.createdAt, post.updatedAt]
    );
  }

  async savePost(post: Post) {
    await this.init();
    await this.savePostRaw(post);
  }

  async deletePost(id: string) {
    await this.init();
    await this.q('DELETE FROM posts WHERE id = $1', [id]);
  }

  async listMessages() {
    await this.init();
    const rows = await this.q('SELECT data, read FROM messages ORDER BY created_at DESC LIMIT 500');
    return rows.map((r) => ({ ...(r.data as ContactMessage), read: r.read as boolean }));
  }

  async createMessage(m: ContactMessage) {
    await this.init();
    await this.q('INSERT INTO messages (id, data, read, created_at) VALUES ($1, $2::jsonb, false, $3)', [
      m.id,
      JSON.stringify(m),
      m.createdAt
    ]);
  }

  async setMessageRead(id: string, read: boolean) {
    await this.init();
    await this.q('UPDATE messages SET read = $2 WHERE id = $1', [id, read]);
  }

  async deleteMessage(id: string) {
    await this.init();
    await this.q('DELETE FROM messages WHERE id = $1', [id]);
  }

  async recordView(day: string, path: string, visitor: string) {
    await this.init();
    await this.q(
      `INSERT INTO page_views (day, path, views) VALUES ($1, $2, 1)
       ON CONFLICT (day, path) DO UPDATE SET views = page_views.views + 1`,
      [day, path]
    );
    await this.q('INSERT INTO daily_visitors (day, hash) VALUES ($1, $2) ON CONFLICT DO NOTHING', [day, visitor]);
  }

  async getKv<T = unknown>(key: string): Promise<T | null> {
    await this.init();
    const rows = await this.q('SELECT value FROM app_kv WHERE key = $1', [key]);
    return (rows[0]?.value as T) ?? null;
  }

  async setKv(key: string, value: unknown) {
    await this.init();
    await this.q(
      `INSERT INTO app_kv (key, value, updated_at) VALUES ($1, $2::jsonb, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, JSON.stringify(value)]
    );
  }

  async listItems(type: ItemType, includeDrafts: boolean) {
    await this.init();
    const rows = await this.q(
      `SELECT data FROM items WHERE type = $1 ${includeDrafts ? '' : 'AND published = true'} ORDER BY date DESC, updated_at DESC`,
      [type]
    );
    return rows.map((r) => r.data as ContentItem);
  }

  async getItem(id: string) {
    await this.init();
    const rows = await this.q('SELECT data FROM items WHERE id = $1', [id]);
    return (rows[0]?.data as ContentItem) ?? null;
  }

  async saveItem(item: ContentItem) {
    await this.init();
    await this.q(
      `INSERT INTO items (id, type, published, date, data, updated_at) VALUES ($1, $2, $3, $4, $5::jsonb, now())
       ON CONFLICT (id) DO UPDATE SET published = EXCLUDED.published, date = EXCLUDED.date, data = EXCLUDED.data, updated_at = now()`,
      [item.id, item.type, item.published, item.date, JSON.stringify(item)]
    );
  }

  async deleteItem(id: string) {
    await this.init();
    await this.q('DELETE FROM items WHERE id = $1', [id]);
  }

  async getAnalytics(sinceDay: string): Promise<AnalyticsRaw> {
    await this.init();
    const views = await this.q(
      `SELECT to_char(day, 'YYYY-MM-DD') AS day, SUM(views)::int AS views FROM page_views WHERE day >= $1 GROUP BY day`,
      [sinceDay]
    );
    const visitors = await this.q(
      `SELECT to_char(day, 'YYYY-MM-DD') AS day, COUNT(*)::int AS visitors FROM daily_visitors WHERE day >= $1 GROUP BY day`,
      [sinceDay]
    );
    const pages = await this.q(
      `SELECT path, SUM(views)::int AS views FROM page_views WHERE day >= $1 GROUP BY path ORDER BY views DESC LIMIT 10`,
      [sinceDay]
    );
    const byDay = new Map<string, { day: string; views: number; visitors: number }>();
    for (const r of views) byDay.set(r.day, { day: r.day, views: r.views, visitors: 0 });
    for (const r of visitors) {
      const e = byDay.get(r.day) ?? { day: r.day, views: 0, visitors: 0 };
      e.visitors = r.visitors;
      byDay.set(r.day, e);
    }
    return { daily: [...byDay.values()], pages: pages.map((r) => ({ path: r.path, views: r.views })) };
  }
}

interface FileDb {
  site: SiteContent | null;
  posts: Post[];
  messages: ContactMessage[];
  views?: Record<string, Record<string, number>>;
  visitors?: Record<string, string[]>;
  items?: ContentItem[];
  kv?: Record<string, unknown>;
}

class FileStorage implements Storage {
  readonly kind = 'file' as const;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly file: string) {}

  private async read(): Promise<FileDb> {
    try {
      return JSON.parse(await fs.readFile(this.file, 'utf8')) as FileDb;
    } catch {
      return { site: null, posts: structuredClone(DEFAULT_POSTS), messages: [] };
    }
  }

  /** Les écritures sont mises en file pour éviter de corrompre le fichier. */
  private update(fn: (db: FileDb) => void) {
    const run = this.queue.then(async () => {
      const db = await this.read();
      fn(db);
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.tmp`;
      const json = JSON.stringify(db, null, 2);
      await fs.writeFile(tmp, json, 'utf8');
      // Windows : l'antivirus ou OneDrive peut bloquer un instant le fichier (EPERM/EBUSY).
      for (let attempt = 0; ; attempt++) {
        try {
          await fs.rename(tmp, this.file);
          break;
        } catch (err) {
          const code = (err as { code?: string }).code;
          if ((code !== 'EPERM' && code !== 'EBUSY' && code !== 'EACCES') || attempt >= 4) {
            // Dernier recours : écriture directe.
            await fs.writeFile(this.file, json, 'utf8');
            await fs.rm(tmp, { force: true });
            break;
          }
          await new Promise((r) => setTimeout(r, 50 * (attempt + 1)));
        }
      }
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  async getSite() {
    return mergeWithDefaults(DEFAULT_SITE, (await this.read()).site);
  }
  async saveSite(site: SiteContent) {
    await this.update((db) => {
      db.site = site;
    });
  }
  async listPosts(includeDrafts: boolean) {
    const posts = (await this.read()).posts.filter((p) => includeDrafts || p.published);
    return posts.sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt));
  }
  async getPost(id: string) {
    return (await this.read()).posts.find((p) => p.id === id) ?? null;
  }
  async getPostBySlug(slug: string) {
    return (await this.read()).posts.find((p) => p.slug === slug) ?? null;
  }
  async savePost(post: Post) {
    await this.update((db) => {
      if (db.posts.some((p) => p.slug === post.slug && p.id !== post.id)) {
        throw Object.assign(new Error('duplicate slug'), { code: '23505' });
      }
      const i = db.posts.findIndex((p) => p.id === post.id);
      if (i >= 0) db.posts[i] = post;
      else db.posts.push(post);
    });
  }
  async deletePost(id: string) {
    await this.update((db) => {
      db.posts = db.posts.filter((p) => p.id !== id);
    });
  }
  async listMessages() {
    return (await this.read()).messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async createMessage(m: ContactMessage) {
    await this.update((db) => {
      db.messages.push(m);
    });
  }
  async setMessageRead(id: string, read: boolean) {
    await this.update((db) => {
      const m = db.messages.find((x) => x.id === id);
      if (m) m.read = read;
    });
  }
  async deleteMessage(id: string) {
    await this.update((db) => {
      db.messages = db.messages.filter((x) => x.id !== id);
    });
  }
  async recordView(day: string, path: string, visitor: string) {
    await this.update((db) => {
      db.views ??= {};
      db.visitors ??= {};
      db.views[day] ??= {};
      db.views[day][path] = (db.views[day][path] ?? 0) + 1;
      db.visitors[day] ??= [];
      if (!db.visitors[day].includes(visitor)) db.visitors[day].push(visitor);
    });
  }
  async getKv<T = unknown>(key: string): Promise<T | null> {
    return (((await this.read()).kv ?? {})[key] as T) ?? null;
  }
  async setKv(key: string, value: unknown) {
    await this.update((db) => {
      db.kv ??= {};
      db.kv[key] = value;
    });
  }
  async listItems(type: ItemType, includeDrafts: boolean) {
    return ((await this.read()).items ?? [])
      .filter((i) => i.type === type && (includeDrafts || i.published))
      .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt));
  }
  async getItem(id: string) {
    return ((await this.read()).items ?? []).find((i) => i.id === id) ?? null;
  }
  async saveItem(item: ContentItem) {
    await this.update((db) => {
      db.items ??= [];
      const i = db.items.findIndex((x) => x.id === item.id);
      if (i >= 0) db.items[i] = item;
      else db.items.push(item);
    });
  }
  async deleteItem(id: string) {
    await this.update((db) => {
      db.items = (db.items ?? []).filter((x) => x.id !== id);
    });
  }
  async getAnalytics(sinceDay: string): Promise<AnalyticsRaw> {
    const db = await this.read();
    const daily: AnalyticsRaw['daily'] = [];
    const pages = new Map<string, number>();
    for (const [day, paths] of Object.entries(db.views ?? {})) {
      if (day < sinceDay) continue;
      let views = 0;
      for (const [path, n] of Object.entries(paths)) {
        views += n;
        pages.set(path, (pages.get(path) ?? 0) + n);
      }
      daily.push({ day, views, visitors: db.visitors?.[day]?.length ?? 0 });
    }
    return {
      daily,
      pages: [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, views]) => ({ path, views }))
    };
  }
}

let storage: Storage | null = null;

export async function getStorage(): Promise<Storage> {
  if (storage) return storage;
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    let query: Query;
    if (/neon\.tech/.test(url)) {
      // Neon : connexion HTTPS (port 443), idéale pour Vercel et les réseaux filtrés.
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(url);
      query = (text, params = []) => sql.query(text, params) as Promise<Record<string, any>[]>;
    } else {
      // Autre PostgreSQL (ex. base locale) : connexion TCP classique.
      const { default: pg } = await import('pg');
      const pool = new pg.Pool({ connectionString: url, max: 3 });
      query = async (text, params = []) => (await pool.query(text, params)).rows;
    }
    storage = new SqlStorage(query);
  } else {
    if (process.env.VERCEL) {
      throw new Error('DATABASE_URL est obligatoire sur Vercel (le disque n’y est pas persistant).');
    }
    storage = new FileStorage(path.join(process.cwd(), 'data', 'local-db.json'));
  }
  return storage;
}
