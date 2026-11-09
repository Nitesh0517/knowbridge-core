import React, { useState } from 'react';
import { ListTodo, AlertTriangle, User, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import EvidenceModal from '../components/EvidenceModal';

export default function Tasks() {
  const { reconstruction } = useProject();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const tasks = reconstruction?.unfinishedWork || [];

  const unassignedCount = tasks.filter(t => t.ownership_status === 'unassigned' || t.assigned_to === 'Insufficient Evidence').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <ListTodo className="w-3.5 h-3.5" />
          <span>Archaeological Deliverables</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Tasks & Ownership Matrix</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Active unfinished features, delayed deliverables, and ownership gap analysis.
        </p>
      </div>

      {/* Warning banner for ownership gaps */}
      {unassignedCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-soft-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Ownership Risk Detected: {unassignedCount} Deliverables Lack Confirmed Assignees</strong>
            <span>Incoming team members must claim or reassign these items to prevent delivery stall after lead departure.</span>
          </div>
        </div>
      )}

      {/* Tasks Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  task.priority === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {task.priority || 'High'}
                </span>
                <span className="text-xs font-mono text-slate-400">Effort: {task.estimated_effort || '2-4 days'}</span>
              </div>

              <h3 className="text-sm font-bold text-navy-950">{task.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Assignee:</span>
                <span className={`font-semibold ${
                  task.ownership_status === 'unassigned' || task.assigned_to === 'Insufficient Evidence'
                    ? 'text-rose-600 font-bold'
                    : 'text-slate-800'
                }`}>
                  {task.assigned_to || 'Unassigned'}
                </span>
              </div>

              <button
                onClick={() => setSelectedClaim({
                  claimId: `CLM-${task.id}`,
                  claimText: task.title,
                  claimCategory: 'unfinished_work',
                  sourceName: task.source_name,
                  documentReference: 'Task Log',
                  relevantExcerpt: task.evidence_excerpt,
                  confidenceScore: 0.90,
                  verificationStatus: 'unverified'
                })}
                className="text-cyanBrand-600 hover:text-cyanBrand-700 font-bold text-xs flex items-center gap-1"
              >
                <span>Evidence</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedClaim && (
        <EvidenceModal
          claim={selectedClaim}
          isOpen={Boolean(selectedClaim)}
          onClose={() => setSelectedClaim(null)}
          onVerified={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
}
