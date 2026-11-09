import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Database,
  Send,
  ListTodo,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  Sparkles,
  Milestone,
  CheckCircle2,
  Clock,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { analyticsApi, handoversApi } from '../services/api';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import StageIndicator from '../components/StageIndicator';
import HealthScoreBadge from '../components/HealthScoreBadge';
import EvidenceModal from '../components/EvidenceModal';

export default function Dashboard({ onCreateProjectClick }) {
  const { activeProject, reconstruction } = useProject();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentHandovers, setRecentHandovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [activeProject?.id]);

  const loadDashboardData = async () => {
    try {
      const statsRes = await analyticsApi.getStats();
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      const handoversRes = await handoversApi.getAll(activeProject?.id);
      if (handoversRes.data.success) {
        setRecentHandovers(handoversRes.data.data || []);
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Projects', value: stats?.totalProjects || 2, icon: FolderKanban, color: 'text-royal-600 bg-royal-50 border-royal-200' },
    { title: 'Connected Sources', value: stats?.totalSources || 3, icon: Database, color: 'text-cyanBrand-600 bg-cyanBrand-50 border-cyanBrand-200' },
    { title: 'Open Tasks', value: stats?.openTasks || 6, icon: ListTodo, color: 'text-amber-600 bg-amber-50 border-amber-200', subtitle: `${stats?.unassignedTasks || 2} unassigned` },
    { title: 'Unresolved Risks', value: stats?.unresolvedRisks || 3, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'Pending Handover', value: stats?.pendingHandovers || 1, icon: Send, color: 'text-violetBrand-600 bg-violetBrand-50 border-violetBrand-200' },
    { title: 'Approved Handovers', value: stats?.approvedHandovers || 1, icon: FileCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const decisions = reconstruction?.decisions || [];
  const tasks = reconstruction?.unfinishedWork || [];
  const risks = reconstruction?.risks || [];
  const dependencies = reconstruction?.dependencies || [];

  return (
    <div className="space-y-6">
      {/* 5-Stage Continuity Process Indicator */}
      <StageIndicator currentStage={3} />

      {/* Welcome Banner & Project State Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-royal-800 text-white relative overflow-hidden shadow-soft-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyanBrand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyanBrand-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KnowBridge AI Archaeological Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.displayName || 'Lead Architect'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoring active workspace for <strong>{activeProject ? activeProject.name : 'Apex Cloud Migration'}</strong>.
              All claims are linked to verbatim source excerpts to ensure uninterrupted project momentum.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
            <HealthScoreBadge score={reconstruction?.healthScore || stats?.averageHealthScore || 84} />
            <Link
              to="/dashboard/handover/generate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyanBrand-500 to-royal-600 hover:from-cyanBrand-400 hover:to-royal-500 text-white font-bold text-xs shadow-soft-md transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Generate Handover Plan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Enterprise Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 truncate">{stat.title}</span>
                <div className={`p-1.5 rounded-lg border ${stat.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-navy-950 tracking-tight">{stat.value}</div>
              {stat.subtitle && (
                <div className="text-[10px] text-amber-600 font-semibold mt-0.5 truncate">{stat.subtitle}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2-Column Grid: Left (Decisions & Tasks), Right (Risks & Handovers) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Decision Timeline Preview Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                  <Milestone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-950">Architectural Decision Log</h3>
                  <p className="text-[11px] text-slate-500">Historical ADR rationale and evidence-linked choices</p>
                </div>
              </div>
              <Link to="/dashboard/timeline" className="text-xs text-royal-600 hover:text-royal-700 font-bold flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {decisions.slice(0, 3).map((dec, i) => (
                <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold">
                        {dec.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-royal-600 transition-colors">
                        {dec.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {dec.decision}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>Decider: <strong>{dec.decider || 'Marcus Chen'}</strong></span>
                      <span>•</span>
                      <span>Date: {dec.date || 'Recorded in ADR'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedClaim({
                      claimId: `CLM-${dec.id}`,
                      claimText: dec.decision,
                      claimCategory: 'decision',
                      sourceName: dec.source_name,
                      documentReference: dec.section_or_page,
                      relevantExcerpt: dec.evidence_excerpt,
                      confidenceScore: dec.confidence || 0.94,
                      verificationStatus: 'verified'
                    })}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-cyanBrand-50 text-slate-600 hover:text-cyanBrand-700 text-[10px] font-bold border border-slate-200 flex items-center gap-1 transition-all"
                  >
                    <span>View Evidence</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks & Ownership Gaps */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-950">Active Deliverables & Ownership Gaps</h3>
                  <p className="text-[11px] text-slate-500">Unfinished tasks requiring incoming owner confirmation</p>
                </div>
              </div>
              <Link to="/dashboard/tasks" className="text-xs text-royal-600 hover:text-royal-700 font-bold flex items-center gap-1">
                <span>Task Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {tasks.slice(0, 3).map((task, i) => (
                <div key={i} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        task.priority === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {task.priority || 'High'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{task.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-slate-400">Current Assignee:</span>
                      <span className={`font-semibold ${
                        task.assigned_to === 'Insufficient Evidence' || task.ownership_status === 'unassigned'
                          ? 'text-rose-600 font-bold'
                          : 'text-slate-700'
                      }`}>
                        {task.assigned_to || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 pt-1">
                    {task.estimated_effort || '2-4 days'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Critical Risks & Bottlenecks */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-950">High-Priority Transition Risks</h3>
                  <p className="text-[11px] text-slate-500">Identified single-points-of-failure</p>
                </div>
              </div>
              <Link to="/dashboard/risks" className="text-xs text-royal-600 hover:text-royal-700 font-bold flex items-center gap-1">
                <span>Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {risks.slice(0, 2).map((risk, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 truncate">{risk.title}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                      {risk.severity || 'Critical'}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    {risk.description}
                  </p>
                  <div className="text-[10px] text-slate-600 pt-1 border-t border-rose-100">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Handover Continuation Packages */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyanBrand-50 text-cyanBrand-700 border border-cyanBrand-200 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-950">Active Handover Packages</h3>
                  <p className="text-[11px] text-slate-500">Role-based 30-60-90 day continuation roadmaps</p>
                </div>
              </div>
              <Link to="/dashboard/handovers" className="text-xs text-royal-600 hover:text-royal-700 font-bold flex items-center gap-1">
                <span>All Handovers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentHandovers.slice(0, 2).map((hnd, i) => (
                <div key={i} className="py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{hnd.title}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      hnd.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {hnd.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{hnd.executiveSummary}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Target: <strong>{hnd.targetRole}</strong></span>
                    <Link
                      to={`/dashboard/handovers/${hnd.id}`}
                      className="text-[11px] font-bold text-royal-600 hover:text-royal-700 flex items-center gap-1"
                    >
                      <span>Open Plan</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
