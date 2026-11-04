import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  FolderOpen,
  Images,
  Megaphone,
  Briefcase,
  CheckCircle2,
  Circle,
  Database,
  Eye,
  ExternalLink,
  FileText,
  FolderKanban,
  Home,
  Layers,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PenSquare,
  Route,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
  Construction,
  SlidersHorizontal
} from 'lucide-react';
import type { ContactMessage, Post } from '../../shared/types';
import { api } from '../lib/api';
import { resetAdminSession } from '../hooks/useAdminSession';
import { navigate, onLinkClick, usePath } from '../lib/router';
import { BrandLogo, ThemeToggle } from '../site/Header';
import { AreaChart, BarChart, Legend, Sparkline } from './charts';
import {
  CertificationsPage,
  PageTitle,
  ProfilePage,
  ProjectsPage,
  ServicesPage,
  SkillsPage,
  StatsPage,
  TimelinePage
} from './ContentPages';
import { MessagesPage } from './MessagesPage';
import { DocumentsPage, EventsPage, GalleryPage } from './ItemsPages';
import { PostEditorPage, PostsListPage } from './PostsPages';
import { AppSettingsPage, QuickSettings } from './AppSettings';
import { SiteEditorProvider, useSiteEditor } from './SiteEditor';

interface Overview {
  storage: 'postgres' | 'file';
  posts: { total: number; published: number };
  articles: { total: number; published: number };
  news: { total: number; published: number };
  events: { total: number; upcoming: number };
  albums: { total: number; photos: number };
  documents: { total: number };
  messages: { total: number; unread: number };
  chatConfigured: boolean;
}

interface Analytics {
  days: number;
  series: { day: string; views: number; visitors: number; messages: number }[];
  pages: { path: string; views: number }[];
  totals: { views: number; visitors: number; messages: number; previousViews: number; previousVisitors: number };
}

const C1 = 'var(--c-chart-1)';
const C2 = 'var(--c-chart-2)';

// ----------------------------------------------------------------- Connexion
const Login: React.FC<{ onSuccess: () => void; configured: boolean }> = ({ onSuccess, configured }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth/login', { method: 'POST', json: { password } });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-canvas px-4">
      <div aria-hidden="true" className="bg-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <form onSubmit={submit} className="card relative w-full max-w-sm space-y-6 p-8 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <BrandLogo variant="full" className="h-28" />
          </div>
          <h1 className="mt-4 font-semibold">Tableau de bord</h1>
          <p className="text-sm text-muted">Connexion administrateur</p>
        </div>
        {!configured && (
          <p className="rounded-xl border border-copper/40 bg-copper/10 p-3 text-sm">
            Définissez <strong>ADMIN_PASSWORD</strong> (8 caractères minimum) dans le fichier .env, puis redémarrez le serveur.
          </p>
        )}
        <div>
          <label htmlFor="pw" className="label">
            Mot de passe
          </label>
          <input id="pw" type="password" autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-accent w-full" disabled={busy || !password}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Se connecter
        </button>
        <a href="/" onClick={onLinkClick} className="block text-center text-sm text-muted hover:text-ink">
          ← Retour au site
        </a>
      </form>
    </div>
  );
};

// ----------------------------------------------------------------- Vue d'ensemble
const Delta: React.FC<{ now: number; before: number }> = ({ now, before }) => {
  if (!before && !now) return <span className="text-xs text-muted">—</span>;
  if (!before) return <span className="text-xs font-medium text-green">nouveau</span>;
  const pct = Math.round(((now - before) / before) * 100);
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-green' : 'text-danger'}`}>
      {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {Math.abs(pct)} %
    </span>
  );
};

const Kpi: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  foot: React.ReactNode;
  spark?: number[];
  color?: string;
  dashed?: boolean;
  href?: string;
}> = ({ icon: Icon, label, value, foot, spark, color = C1, dashed, href }) => {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface-2">
          <Icon className="h-4 w-4 text-accent" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          <div className="mt-1 text-xs text-muted">{foot}</div>
        </div>
        {spark && <Sparkline values={spark} color={color} dashed={dashed} />}
      </div>
    </>
  );
  return href ? (
    <a href={href} onClick={onLinkClick} className="card block p-5 transition-colors hover:border-line-strong">
      {body}
    </a>
  ) : (
    <div className="card p-5">{body}</div>
  );
};

