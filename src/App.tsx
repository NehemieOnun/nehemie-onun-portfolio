import React, { Suspense, lazy, useEffect } from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { usePath } from './lib/router';
import { Header } from './site/Header';
import { AdminShortcut, Footer } from './site/sections2';
import { BrandLogo } from './site/Header';
import { useAdminSession } from './hooks/useAdminSession';
import { HomePage } from './pages/HomePage';
import { BlogListPage, PostPage } from './pages/BlogPages';
import { CvPage } from './pages/CvPage';
import { AlbumPage, DocumentsListPage, EventsListPage, GalleryListPage } from './site/publications';
import { NotFound } from './pages/NotFound';

// Le tableau de bord n'est téléchargé que si l'on va sur /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const PublicSite: React.FC<{ path: string }> = ({ path }) => {
  const { site, status } = useContent();
  const { t } = useLanguage();
  const { setSiteDefault } = useTheme();
  const { applySiteDefault, l } = useLanguage();
  const isAdminLogged = useAdminSession();

  useEffect(() => setSiteDefault(site.settings.defaultTheme), [site.settings.defaultTheme, setSiteDefault]);
  useEffect(() => {
    if (status !== 'loading') applySiteDefault(site.settings.defaultLanguage);
  }, [status, site.settings.defaultLanguage, applySiteDefault]);

  // Statistiques anonymes (page vue), consultables dans le tableau de bord.
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
      keepalive: true
    }).catch(() => undefined);
  }, [path]);

  useEffect(() => {
    if (path === '/') document.title = site.settings.seoTitle || site.profile.name;
    if (site.settings.seoDescription) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', site.settings.seoDescription);
    }
  }, [path, site]);

  let page: React.ReactNode;
  const clean = path.replace(/\/+$/, '') || '/';
  const postMatch = clean.match(/^\/(blog|actualites)\/([^/]+)$/);
  const albumMatch = clean.match(/^\/galerie\/([^/]+)$/);
  if (clean === '/') page = <HomePage />;
  else if (clean === '/blog') page = <BlogListPage kind="article" />;
  else if (clean === '/actualites') page = <BlogListPage kind="news" />;
  else if (postMatch) page = <PostPage key={postMatch[2]} slug={decodeURIComponent(postMatch[2])} kind={postMatch[1] === 'actualites' ? 'news' : 'article'} />;
  else if (clean === '/evenements') page = <EventsListPage />;
  else if (clean === '/galerie') page = <GalleryListPage />;
  else if (albumMatch) page = <AlbumPage id={decodeURIComponent(albumMatch[1])} />;
  else if (clean === '/documents') page = <DocumentsListPage />;
  else if (clean === '/cv') page = <CvPage />;
  else page = <NotFound />;

  // En maintenance, on attend de savoir si l'administrateur est connecté (évite d'afficher le site un instant).
  if (status === 'loading' || (site.settings.maintenanceMode && isAdminLogged === null)) {
    return (
      <div className="grid min-h-screen place-items-center" role="status" aria-label={t('Chargement', 'Loading')}>
        <span className="h-10 w-10 animate-pulse rounded-xl bg-gradient-to-br from-navy to-brand" />
      </div>
    );
  }

  // Mode maintenance : les visiteurs voient un message, l'administrateur connecté voit le site.
  if (site.settings.maintenanceMode && isAdminLogged === false) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
        <div aria-hidden="true" className="bg-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-lg">
          <div className="flex justify-center">
            <BrandLogo variant="full" className="h-32" />
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">{t('Site en maintenance', 'Under maintenance')}</h1>
          <p className="mt-4 text-lg text-muted">{l(site.settings.maintenanceMessage)}</p>
          <a href={`mailto:${site.profile.email}`} className="btn btn-accent mt-8">
            {t('Me contacter par e-mail', 'Email me')}
          </a>
        </div>
      </main>
    );
  }

  return (
    <>
      {site.settings.maintenanceMode && isAdminLogged && (
        <p className="bg-copper px-4 py-2 text-center text-sm font-medium text-white">
          {t('Mode maintenance actif : seuls vous voyez le site.', 'Maintenance mode: only you can see the site.')}
        </p>
      )}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {t('Aller au contenu', 'Skip to content')}
      </a>
      {clean !== '/cv' && <Header />}
      <main id="main">{page}</main>
      {clean !== '/cv' && <Footer />}
      <AdminShortcut />
    </>
  );
};

export default function App() {
  const path = usePath();
  const isAdmin = path === '/admin' || path.startsWith('/admin/');

  return (
    <LanguageProvider>
      <ThemeProvider>
        {isAdmin ? (
          <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
            <AdminApp />
          </Suspense>
        ) : (
          <ContentProvider>
            <PublicSite path={path} />
          </ContentProvider>
        )}
      </ThemeProvider>
    </LanguageProvider>
  );
}
