import React, { useMemo, useRef, useState } from 'react';

/**
 * Petits graphiques SVG sans dépendance : courbes (avec ligne de repère + infobulle),
 * barres et mini-courbes. Couleurs validées (contraste et daltonisme) : --c-chart-1 / --c-chart-2.
 */

export interface Series {
  key: string;
  label: string;
  color: string;
  /** Trait en pointillés (sans remplissage) : distingue la série sans dépendre de la couleur. */
  dashed?: boolean;
}

const fmtDay = (d: string, long = false) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('fr-FR', long ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });

function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(600);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export const Legend: React.FC<{ series: Series[] }> = ({ series }) => (
  <ul className="flex flex-wrap gap-4 text-sm text-muted">
    {series.map((s) => (
      <li key={s.key} className="flex items-center gap-2">
        {s.dashed ? (
          <svg width="18" height="6" aria-hidden="true">
            <line x1="1" y1="3" x2="17" y2="3" stroke={s.color} strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
          </svg>
        ) : (
          <span className="h-2 w-4 rounded-full" style={{ background: s.color }} />
        )}
        {s.label}
      </li>
    ))}
  </ul>
);

// --------------------------------------------------------------- Courbes
export const AreaChart: React.FC<{
  data: Record<string, number | string>[];
  series: Series[];
  height?: number;
  xKey?: string;
}> = ({ data, series, height = 260, xKey = 'day' }) => {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 12, right: 12, bottom: 28, left: 36 };
  const w = Math.max(width, 280);
  const iw = w - pad.left - pad.right;
  const ih = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0))));
  const x = (i: number) => pad.left + (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => pad.top + ih - (v / max) * ih;
  const ticks = [0, max / 2, max];
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(iw / 70)));

  const paths = useMemo(
    () =>
      series.map((s) => {
        const pts = data.map((d, i) => [x(i), y(Number(d[s.key]) || 0)] as const);
        const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
        const area = `${line}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`;
        return { s, line, area };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, series, w, height, max]
  );

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(rel * (data.length - 1)))));
  };

  const h = hover !== null ? data[hover] : null;

  return (
    <div ref={ref} className="relative">
      <svg width={w} height={height} role="img" aria-label={`Graphique : ${series.map((s) => s.label).join(', ')}`}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={w - pad.right} y1={y(t)} y2={y(t)} stroke="var(--c-line)" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--c-muted)" fontFamily="var(--font-mono)">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          (i % labelEvery === 0 && data.length - 1 - i >= labelEvery / 2) || i === data.length - 1 ? (
            <text key={i} x={x(i)} y={height - 8} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fontSize="11" fill="var(--c-muted)">
              {fmtDay(String(d[xKey]))}
            </text>
          ) : null
        )}
        {paths.map(({ s, area }) => (s.dashed ? null : <path key={`a-${s.key}`} d={area} fill={`url(#grad-${s.key})`} />))}
        {paths.map(({ s, line }) => (
          <path
            key={`l-${s.key}`}
            d={line}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={s.dashed ? '6 5' : undefined}
          />
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + ih} stroke="var(--c-line-strong)" />
            {series.map((s) => (
              <circle key={s.key} cx={x(hover)} cy={y(Number(data[hover][s.key]) || 0)} r="4.5" fill={s.color} stroke="var(--c-surface)" strokeWidth="2" />
            ))}
          </g>
        )}
        <rect
          x={pad.left}
          y={pad.top}
          width={iw}
          height={ih}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-36 rounded-xl border border-line-strong bg-surface/95 px-3 py-2 text-sm shadow-xl backdrop-blur"
          style={{ left: Math.min(Math.max(x(hover) - 72, 0), w - 160) }}
        >
          <p className="text-xs text-muted">{fmtDay(String(h[xKey]), true)}</p>
          {series.map((s) => (
            <p key={s.key} className="mt-1 flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-mono font-semibold">{h[s.key]}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------------------- Barres
export const BarChart: React.FC<{ data: { label: string; value: number }[]; color: string; height?: number; name: string }> = ({
  data,
  color,
  height = 160,
  name
}) => {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 8, bottom: 22, left: 4, right: 4 };
  const w = Math.max(width, 200);
  const ih = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const slot = (w - pad.left - pad.right) / Math.max(1, data.length);
  const bw = Math.max(2, Math.min(18, slot - 2));
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(w / 70)));

  return (
    <div ref={ref} className="relative">
      <svg width={w} height={height} role="img" aria-label={name}>
        <line x1={pad.left} x2={w - pad.right} y1={pad.top + ih} y2={pad.top + ih} stroke="var(--c-line)" />
        {data.map((d, i) => {
          const bh = d.value ? Math.max(3, (d.value / max) * ih) : 0;
          const bx = pad.left + i * slot + (slot - bw) / 2;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.left + i * slot} y={pad.top} width={slot} height={ih} fill="transparent" />
              {bh > 0 && (
                <path
                  d={`M${bx},${pad.top + ih}V${pad.top + ih - bh + 3}q0,-3 3,-3h${bw - 6}q3,0 3,3V${pad.top + ih}Z`}
                  fill={color}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              )}
              {((i % labelEvery === 0 && data.length - 1 - i >= labelEvery / 2) || i === data.length - 1) && (
                <text
                  x={i === 0 ? pad.left : i === data.length - 1 ? w - pad.right : bx + bw / 2}
                  y={height - 6}
                  textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
                  fontSize="11"
                  fill="var(--c-muted)"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 rounded-lg border border-line-strong bg-surface/95 px-2.5 py-1.5 text-xs shadow-lg"
          style={{ left: Math.min(Math.max(pad.left + hover * slot - 40, 0), w - 110) }}
        >
          <span className="text-muted">{data[hover].label} : </span>
          <span className="font-mono font-semibold">{data[hover].value}</span>
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------------------- Mini-courbe
export const Sparkline: React.FC<{ values: number[]; color: string; width?: number; height?: number; dashed?: boolean }> = ({
  values,
  color,
  width = 110,
  height = 34,
  dashed
}) => {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * width).toFixed(1)},${(height - 3 - (v / max) * (height - 6)).toFixed(1)}`);
  return (
    <svg width={width} height={height} aria-hidden="true">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={dashed ? '4 3' : undefined}
      />
    </svg>
  );
};
