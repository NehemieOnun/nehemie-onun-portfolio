import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal } from 'lucide-react';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INIT_SYSTEM_CORE...');

  useEffect(() => {
    const statuses = [
      'INIT_SYSTEM_CORE...',
      'LOADING_GEOMETRY_ENGINE...',
      'CONNECTING_LUBUMBASHI_NODE...',
      'OPTIMIZING_PORTFOLIO_ASSETS...',
      'SYSTEM_READY'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        const next = prev + 12;
        const statusIdx = Math.min(Math.floor((next / 100) * statuses.length), statuses.length - 1);
        setStatusText(statuses[statusIdx]);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white select-none">
      <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-mono text-2xl font-extrabold shadow-2xl shadow-blue-500/30 mb-8 animate-pulse">
        NOK
      </div>

      <div className="w-64 sm:w-80 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-blue-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 animate-spin" />
            {statusText}
          </span>
          <span className="text-slate-400 font-bold">{progress}%</span>
        </div>

        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="absolute bottom-10 text-[11px] font-mono text-slate-500">
        NÉHÉMIE ONUN KAMBONGH • FULL STACK PORTFOLIO
      </div>
    </div>
  );
};
