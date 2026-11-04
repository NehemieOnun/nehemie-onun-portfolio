import type React from 'react';
import { useEffect, useRef, useState } from 'react';

/** Ajoute la classe « is-visible » quand l'élément entre à l'écran (animation .reveal). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      // Déclenchement anticipé : l'élément apparaît avant d'entrer à l'écran
      { rootMargin: '0px 0px 15% 0px', threshold: 0 }
    );
    el.querySelectorAll('.reveal').forEach((n) => io.observe(n));
    if (el.classList.contains('reveal')) io.observe(el);
    return () => io.disconnect();
  });
  return ref;
}

/** Halo lumineux qui suit la souris sur les cartes .card-spotlight. */
export function spotlight(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/** Heure locale d'un fuseau, mise à jour chaque minute. */
export function useClock(timeZone: string) {
  const fmt = () =>
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 20_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
