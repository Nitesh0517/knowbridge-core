import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function HealthScoreBadge({ score = 80, size = 'md', showLabel = true }) {
  let color = 'emerald';
  let Icon = ShieldCheck;
  let statusText = 'Optimal Continuity';

  if (score < 60) {
    color = 'rose';
    Icon = AlertCircle;
    statusText = 'Critical Risk of Loss';
  } else if (score < 80) {
    color = 'amber';
    Icon = AlertTriangle;
    statusText = 'Moderate Coverage';
  }

  const styles = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-emerald-600 text-white',
      ring: 'stroke-emerald-500'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'bg-amber-500 text-white',
      ring: 'stroke-amber-500'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'bg-rose-600 text-white',
      ring: 'stroke-rose-500'
    }
  }[color];

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.bg}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{score}% Health</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${styles.bg} shadow-soft-sm`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${styles.badge} shadow-sm`}>
        {score}%
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-bold leading-tight">Knowledge Retention Health</span>
          <span className="text-[11px] opacity-80">{statusText}</span>
        </div>
      )}
    </div>
  );
}
