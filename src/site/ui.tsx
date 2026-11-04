import React, { useEffect, useRef } from 'react';
import { Facebook, Github, Globe, Instagram, Linkedin, MessageCircle, Twitter, Youtube, X } from 'lucide-react';
import type { SocialIcon } from '../../shared/types';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { useReveal } from '../hooks/useFx';
import { useLanguage } from '../context/LanguageContext';

export const SOCIAL_ICONS: Record<SocialIcon, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  x: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  whatsapp: MessageCircle,
  website: Globe
};

/** En-tête de section : chemin façon terminal, titre et introduction. */
export const SectionHeader: React.FC<{ id: string; path: string; title: string; intro?: string; action?: React.ReactNode }> = ({
  id,
  path,
  title,
  intro,
  action
}) => (
  <header className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
    <div className="max-w-2xl">
      <p className="kicker">
        <span className="text-muted">~/</span>
        {path}
      </p>
      <h2 id={`${id}-title`} className="mt-3 text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
    </div>
    {action}
  </header>
);

export const Section: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className = '' }) => {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} aria-labelledby={`${id}-title`} className={`relative py-16 sm:py-20 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
};

/** Fenêtre modale accessible : Échap, clic à l'extérieur, défilement bloqué, focus initial. */
export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ open, onClose, label, children, wide }) => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  useModalBehavior(open, onClose);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={`relative w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'} max-h-[92vh] overflow-y-auto rounded-t-2xl border border-line-strong bg-surface shadow-2xl outline-none sm:rounded-2xl`}
      >
        <button
          onClick={onClose}
          aria-label={t('Fermer', 'Close')}
          className="absolute right-3 top-3 z-10 rounded-full bg-surface/80 p-2 text-muted backdrop-blur hover:bg-surface-2 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

/** Fenêtre de terminal (barre avec les trois points). */
export const TerminalWindow: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className = ''
}) => (
  <div className={`card shadow-2xl shadow-black/20 ${className}`}>
    <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
      <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      <span className="ml-3 truncate font-mono text-xs text-muted">{title}</span>
    </div>
    {children}
  </div>
);

export function formatDate(iso: string | null, lang: 'fr' | 'en') {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
