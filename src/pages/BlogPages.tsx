import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Post, PostKind } from '../../shared/types';
import { postBase } from '../site/sections2';
import { readingMinutes } from '../../shared/utils';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError } from '../lib/api';
import { onLinkClick } from '../lib/router';
import { Markdown } from '../site/Markdown';
import { PostCard } from '../site/sections2';
import { formatDate } from '../site/ui';
import { useReveal } from '../hooks/useFx';

/** Page de liste réutilisée pour /blog (articles) et /actualites (actualités). */
export const BlogListPage: React.FC<{ kind: PostKind }> = ({ kind }) => {
  const { posts, news, status } = useContent();
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();
  const list = kind === 'news' ? news : posts;
  const title = kind === 'news' ? t('Actualités', 'News') : t('Blog', 'Blog');

  useEffect(() => {
    document.title = `${title} — Néhémie Onun`;
  }, [title]);

  return (
    <div ref={ref} className="container-page py-14 sm:py-20">
      <p className="kicker">
        <span className="text-muted">~/</span>
        {kind === 'news' ? 'actualites' : 'blog'}
      </p>
      <h1 className="display mt-3 text-4xl sm:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {kind === 'news'
          ? t('Les dernières nouvelles : projets, certifications, événements.', 'Latest news: projects, certifications, events.')
          : t('Articles, tutoriels et retours d’expérience.', 'Articles, tutorials and lessons learned.')}
      </p>
      {list.length === 0 ? (
        <p className="mt-12 text-muted">
          {status === 'loading' ? t('Chargement…', 'Loading…') : t('Rien de publié pour le moment.', 'Nothing published yet.')}
        </p>
      ) : (
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {list.map((p, i) => (
            <PostCard key={p.id} post={p} large={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
};

export const PostPage: React.FC<{ slug: string; kind: PostKind }> = ({ slug, kind }) => {
  const { t, l, language } = useLanguage();
  const { site } = useContent();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<'notfound' | 'network' | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setError(null);
    api<Post>(`/api/posts/${encodeURIComponent(slug)}`)
      .then((p) => !cancelled && setPost(p))
      .catch((err) => !cancelled && setError(err instanceof ApiError && err.status === 404 ? 'notfound' : 'network'));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${l(post.title)} — ${site.profile.shortName}`;
  }, [post, l, site.profile.shortName]);

  const back = (
    <a href={postBase(post?.kind ?? kind)} onClick={onLinkClick} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
      <ArrowLeft className="h-4 w-4" />
      {(post?.kind ?? kind) === 'news' ? t('Toutes les actualités', 'All news') : t('Tous les articles', 'All posts')}
    </a>
  );

  if (error) {
    return (
      <div className="container-page py-20">
        {back}
        <h1 className="heading mt-8 text-3xl">
          {error === 'notfound' ? t('Article introuvable', 'Post not found') : t('Impossible de charger l’article', 'Could not load the post')}
        </h1>
        <p className="mt-3 text-muted">
          {error === 'notfound'
            ? t('Il a peut-être été retiré ou son adresse a changé.', 'It may have been removed or its address changed.')
            : t('Vérifiez votre connexion puis rechargez la page.', 'Check your connection and reload the page.')}
        </p>
      </div>
    );
  }

  if (!post) {
    return <div className="container-page py-20 text-muted">{t('Chargement…', 'Loading…')}</div>;
  }

  const content = language === 'en' && post.content.en.trim() ? post.content.en : post.content.fr;

  return (
    <article className="container-page py-12 sm:py-16">
      {back}
      <header className="mt-8 max-w-3xl">
        <p className="flex flex-wrap gap-x-3 text-sm text-muted">
          <span className={`font-semibold ${post.kind === 'news' ? 'text-copper' : 'text-accent'}`}>
            {post.kind === 'news' ? t('Actualité', 'News') : post.category || t('Article', 'Article')}
          </span>
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt, language)}</time>
          <span>{t(`${readingMinutes(post)} min de lecture`, `${readingMinutes(post)} min read`)}</span>
        </p>
        <h1 className="display mt-4 text-4xl leading-[1.05] sm:text-5xl">{l(post.title)}</h1>
        {l(post.excerpt) && <p className="mt-5 text-xl text-muted">{l(post.excerpt)}</p>}
      </header>
      {post.image && (
        <img src={post.image} alt="" className="mt-10 aspect-[16/8] w-full max-w-4xl rounded-xl border border-line object-cover" />
      )}
      <Markdown source={content} className="prose-article mt-10" />
      {post.tags.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="chip">
              #{tag}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-14 border-t border-line pt-6 text-muted">
        {t('Écrit par', 'Written by')} <span className="font-semibold text-ink">{site.profile.name}</span>.{' '}
        <a href="/#contact" onClick={onLinkClick} className="link">
          {t('Me contacter', 'Contact me')}
        </a>
      </p>
    </article>
  );
};
