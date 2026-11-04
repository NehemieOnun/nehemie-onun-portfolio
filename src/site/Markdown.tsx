import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/** Affiche du Markdown en HTML nettoyé (aucun script ne peut passer). */
export const Markdown: React.FC<{ source: string; className?: string }> = ({ source, className }) => {
  const html = useMemo(() => {
    const raw = marked.parse(source ?? '', { async: false, gfm: true, breaks: true }) as string;
    const clean = DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    // Liens externes : nouvel onglet, sans transmettre la page d'origine.
    return clean.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  }, [source]);
  return <div className={className ?? 'prose-article'} dangerouslySetInnerHTML={{ __html: html }} />;
};
