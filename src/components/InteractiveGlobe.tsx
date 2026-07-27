import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const InteractiveGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const size = 320;
    canvas.width = size;
    canvas.height = size;

    const radius = 120;
    const isDark = theme === 'dark';

    // Generate globe points on a sphere
    const points: { x: number; y: number; z: number; lat: number; lon: number }[] = [];
    const count = 380;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        lat: (phi * 180) / Math.PI - 90,
        lon: (theta * 180) / Math.PI,
      });
    }

    // Key Tech Hubs (Lubumbashi is highlighted!)
    const hubs = [
      { name: 'Lubumbashi (HQ)', lat: -11.68, lon: 27.48, primary: true },
      { name: 'Kinshasa', lat: -4.44, lon: 15.26, primary: false },
      { name: 'Paris', lat: 48.85, lon: 2.35, primary: false },
      { name: 'San Francisco', lat: 37.77, lon: -122.41, primary: false },
      { name: 'Tokyo', lat: 35.67, lon: 139.65, primary: false },
    ];

    let angleY = 0;
    let angleX = 0.2;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      angleY += 0.006;

      const cx = size / 2;
      const cy = size / 2;

      // Draw outer atmosphere aura
      const auraGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.25);
      auraGrad.addColorStop(0, isDark ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.08)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, size, size);

      // Rotate points
      const rotated = points.map((p) => {
        // Rotate Y
        let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);

        // Rotate X
        let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        return { x: x1, y: y2, z: z2 };
      });

      // Sort points by Z (depth)
      rotated.sort((a, b) => a.z - b.z);

      // Draw sphere dots
      rotated.forEach((p) => {
        const scale = 260 / (260 - p.z * 0.5);
        const px = cx + p.x * scale * 0.85;
        const py = cy + p.y * scale * 0.85;

        const alpha = Math.max(0.1, (p.z + radius) / (2 * radius));
        const dotRadius = Math.max(0.8, (p.z + radius) / (2 * radius) * 1.8);

        ctx.beginPath();
        ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.z > 0
          ? (isDark ? `rgba(99, 102, 241, ${alpha * 0.9})` : `rgba(37, 99, 235, ${alpha * 0.9})`)
          : (isDark ? `rgba(148, 163, 184, ${alpha * 0.3})` : `rgba(100, 116, 139, ${alpha * 0.3})`);
        ctx.fill();
      });

      // Draw Hubs & Pulsing Lubumbashi Marker
      hubs.forEach((hub) => {
        const radLat = (hub.lat * Math.PI) / 180;
        const radLon = (hub.lon * Math.PI) / 180;

        const hx = radius * Math.cos(radLat) * Math.sin(radLon);
        const hy = -radius * Math.sin(radLat);
        const hz = radius * Math.cos(radLat) * Math.cos(radLon);

        let x1 = hx * Math.cos(angleY) - hz * Math.sin(angleY);
        let z1 = hx * Math.sin(angleY) + hz * Math.cos(angleY);
        let y2 = hy * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = hy * Math.sin(angleX) + z1 * Math.cos(angleX);

        if (z2 > -20) {
          const scale = 260 / (260 - z2 * 0.5);
          const px = cx + x1 * scale * 0.85;
          const py = cy + y2 * scale * 0.85;

          ctx.beginPath();
          ctx.arc(px, py, hub.primary ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = hub.primary ? '#38BDF8' : '#7C3AED';
          ctx.shadowColor = hub.primary ? '#38BDF8' : '#7C3AED';
          ctx.shadowBlur = hub.primary ? 12 : 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (hub.primary) {
            ctx.beginPath();
            ctx.arc(px, py, 9 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label
            ctx.font = 'bold 11px system-ui, sans-serif';
            ctx.fillStyle = isDark ? '#F1F5F9' : '#0F172A';
            ctx.fillText('📍 Lubumbashi (RDC)', px + 10, py + 4);
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <div className="relative flex items-center justify-center p-2 rounded-2xl bg-slate-900/40 dark:bg-slate-900/60 border border-slate-800/60 backdrop-blur-md shadow-2xl">
      <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          HQ: Lubumbashi, RDC
        </span>
        <span className="text-slate-500">3D Global Node</span>
      </div>
    </div>
  );
};
