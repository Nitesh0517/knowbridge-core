import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Cpu, CheckCircle2, FileEdit, Send } from 'lucide-react';

export default function StageIndicator({ currentStage = 1 }) {
  const location = useLocation();

  const stages = [
    { number: '01', name: 'Connect', icon: Database, path: '/dashboard/sources', desc: 'Ingest Documents & GitHub' },
    { number: '02', name: 'Reconstruct', icon: Cpu, path: '/dashboard/reconstruction', desc: 'AI State Synthesis' },
    { number: '03', name: 'Verify', icon: CheckCircle2, path: '/dashboard/evidence', desc: 'Trace Claims & Excerpts' },
    { number: '04', name: 'Review', icon: FileEdit, path: '/dashboard/approvals', desc: 'Human Approval Gate' },
    { number: '05', name: 'Handover', icon: Send, path: '/dashboard/handovers', desc: 'Role Continuation Plan' },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-soft-sm">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 px-1">
        <span className="uppercase tracking-wider">KnowBridge 5-Stage Continuity Engine</span>
        <span className="text-cyanBrand-600 font-mono text-[11px]">Pipeline Status: Active</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = location.pathname.startsWith(stage.path);
          const isPassed = (idx + 1) <= currentStage;

          return (
            <Link
              key={stage.number}
              to={stage.path}
              className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-200 border ${
                isActive
                  ? 'bg-navy-900 text-white border-navy-800 shadow-soft-md'
                  : 'bg-slate-50/80 text-slate-700 border-slate-100 hover:bg-slate-100/80 hover:border-slate-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                isActive
                  ? 'bg-gradient-to-br from-royal-500 to-cyanBrand-500 text-white'
                  : isPassed
                  ? 'bg-cyanBrand-50 text-cyanBrand-600 border border-cyanBrand-200'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {stage.number}
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {stage.name}
                </span>
                <span className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {stage.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