const Panel: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  title,
  action,
  children,
  className = ''
}) => (
  <section className={`card p-5 sm:p-6 ${className}`}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-semibold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const PAGE_NAMES: Record<string, string> = { '/': 'Accueil', '/blog': 'Blog', '/cv': 'CV' };
const pageName = (p: string) => PAGE_NAMES[p] ?? (p.startsWith('/blog/') ? `Article : ${p.slice(6)}` : p);

const OverviewPage: React.FC<{ overview: Overview | null }> = ({ overview }) => {
  const { site } = useSiteEditor();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    api<Analytics>(`/api/admin/analytics?days=${days}`).then(setData).catch(() => undefined);
  }, [days]);
  useEffect(() => {
    api<ContactMessage[]>('/api/admin/messages').then(setMessages).catch(() => undefined);
    api<Post[]>('/api/admin/posts').then(setPosts).catch(() => undefined);
  }, []);

  const checks = site
    ? [
        { ok: !!site.profile.photo, label: 'Photo de profil', href: '/admin/profile' },
        { ok: !!(site.profile.phone || site.profile.whatsapp), label: 'Téléphone ou WhatsApp', href: '/admin/profile' },
        { ok: site.socials.some((s) => s.icon === 'linkedin' && s.url), label: 'Profil LinkedIn', href: '/admin/profile' },
        { ok: !!site.profile.cvUrl, label: 'CV en PDF', href: '/admin/profile' },
        { ok: site.certifications.some((c) => c.credentialUrl), label: 'Certifications vérifiables', href: '/admin/certifications' },
        { ok: posts.some((p) => p.published), label: 'Première publication', href: '/admin/news' }
      ]
    : [];
  const done = checks.filter((c) => c.ok).length;
  const series = [
    { key: 'views', label: 'Pages vues', color: C1 },
    { key: 'visitors', label: 'Visiteurs uniques', color: C2, dashed: true }
  ];
  const hello = new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {hello}, {site?.profile.shortName.split(' ')[0] ?? ''}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/admin/posts/new?kind=news" onClick={onLinkClick} className="btn btn-accent">
            <PenSquare className="h-4 w-4" />
            Publier une actualité
          </a>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { href: '/admin/news', icon: Megaphone, label: 'Actualités', value: overview ? `${overview.news.published} publiée(s)` : '…' },
          { href: '/admin/blog', icon: FileText, label: 'Blog', value: overview ? `${overview.articles.published} / ${overview.articles.total} publiés` : '…' },
          { href: '/admin/events', icon: CalendarDays, label: 'Événements', value: overview ? `${overview.events.upcoming} à venir` : '…' },
          { href: '/admin/gallery', icon: Images, label: 'Galerie', value: overview ? `${overview.albums.photos} photo(s)` : '…' },
          { href: '/admin/documents', icon: FolderOpen, label: 'Documents', value: overview ? `${overview.documents.total} fichier(s)` : '…' }
        ].map(({ href, icon: Icon, label, value }) => (
          <a key={href} href={href} onClick={onLinkClick} className="card group flex items-center gap-3 p-4 transition-colors hover:border-line-strong">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/15 to-navy/10">
              <Icon className="h-5 w-5 text-accent" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium group-hover:text-accent">{label}</span>
              <span className="block truncate text-xs text-muted">{value}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={Eye}
          label="Pages vues"
          value={data?.totals.views ?? '…'}
          foot={data ? <><Delta now={data.totals.views} before={data.totals.previousViews} /> vs période précédente</> : ' '}
          spark={data?.series.map((d) => d.views)}
        />
        <Kpi
          icon={Users}
          label="Visiteurs uniques"
          value={data?.totals.visitors ?? '…'}
          foot={data ? <><Delta now={data.totals.visitors} before={data.totals.previousVisitors} /> vs période précédente</> : ' '}
          spark={data?.series.map((d) => d.visitors)}
          color={C2}
          dashed
        />
        <Kpi
          icon={MessageSquare}
          label="Messages"
          value={overview?.messages.total ?? '…'}
          foot={overview ? `${overview.messages.unread} non lu${overview.messages.unread > 1 ? 's' : ''}` : ' '}
          href="/admin/messages"
        />
        <Kpi
          icon={BookOpen}
          label="Publications en ligne"
          value={overview ? overview.posts.published : '…'}
          foot={overview ? `${overview.posts.total - overview.posts.published} brouillon(s)` : ' '}
          href="/admin/blog"
        />
      </div>

      <Panel
        className="mt-4"
        title="Audience"
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-line p-0.5 text-sm" role="group" aria-label="Période">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  aria-pressed={days === d}
                  className={`rounded-md px-3 py-1 ${days === d ? 'bg-surface-2 font-medium text-ink' : 'text-muted hover:text-ink'}`}
                >
                  {d} j
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowTable((v) => !v)} className="btn btn-ghost px-2.5 py-1 text-sm">
              {showTable ? 'Graphique' : 'Tableau'}
            </button>
          </div>
        }
      >
        <div className="mb-4">
          <Legend series={series} />
        </div>
        {!data ? (
          <div className="h-[260px] animate-pulse rounded-xl bg-surface-2" />
        ) : showTable ? (
          <div className="max-h-[260px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface text-left text-muted">
                <tr>
                  <th className="py-2 font-medium">Jour</th>
                  <th className="py-2 text-right font-medium">Pages vues</th>
                  <th className="py-2 text-right font-medium">Visiteurs</th>
                  <th className="py-2 text-right font-medium">Messages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono">
                {[...data.series].reverse().map((d) => (
                  <tr key={d.day}>
                    <td className="py-1.5 font-sans">{new Date(`${d.day}T12:00:00Z`).toLocaleDateString('fr-FR')}</td>
                    <td className="py-1.5 text-right">{d.views}</td>
                    <td className="py-1.5 text-right">{d.visitors}</td>
                    <td className="py-1.5 text-right">{d.messages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AreaChart data={data.series} series={series} />
        )}
        {data && data.totals.views === 0 && (
          <p className="mt-3 text-sm text-muted">Les visites apparaîtront ici dès que des personnes consulteront votre site.</p>
        )}
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Pages les plus vues">
          {!data?.pages.length ? (
            <p className="text-sm text-muted">Pas encore de données.</p>
          ) : (
            <ul className="space-y-3">
              {data.pages.slice(0, 6).map((p) => (
                <li key={p.path}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate">{pageName(p.path)}</span>
                    <span className="font-mono text-muted">{p.views}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full" style={{ width: `${(p.views / data.pages[0].views) * 100}%`, background: C1 }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Messages reçus par jour">
          {data ? (
            <BarChart
              name="Messages reçus par jour"
              color={C2}
              data={data.series.map((d) => ({
                label: new Date(`${d.day}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                value: d.messages
              }))}
            />
          ) : (
            <div className="h-40 animate-pulse rounded-xl bg-surface-2" />
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Derniers messages"
          action={
            <a href="/admin/messages" onClick={onLinkClick} className="text-sm text-accent hover:underline">
              Tout voir
            </a>
          }
        >
          {messages.length === 0 ? (
            <p className="text-sm text-muted">Aucun message pour le moment.</p>
          ) : (
            <ul className="divide-y divide-line">
              {messages.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-start gap-3 py-3 first:pt-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                    {m.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate text-sm ${m.read ? '' : 'font-semibold'}`}>{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.subject || m.message}</p>
                  </div>
                  {!m.read && <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="non lu" />}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Dernières publications"
          action={
            <a href="/admin/news" onClick={onLinkClick} className="text-sm text-accent hover:underline">
              Tout voir
            </a>
          }
        >
          {posts.length === 0 ? (
            <p className="text-sm text-muted">Aucun article.</p>
          ) : (
            <ul className="divide-y divide-line">
              {posts.slice(0, 4).map((p) => (
                <li key={p.id} className="py-3 first:pt-0">
                  <a href={`/admin/posts/${p.id}`} onClick={onLinkClick} className="flex items-center justify-between gap-3 hover:text-accent">
                    <span className="truncate text-sm">{p.title.fr}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${p.published ? 'bg-green/15 text-green' : 'bg-surface-2 text-muted'}`}>
                      {p.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Profil complété">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-navy to-brand transition-all"
                style={{ width: `${checks.length ? (done / checks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="font-mono text-sm">
              {done}/{checks.length}
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {checks.map((c) => (
              <li key={c.label}>
                <a href={c.href} onClick={onLinkClick} className="flex items-center gap-2 text-sm hover:text-accent">
                  {c.ok ? <CheckCircle2 className="h-4 w-4 text-green" /> : <Circle className="h-4 w-4 text-muted" />}
                  <span className={c.ok ? 'text-muted line-through' : ''}>{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <Database className="h-5 w-5 text-accent" />
          <div className="text-sm">
            <p className="font-medium">
              {overview ? (overview.storage === 'postgres' ? 'Base de données Neon / PostgreSQL' : 'Stockage local (développement)') : '…'}
            </p>
            {overview?.storage === 'file' && <p className="text-muted">En ligne, configurez DATABASE_URL (Neon).</p>}
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <Sparkles className="h-5 w-5 text-accent" />
          <div className="text-sm">
            <p className="font-medium">{overview ? (overview.chatConfigured ? 'Assistant IA actif' : 'Assistant IA inactif') : '…'}</p>
            {overview && !overview.chatConfigured && <p className="text-muted">Ajoutez GEMINI_API_KEY dans le fichier .env.</p>}
          </div>
        </div>
      </div>
    </>
  );
};

// ----------------------------------------------------------------- Mise en page
const NAV_GROUPS = [
  {
    title: 'Général',
    items: [
      { href: '/admin', label: "Vue d'ensemble", icon: Home },
      { href: '/admin/messages', label: 'Messages', icon: Mail }
    ]
  },
  {
    title: 'Publications',
    items: [
      { href: '/admin/news', label: 'Actualités', icon: Megaphone },
      { href: '/admin/blog', label: 'Blog', icon: FileText },
      { href: '/admin/events', label: 'Événements', icon: CalendarDays },
      { href: '/admin/gallery', label: 'Galerie photos', icon: Images },
      { href: '/admin/documents', label: 'Documents', icon: FolderOpen }
    ]
  },
  {
    title: 'Portfolio',
    items: [
      { href: '/admin/projects', label: 'Projets', icon: FolderKanban },
      { href: '/admin/skills', label: 'Compétences', icon: Layers },
      { href: '/admin/timeline', label: 'Parcours', icon: Route },
      { href: '/admin/certifications', label: 'Certifications', icon: Award },
      { href: '/admin/services', label: 'Services', icon: Briefcase },
      { href: '/admin/stats', label: 'Chiffres clés', icon: BarChart3 }
    ]
  },
  {
    title: 'Paramètres',
    items: [
      { href: '/admin/profile', label: 'Profil et liens', icon: UserRound },
      { href: '/admin/settings', label: 'Paramètres de l’app', icon: Settings }
    ]
  }
];
const ALL_NAV = NAV_GROUPS.flatMap((g) => g.items);

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const path = usePath();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const { dirty, site } = useSiteEditor();

  const loadOverview = useCallback(() => {
    api<Overview>('/api/admin/overview').then(setOverview).catch(() => undefined);
  }, []);
  useEffect(loadOverview, [loadOverview, path]);
  useEffect(() => setMenuOpen(false), [path]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dirty && !window.confirm('Des modifications ne sont pas enregistrées. Quitter quand même ?')) {
      e.preventDefault();
      return;
    }
    onLinkClick(e);
  };

  const postMatch = path.match(/^\/admin\/posts\/([^/]+)$/);
  let page: React.ReactNode;
  if (path === '/admin' || path === '/admin/') page = <OverviewPage overview={overview} />;
  else if (path === '/admin/news') page = <PostsListPage kind="news" />;
  else if (path === '/admin/blog' || path === '/admin/posts') page = <PostsListPage kind="article" />;
  else if (path === '/admin/events') page = <EventsPage />;
  else if (path === '/admin/gallery') page = <GalleryPage />;
  else if (path === '/admin/documents') page = <DocumentsPage />;
  else if (postMatch) page = <PostEditorPage id={postMatch[1] === 'new' ? null : postMatch[1]} />;
  else if (path === '/admin/messages') page = <MessagesPage onCountChange={loadOverview} />;
  else if (path === '/admin/profile') page = <ProfilePage />;
  else if (path === '/admin/projects') page = <ProjectsPage />;
  else if (path === '/admin/skills') page = <SkillsPage />;
  else if (path === '/admin/timeline') page = <TimelinePage />;
  else if (path === '/admin/certifications') page = <CertificationsPage />;
  else if (path === '/admin/services') page = <ServicesPage />;
  else if (path === '/admin/stats') page = <StatsPage />;
  else if (path === '/admin/settings') page = <AppSettingsPage />;
  else page = <PageTitle title="Page introuvable" />;

  const isActive = (href: string) => (href === '/admin' ? path === '/admin' || path === '/admin/' : path.startsWith(href));
  const current = ALL_NAV.find((n) => isActive(n.href));

  const sidebar = (
    <nav aria-label="Tableau de bord" className="space-y-6">
      {NAV_GROUPS.map((g) => (
        <div key={g.title}>
          <p className="mb-2 px-3 font-mono text-[11px] text-muted">{g.title}</p>
          <ul className="space-y-0.5">
            {g.items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={go}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(href) ? 'bg-surface-2 font-medium text-ink' : 'text-muted hover:bg-surface-2/60 hover:text-ink'
                  }`}
                >
                  {isActive(href) && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-gradient-to-b from-navy to-brand" />}
                  <Icon className={`h-4 w-4 ${isActive(href) ? 'text-accent' : ''}`} />
                  <span className="flex-1">{label}</span>
                  {href === '/admin/messages' && !!overview?.messages.unread && (
                    <span className="rounded-full bg-accent px-1.5 text-[11px] font-bold text-on-accent">{overview.messages.unread}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  const userCard = (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-navy to-brand font-mono text-xs font-bold text-white">
        {site?.profile.initials ?? '…'}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{site?.profile.shortName ?? ''}</p>
        <p className="text-xs text-muted">Administrateur</p>
      </div>
      <button type="button" onClick={onLogout} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Se déconnecter" title="Se déconnecter">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r border-line bg-surface lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <a href="/admin" onClick={go} className="flex items-center gap-3 px-2 py-2">
            <BrandLogo className="h-8" />
            <div className="border-l border-line pl-3">
              <p className="text-sm font-semibold leading-tight">Portfolio</p>
              <p className="text-xs text-muted">Administration</p>
            </div>
          </a>
          <div className="mt-6 flex-1 overflow-y-auto pl-3">{sidebar}</div>
          {userCard}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-xl sm:px-8">
          <button
            type="button"
            className="btn-ghost grid h-9 w-9 place-items-center rounded-lg lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="truncate text-sm text-muted">
            Administration <span className="mx-1.5">/</span>
            <span className="text-ink">{postMatch ? 'Éditeur de publication' : current?.label ?? ''}</span>
          </p>
          <div className="ml-auto flex items-center gap-1">
            {site?.settings.maintenanceMode && (
              <a
                href="/admin/settings#features"
                onClick={go}
                className="mr-1 hidden items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 sm:inline-flex dark:text-amber-300"
              >
                <Construction className="h-3.5 w-3.5" />
                Maintenance active
              </a>
            )}
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              className="btn btn-secondary py-1.5 text-sm"
              aria-label="Réglages rapides"
              title="Réglages rapides"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden md:inline">Réglages rapides</span>
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary py-1.5 text-sm">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
            <ThemeToggle />
          </div>
        </header>
        {menuOpen && (
          <div className="space-y-4 border-b border-line bg-surface p-4 pl-7 lg:hidden">
            {sidebar}
            {userCard}
          </div>
        )}
        <QuickSettings open={quickOpen} onClose={() => setQuickOpen(false)} />
        <main className="px-4 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-6xl">{page}</div>
        </main>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------- Racine
export default function AdminApp() {
  const [auth, setAuth] = useState<{ authenticated: boolean; configured: boolean } | null>(null);

  const check = useCallback(() => {
    resetAdminSession();
    api<{ authenticated: boolean; configured: boolean }>('/api/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false, configured: true }));
  }, []);

  useEffect(() => {
    check();
    document.title = 'Tableau de bord — Portfolio';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [check]);

  const onUnauthorized = useCallback(() => setAuth((a) => ({ configured: a?.configured ?? true, authenticated: false })), []);

  // Session expirée (30 min d'inactivité, 8 h maximum ou déconnexion à distance) → écran de connexion.
  useEffect(() => {
    window.addEventListener('admin-session-expired', onUnauthorized);
    return () => window.removeEventListener('admin-session-expired', onUnauthorized);
  }, [onUnauthorized]);

  // Verrouillage automatique côté navigateur après 30 min sans activité.
  useEffect(() => {
    if (!auth?.authenticated) return;
    let timer = 0;
    const lock = () => {
      api('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
      resetAdminSession();
      onUnauthorized();
    };
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(lock, 30 * 60_000);
    };
    const events = ['pointerdown', 'keydown', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [auth?.authenticated, onUnauthorized]);

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    resetAdminSession();
    setAuth((a) => ({ configured: a?.configured ?? true, authenticated: false }));
    navigate('/admin');
  };

  if (!auth) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }
  if (!auth.authenticated) return <Login configured={auth.configured} onSuccess={check} />;

  return (
    <SiteEditorProvider onUnauthorized={onUnauthorized}>
      <Dashboard onLogout={logout} />
    </SiteEditorProvider>
  );
}
