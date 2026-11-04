import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Inbox, Mail, MailOpen, Reply, Search, Trash2 } from 'lucide-react';
import type { ContactMessage } from '../../shared/types';
import { api } from '../lib/api';
import { PageTitle } from './ContentPages';

const fmt = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today
    ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const MessagesPage: React.FC<{ onCountChange?: () => void }> = ({ onCountChange }) => {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api<ContactMessage[]>('/api/admin/messages').then(setMessages).catch((e) => setError(e.message));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (messages ?? []).filter(
      (m) =>
        (filter === 'all' || !m.read) &&
        (!q || `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(q))
    );
  }, [messages, filter, query]);
  const open = messages?.find((m) => m.id === openId) ?? null;
  const unread = (messages ?? []).filter((m) => !m.read).length;

  const setRead = async (m: ContactMessage, read: boolean) => {
    setMessages((list) => list?.map((x) => (x.id === m.id ? { ...x, read } : x)) ?? null);
    await api(`/api/admin/messages/${m.id}`, { method: 'PATCH', json: { read } }).catch(() => undefined);
    onCountChange?.();
  };

  const select = (m: ContactMessage) => {
    setOpenId(m.id);
    if (!m.read) setRead(m, true);
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(`Supprimer le message de ${m.name} ?`)) return;
    await api(`/api/admin/messages/${m.id}`, { method: 'DELETE' });
    setMessages((list) => list?.filter((x) => x.id !== m.id) ?? null);
    setOpenId(null);
    onCountChange?.();
  };

  return (
    <>
      <PageTitle title="Messages" intro="Messages envoyés depuis le formulaire de contact de votre site." />
      {error && <p className="text-danger">{error}</p>}

      <div className="card grid min-h-[34rem] lg:grid-cols-[22rem_1fr]">
        {/* Liste */}
        <div className={`flex flex-col border-line lg:border-r ${open ? 'hidden lg:flex' : 'flex'}`}>
          <div className="space-y-3 border-b border-line p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                className="field pl-9"
                placeholder="Rechercher…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Rechercher dans les messages"
              />
            </div>
            <div className="flex gap-1 text-sm">
              {(
                [
                  ['all', `Tous (${messages?.length ?? 0})`],
                  ['unread', `Non lus (${unread})`]
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  aria-pressed={filter === id}
                  className={`rounded-lg px-3 py-1.5 ${filter === id ? 'bg-surface-2 font-medium' : 'text-muted hover:text-ink'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {!messages && !error && <p className="p-4 text-sm text-muted">Chargement…</p>}
          {messages && shown.length === 0 && (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-muted">
              <div>
                <Inbox className="mx-auto mb-3 h-8 w-8" />
                {messages.length === 0 ? 'Aucun message pour le moment.' : 'Aucun message ne correspond.'}
              </div>
            </div>
          )}
          <ul className="flex-1 divide-y divide-line overflow-y-auto">
            {shown.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => select(m)}
                  className={`flex w-full gap-3 px-4 py-3.5 text-left transition-colors ${openId === m.id ? 'bg-surface-2' : 'hover:bg-surface-2/60'}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                    {m.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={`truncate text-sm ${m.read ? '' : 'font-semibold'}`}>{m.name}</span>
                      <span className="shrink-0 text-xs text-muted">{fmt(m.createdAt)}</span>
                    </span>
                    <span className={`block truncate text-sm ${m.read ? 'text-muted' : ''}`}>{m.subject || '(sans objet)'}</span>
                    <span className="block truncate text-xs text-muted">{m.message}</span>
                  </span>
                  {!m.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="non lu" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Lecture */}
        <div className={`${open ? 'flex' : 'hidden lg:flex'} flex-col`}>
          {!open ? (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-muted">
              <div>
                <Mail className="mx-auto mb-3 h-8 w-8" />
                Sélectionnez un message pour le lire.
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
                <button type="button" className="btn btn-ghost px-2 lg:hidden" onClick={() => setOpenId(null)} aria-label="Retour à la liste">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <a className="btn btn-accent py-1.5 text-sm" href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject || 'votre message'}`)}`}>
                  <Reply className="h-4 w-4" />
                  Répondre
                </a>
                <button type="button" className="btn btn-secondary py-1.5 text-sm" onClick={() => setRead(open, !open.read)}>
                  {open.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  {open.read ? 'Marquer non lu' : 'Marquer lu'}
                </button>
                <button type="button" className="btn btn-ghost ml-auto py-1.5 text-sm text-danger" onClick={() => remove(open)}>
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
              <article className="flex-1 overflow-y-auto p-6">
                <h2 className="text-xl font-semibold">{open.subject || '(sans objet)'}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft font-semibold text-accent">
                    {open.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium">{open.name}</p>
                    <p className="text-muted">
                      {open.email} ·{' '}
                      {new Date(open.createdAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <p className="mt-6 whitespace-pre-line leading-relaxed">{open.message}</p>
              </article>
            </>
          )}
        </div>
      </div>
    </>
  );
};
