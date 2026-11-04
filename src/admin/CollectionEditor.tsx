import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { newId } from '../../shared/utils';

/**
 * Éditeur générique de liste (projets, certifications, parcours…) :
 * ajouter, modifier, réordonner et supprimer des éléments.
 */
export function CollectionEditor<T extends { id: string }>({
  items,
  onChange,
  itemTitle,
  itemSubtitle,
  createItem,
  renderForm,
  addLabel,
  emptyText
}: {
  items: T[];
  onChange: (items: T[]) => void;
  itemTitle: (item: T) => string;
  itemSubtitle?: (item: T) => string;
  createItem: (id: string) => T;
  renderForm: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
  emptyText: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<T>) => onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const [it] = next.splice(index, 1);
    next.splice(index + dir, 0, it);
    onChange(next);
  };
  const remove = (item: T) => {
    if (window.confirm(`Supprimer « ${itemTitle(item) || 'cet élément'} » ?`)) {
      onChange(items.filter((it) => it.id !== item.id));
    }
  };
  const add = () => {
    const item = createItem(newId());
    onChange([...items, item]);
    setOpenId(item.id);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line p-6 text-center text-muted">{emptyText}</p>}
      {items.map((item, i) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className={`card transition-colors ${open ? 'border-line-strong' : ''}`}>
            <div className="flex items-center gap-2 p-3 pl-4">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{itemTitle(item) || 'Sans titre'}</span>
                  {itemSubtitle && <span className="block truncate text-sm text-muted">{itemSubtitle(item)}</span>}
                </span>
              </button>
              <div className="flex shrink-0 items-center">
                <button type="button" className="btn-ghost rounded-md p-2 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Monter">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="btn-ghost rounded-md p-2 disabled:opacity-30"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Descendre"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className="rounded-md p-2 text-danger hover:bg-sunken" onClick={() => remove(item)} aria-label="Supprimer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {open && (
              <div key={item.id} className="space-y-5 border-t border-line p-4 sm:p-6">
                {renderForm(item, (patch) => update(item.id, patch))}
              </div>
            )}
          </div>
        );
      })}
      <button type="button" className="btn btn-secondary" onClick={add}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}
