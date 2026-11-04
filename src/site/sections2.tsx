import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Bot, CheckCircle2, LayoutDashboard, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import type { PostSummary } from '../../shared/types';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { spotlight } from '../hooks/useFx';
import { api, ApiError } from '../lib/api';
import { onLinkClick } from '../lib/router';
import { safeUrl, whatsappUrl } from '../lib/safeUrl';
import { BrandLogo } from './Header';
import { useAdminSession } from '../hooks/useAdminSession';
import { Modal, SOCIAL_ICONS, Section, SectionHeader, formatDate } from './ui';

// ---------------------------------------------------------------- Articles
/** Adresse publique d'une publication selon son type. */
export const postBase = (kind: PostSummary['kind']) => (kind === 'news' ? '/actualites' : '/blog');

export const PostCard: React.FC<{ post: PostSummary; large?: boolean }> = ({ post, large }) => {
  const { t, l, language } = useLanguage();
  const href = `${postBase(post.kind)}/${post.slug}`;
  return (
    <article onMouseMove={spotlight} className={`card card-spotlight reveal group flex flex-col ${large ? 'md:col-span-2' : ''}`}>
      <a href={href} onClick={onLinkClick} className="block overflow-hidden border-b border-line" tabIndex={-1} aria-hidden="true">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${large ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}
          />
        ) : (
          <div className={`grid place-items-center bg-gradient-to-br from-brand/20 via-surface-2 to-navy/15 ${large ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
            <span className="font-mono text-sm text-muted">{`# ${post.category || (post.kind === 'news' ? 'actualite' : 'blog')}`}</span>
          </div>
        )}
      </a>
      <div className="relative flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className={`chip ${post.kind === 'news' ? '!text-cyan' : '!text-accent'}`}>
            {post.kind === 'news' ? t('Actualité', 'News') : post.category || t('Article', 'Article')}
          </span>
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt, language)}</time>
          <span>{t(`${post.readingMinutes} min de lecture`, `${post.readingMinutes} min read`)}</span>
        </p>
        <h3 className={`mt-3 font-semibold tracking-tight ${large ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
          <a href={href} onClick={onLinkClick} className="hover:text-accent">
            {l(post.title)}
          </a>
        </h3>
        {l(post.excerpt) && <p className="mt-2 line-clamp-3 text-muted">{l(post.excerpt)}</p>}
        <a href={href} onClick={onLinkClick} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium hover:text-accent">
          {t('Lire', 'Read')}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};

export const BlogSection: React.FC<{ kind?: PostSummary['kind'] }> = ({ kind = 'article' as PostSummary['kind'] }) => {
  const { posts, news } = useContent();
  const { t } = useLanguage();
  const list = kind === 'news' ? news : posts;
  if (!list.length) return null;
  const id = kind === 'news' ? 'news' : 'blog';
  return (
    <Section id={id}>
      <SectionHeader
        id={id}
        path={kind === 'news' ? 'actualites' : 'blog'}
        title={kind === 'news' ? t('Actualités', 'News') : t('Blog', 'Blog')}
        intro={
          kind === 'news'
            ? t('Les dernières nouvelles : projets, certifications, événements.', 'Latest news: projects, certifications, events.')
            : t('Ce que j’apprends et ce que je construis.', 'What I learn and what I build.')
        }
        action={
          <a href={postBase(kind)} onClick={onLinkClick} className="btn btn-secondary">
            {t('Tout voir', 'See all')}
            <ArrowRight className="h-4 w-4" />
          </a>
        }
      />
      <div className="grid gap-5 md:grid-cols-3">
        {list.slice(0, 3).map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </Section>
  );
};

// ---------------------------------------------------------------- Assistant IA
interface ChatLine {
  from: 'user' | 'ai';
  text: string;
}

export const ChatModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t, language } = useLanguage();
  const { site } = useContent();
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [lines, busy]);

  const ask = async (text: string) => {
    if (!text.trim() || busy) return;
    setLines((l) => [...l, { from: 'user', text }]);
    setInput('');
    setBusy(true);
    try {
      const res = await api<{ reply: string }>('/api/chat', { method: 'POST', json: { message: text, language } });
      setLines((l) => [...l, { from: 'ai', text: res.reply }]);
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 429
          ? t('Trop de questions en peu de temps. Réessayez dans quelques minutes.', 'Too many questions. Please try again in a few minutes.')
          : t(`L'assistant est indisponible. Écrivez à ${site.profile.email}.`, `The assistant is unavailable. Email ${site.profile.email}.`);
      setLines((l) => [...l, { from: 'ai', text: msg }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} label={t('Assistant IA', 'AI assistant')}>
      <div className="flex h-[min(580px,85vh)] flex-col">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4 pr-12">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-navy to-brand text-white">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">{t('Assistant IA', 'AI assistant')}</h2>
            <p className="text-xs text-muted">{t('Répond à partir des informations de ce site (Gemini).', 'Answers from this site’s information (Gemini).')}</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite">
          {lines.length === 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-sm text-muted">{t('Essayez :', 'Try:')}</p>
              {[
                t('Quels sont ses projets principaux ?', 'What are the main projects?'),
                t('Quelles technologies utilise-t-il ?', 'Which technologies are used?'),
                t('Est-il disponible pour un stage ?', 'Available for an internship?')
              ].map((q) => (
                <button key={q} type="button" className="block w-full rounded-xl border border-line px-4 py-2.5 text-left text-sm hover:border-accent" onClick={() => ask(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
          {lines.map((line, i) => (
            <p
              key={i}
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[0.95rem] ${
                line.from === 'user' ? 'ml-auto bg-accent text-on-accent' : 'border border-line bg-surface-2'
              }`}
            >
              {line.text}
            </p>
          ))}
          {busy && <p className="font-mono text-sm text-muted">{t('réflexion…', 'thinking…')}</p>}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input.trim());
          }}
          className="flex gap-2 border-t border-line p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            className="field"
            placeholder={t('Votre question…', 'Your question…')}
            aria-label={t('Votre question', 'Your question')}
          />
          <button type="submit" className="btn btn-accent px-3" disabled={!input.trim() || busy} aria-label={t('Envoyer', 'Send')}>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Modal>
  );
};

// ---------------------------------------------------------------- Contact
export const Contact: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  const p = site.profile;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const wa = whatsappUrl(p.whatsapp);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      await api('/api/contact', { method: 'POST', json: form });
      setState('sent');
      setForm({ name: '', email: '', subject: '', message: '', website: '' });
    } catch (err) {
      setState('error');
      setError(
        err instanceof ApiError && err.status < 500
          ? err.message
          : t(`Le message n'a pas pu être envoyé. Écrivez-moi directement à ${p.email}.`, `The message could not be sent. Email me directly at ${p.email}.`)
      );
    }
  };

  const channels = [
    { icon: Mail, label: 'E-mail', value: p.email, href: `mailto:${p.email}` },
    p.phone && { icon: Phone, label: t('Téléphone', 'Phone'), value: p.phone, href: `tel:${p.phone.replace(/\s/g, '')}` },
    wa && { icon: MessageCircle, label: 'WhatsApp', value: p.whatsapp, href: wa, external: true },
    { icon: MapPin, label: t('Localisation', 'Location'), value: l(p.location) }
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string; external?: boolean }[];

  return (
    <Section id="contact">
      <div aria-hidden="true" className="bg-glow pointer-events-none absolute inset-x-0 top-0 h-96 opacity-70" />
      <SectionHeader
        id="contact"
        path="contact"
        title={t('Travaillons ensemble', 'Let’s work together')}
        intro={t(
          'Un stage, un projet ou une question ? Écrivez-moi, je réponds en général sous 48 heures.',
          'An internship, a project or a question? Write to me, I usually reply within 48 hours.'
        )}
      />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-4">
          <ul className="card reveal divide-y divide-line">
            {channels.map(({ icon: Icon, label, value, href, external }) => {
              const content = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2">
                    <Icon className="h-[18px] w-[18px] text-accent" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{label}</span>
                    <span className="block truncate font-medium">{value}</span>
                  </span>
                  {href && <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted" />}
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} target={external ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-4 p-4 hover:bg-surface-2">
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {site.socials.length > 0 && (
            <div className="reveal flex flex-wrap gap-2">
              {site.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon] ?? SOCIAL_ICONS.website;
                const href = safeUrl(s.url);
                return href ? (
                  <a key={s.id} href={href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" aria-label={s.label}>
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </a>
                ) : null;
              })}
            </div>
          )}

          {site.settings.chatEnabled && (
            <div className="card reveal p-5">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-navy to-brand text-white">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{t('Une question rapide ?', 'A quick question?')}</p>
                  <p className="mt-1 text-sm text-muted">
                    {t('Mon assistant IA répond sur mes projets, compétences et disponibilités.', 'My AI assistant answers about my projects, skills and availability.')}
                  </p>
                  <button type="button" onClick={() => setChatOpen(true)} className="btn btn-secondary mt-4">
                    {t("Ouvrir l'assistant", 'Open the assistant')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card reveal p-6 sm:p-8">
          {!site.settings.contactFormEnabled ? (
            <div className="grid h-full place-items-center py-10 text-center">
              <div>
                <Mail className="mx-auto h-10 w-10 text-accent" />
                <p className="mt-4 text-xl font-semibold">{t('Écrivez-moi par e-mail', 'Email me')}</p>
                <p className="mt-2 text-muted">{p.email}</p>
                <a href={`mailto:${p.email}`} className="btn btn-accent mt-6">
                  <Send className="h-4 w-4" />
                  {t('Envoyer un e-mail', 'Send an email')}
                </a>
              </div>
            </div>
          ) : state === 'sent' ? (
            <div className="grid h-full place-items-center py-10 text-center" role="status">
              <div>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green" />
                <p className="mt-4 text-xl font-semibold">{t('Message envoyé', 'Message sent')}</p>
                <p className="mt-2 text-muted">{t('Merci, je vous réponds rapidement.', 'Thank you, I will get back to you soon.')}</p>
                <button type="button" className="btn btn-secondary mt-6" onClick={() => setState('idle')}>
                  {t('Écrire un autre message', 'Write another message')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input type="text" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="label">
                    {t('Nom', 'Name')}
                  </label>
                  <input id="c-name" name="name" required maxLength={100} autoComplete="name" value={form.name} onChange={update} className="field" />
                </div>
                <div>
                  <label htmlFor="c-email" className="label">
                    {t('E-mail', 'Email')}
                  </label>
                  <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" value={form.email} onChange={update} className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="c-subject" className="label">
                  {t('Sujet', 'Subject')} <span className="font-normal text-muted">({t('facultatif', 'optional')})</span>
                </label>
                <input id="c-subject" name="subject" maxLength={200} value={form.subject} onChange={update} className="field" />
              </div>
              <div>
                <label htmlFor="c-message" className="label">
                  Message
                </label>
                <textarea id="c-message" name="message" required rows={7} maxLength={5000} value={form.message} onChange={update} className="field resize-y" />
              </div>
              {state === 'error' && (
                <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-accent w-full sm:w-auto" disabled={state === 'sending'}>
                <Send className="h-4 w-4" />
                {state === 'sending' ? t('Envoi…', 'Sending…') : t('Envoyer le message', 'Send message')}
              </button>
            </form>
          )}
        </div>
      </div>
      {site.settings.chatEnabled && <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />}
    </Section>
  );
};

// ---------------------------------------------------------------- Pied de page
export const Footer: React.FC = () => {
  const { site } = useContent();
  const { t, l } = useLanguage();
  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <BrandLogo variant="full" className="h-28" />
          <p className="mt-4 max-w-sm text-sm text-muted">
            {site.profile.name}. {l(site.profile.slogan)}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted">{t('// navigation', '// navigation')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/#projects" onClick={onLinkClick} className="hover:text-accent">
                {t('Projets', 'Projects')}
              </a>
            </li>
            <li>
              <a href="/actualites" onClick={onLinkClick} className="hover:text-accent">
                {t('Actualités', 'News')}
              </a>
            </li>
            <li>
              <a href="/blog" onClick={onLinkClick} className="hover:text-accent">
                Blog
              </a>
            </li>
            <li>
              <a href="/evenements" onClick={onLinkClick} className="hover:text-accent">
                {t('Événements', 'Events')}
              </a>
            </li>
            <li>
              <a href="/galerie" onClick={onLinkClick} className="hover:text-accent">
                {t('Galerie', 'Gallery')}
              </a>
            </li>
            <li>
              <a href="/documents" onClick={onLinkClick} className="hover:text-accent">
                Documents
              </a>
            </li>
            <li>
              <a href="/cv" onClick={onLinkClick} className="hover:text-accent">
                CV
              </a>
            </li>
            <li>
              <a href="/#contact" onClick={onLinkClick} className="hover:text-accent">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs text-muted">{t('// réseaux', '// social')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.profile.email}`} className="hover:text-accent">
                E-mail
              </a>
            </li>
            {site.socials.map((s) =>
              safeUrl(s.url) ? (
                <li key={s.id}>
                  <a href={safeUrl(s.url)} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-6 font-mono text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {site.profile.name}
          </p>
          <p className="flex items-center gap-4">
            <span>React · TypeScript · Node.js</span>
            <a href="/admin" onClick={onLinkClick} className="inline-flex items-center gap-1 hover:text-ink">
              <LayoutDashboard className="h-3.5 w-3.5" />
              {t('Administration', 'Admin')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

/** Bouton flottant vers le tableau de bord, visible seulement quand l'administrateur est connecté. */
export const AdminShortcut: React.FC = () => {
  const logged = useAdminSession();
  if (!logged) return null;
  return (
    <a href="/admin" onClick={onLinkClick} className="btn btn-primary fixed bottom-5 right-5 z-40 shadow-2xl" title="Tableau de bord">
      <LayoutDashboard className="h-4 w-4" />
      Tableau de bord
    </a>
  );
};
