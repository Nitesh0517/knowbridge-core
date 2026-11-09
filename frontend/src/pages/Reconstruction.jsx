import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Milestone,
  ListTodo,
  Users,
  GitFork,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
  Zap,
  Info
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { reconstructionApi } from '../services/api';
import HealthScoreBadge from '../components/HealthScoreBadge';
import EvidenceModal from '../components/EvidenceModal';

export default function Reconstruction() {
  const { activeProject, reconstruction, setReconstruction, refreshActiveProject } = useProject();
  const [activeTab, setActiveTab] = useState('summary');
  const [running, setRunning] = useState(false);
  const [targetRole, setTargetRole] = useState('Incoming Lead Architect');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRunReconstruction = async () => {
    if (!activeProject?.id) return;
    setRunning(true);
    try {
      const res = await reconstructionApi.trigger({
        projectId: activeProject.id,
        targetRole,
        departingMember: 'Marcus Chen (Lead Architect)'
      });
      if (res.data.success) {
        setReconstruction(res.data.data);
        await refreshActiveProject();
      }
    } catch (err) {
      alert('Reconstruction failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setRunning(false);
    }
  };

  const decisions = reconstruction?.decisions || [];
  const tasks = reconstruction?.unfinishedWork || [];
  const ownership = reconstruction?.ownership || [];
  const dependencies = reconstruction?.dependencies || [];
  const risks = reconstruction?.risks || [];
  const nextActions = reconstruction?.nextActions || [];
  const questions = reconstruction?.unresolvedQuestions || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-royal-800 text-white relative overflow-hidden shadow-soft-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyanBrand-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Stage 02: AI Project State Reconstruction</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Knowledge Reconstruction Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Powered by Google Gemini 2.5 Flash and dedicated multi-source NLP parsers.
              Strictly grounded: extracts verifiable decisions, responsibilities, blockers, and tags unconfirmed claims as <strong>"Insufficient Evidence"</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
            <HealthScoreBadge score={reconstruction?.healthScore || 84} />

            <div className="flex items-center gap-2">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="px-3 py-2 bg-navy-850 border border-navy-700 rounded-xl text-xs text-white focus:outline-none"
              >
                <option>Incoming Lead Architect</option>
                <option>Frontend Engineer</option>
                <option>Backend Infrastructure Lead</option>
                <option>Project Manager / Scrum Master</option>
                <option>DevOps / SRE Engineer</option>
              </select>

              <button
                onClick={handleRunReconstruction}
                disabled={running}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyanBrand-500 to-royal-600 hover:from-cyanBrand-400 hover:to-royal-500 text-white font-bold text-xs shadow-soft-md hover:shadow-glow-cyan transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
                <span>{running ? 'Reconstructing...' : 'Execute Reconstruction'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-soft-sm">
        {[
          { id: 'summary', name: 'Executive State Summary', count: null },
          { id: 'decisions', name: 'Decisions (ADRs)', count: decisions.length },
          { id: 'tasks', name: 'Unfinished Work', count: tasks.length },
          { id: 'ownership', name: 'Ownership & Gaps', count: ownership.length },
          { id: 'dependencies', name: 'Dependencies', count: dependencies.length },
          { id: 'risks', name: 'Risks & Blockers', count: risks.length },
          { id: 'next_actions', name: 'Next Actions', count: nextActions.length },
          { id: 'questions', name: 'Unresolved Questions', count: questions.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-navy-900 text-white shadow-soft-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>{tab.name}</span>
            {tab.count !== null && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-navy-800 text-cyanBrand-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: EXECUTIVE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-cyanBrand-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Synthesized Project Reality</span>
              </div>
              <h2 className="text-xl font-bold text-navy-950">
                Current State Assessment: {activeProject ? activeProject.name : 'Apex Cloud Migration'}
              </h2>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed font-medium">
                {reconstruction?.summary || 'Reconstructed project state across connected documents and repositories. Critical architectural choices, active deliverables, and transition single-points-of-failure have been cataloged with verifiable quote references.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Health Score</span>
                <span className="text-2xl font-black text-emerald-600">{reconstruction?.healthScore || 84}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Transition Ready</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Architectural ADRs</span>
                <span className="text-2xl font-black text-purple-600">{decisions.length}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Evidence Grounded</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Unfinished Tasks</span>
                <span className="text-2xl font-black text-amber-600">{tasks.length}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{tasks.filter(t => t.ownership_status === 'unassigned').length} unassigned</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Identified Risks</span>
                <span className="text-2xl font-black text-rose-600">{risks.length}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Active Mitigations</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyanBrand-50 border border-cyanBrand-200 text-xs text-cyanBrand-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyanBrand-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Engine Grounding Guarantee:</strong> KnowBridge AI will never extrapolate or hallucinate unrecorded requirements. Where information is missing or contradictory in the sources, items are explicitly marked with <em>"Insufficient Evidence"</em> to protect incoming engineers from false assumptions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DECISIONS (ADRs) */}
      {activeTab === 'decisions' && (
        <div className="space-y-4">
          {decisions.map((dec, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4 hover:border-purple-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {dec.id}
                  </span>
                  <h3 className="text-base font-bold text-navy-950">{dec.title}</h3>
                </div>

                <button
                  onClick={() => setSelectedClaim({
                    claimId: `CLM-${dec.id}`,
                    claimText: dec.decision,
                    claimCategory: 'decision',
                    sourceName: dec.source_name,
                    documentReference: dec.section_or_page,
                    relevantExcerpt: dec.evidence_excerpt,
                    confidenceScore: dec.confidence || 0.92,
                    verificationStatus: 'verified'
                  })}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-cyanBrand-50 text-cyanBrand-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Source Excerpt</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-800 font-medium">
                <strong>Decision:</strong> {dec.decision}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Decider</span>
                  <span className={`font-semibold ${dec.decider === 'Insufficient Evidence' ? 'text-amber-600' : 'text-slate-800'}`}>
                    {dec.decider}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date Recorded</span>
                  <span className={`font-semibold ${dec.date === 'Insufficient Evidence' ? 'text-amber-600' : 'text-slate-800'}`}>
                    {dec.date}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Alternatives Considered</span>
                  <span className="font-semibold text-slate-800">
                    {Array.isArray(dec.alternatives_considered) ? dec.alternatives_considered.join(', ') : 'None recorded'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <strong>Why / Recorded Rationale:</strong> {dec.why}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: UNFINISHED WORK */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {task.priority || 'High'} Priority
                  </span>
                  <h3 className="text-sm font-bold text-navy-950">{task.title}</h3>
                </div>

                <span className="text-xs font-mono text-slate-400">Effort: {task.estimated_effort || '2-4 days'}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Current Assignee:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    task.ownership_status === 'unassigned' || task.assigned_to === 'Insufficient Evidence'
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                      : 'bg-slate-100 text-slate-800'
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
                  <span>View Evidence Quote</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: OWNERSHIP & GAPS */}
      {activeTab === 'ownership' && (
        <div className="space-y-4">
          {ownership.map((own, i) => (
            <div key={i} className={`p-6 rounded-3xl bg-white border shadow-soft-sm space-y-3 ${
              own.ownership_gap ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200/80'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-navy-950">{own.role_or_domain}</h3>
                  {own.ownership_gap && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Ownership Gap Detected</span>
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-500 font-semibold">
                  Handover Target: <strong className="text-royal-600">{own.handover_to}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Maintainer</span>
                  <span className="font-semibold text-slate-800">{own.current_owner}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Key Contacts</span>
                  <span className="font-semibold text-slate-800">
                    {Array.isArray(own.key_contacts) ? own.key_contacts.join(', ') : 'Engineering Lead'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Responsibilities:</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                  {(own.responsibilities || []).map((resp, ri) => (
                    <li key={ri}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: DEPENDENCIES */}
      {activeTab === 'dependencies' && (
        <div className="space-y-4">
          {dependencies.map((dep, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    dep.is_blocked ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {dep.is_blocked ? 'BLOCKED' : 'Active Dependency'}
                  </span>
                  <h4 className="text-xs font-bold text-navy-950">{dep.dependent_item}</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Depends on: <strong className="text-royal-600">{dep.depends_on}</strong>
                </p>
                {dep.blocker_details && (
                  <p className="text-[11px] text-rose-700 font-medium">Blocker: {dep.blocker_details}</p>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded border border-slate-200">
                {dep.type || 'technical_dependency'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: RISKS */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          {risks.map((risk, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    risk.severity === 'high' || risk.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {risk.severity || 'High'} Severity
                  </span>
                  <h3 className="text-sm font-bold text-navy-950">{risk.title}</h3>
                </div>

                <span className="text-xs font-semibold text-slate-400 uppercase">Probability: {risk.probability}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                <strong>Mitigation Strategy:</strong> {risk.mitigation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: NEXT ACTIONS */}
      {activeTab === 'next_actions' && (
        <div className="space-y-4">
          {nextActions.map((act, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-royal-50 text-royal-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-royal-100 text-royal-800 px-2 py-0.5 rounded font-bold">
                    {act.timeline_phase || 'Day 1-30'}
                  </span>
                  <h4 className="text-xs font-bold text-navy-950">{act.action}</h4>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                  <span>Priority: <strong className="uppercase text-royal-600">{act.priority}</strong></span>
                  <span>•</span>
                  <span>Target Role: <strong>{act.target_role}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: UNRESOLVED QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Audit Flag:</strong> The following items have missing or conflicting source records. In compliance with KnowBridge core principles, they are flagged as <em>"Insufficient Evidence"</em> to prevent unsupported assumptions during onboarding.
          </div>

          {questions.map((q, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    INSUFFICIENT EVIDENCE
                  </span>
                  <h3 className="text-sm font-bold text-navy-950">{q.question}</h3>
                </div>

                <span className="text-[10px] font-mono text-slate-400">{q.reason}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Continuity Impact</span>
                  <span className="text-slate-700">{q.impact}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Suggested Clarification Action</span>
                  <span className="text-royal-700 font-medium">{q.suggested_action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evidence Modal Viewer */}
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
