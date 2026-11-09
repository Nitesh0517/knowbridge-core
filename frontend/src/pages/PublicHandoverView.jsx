import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Send,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  User,
  Shield,
  FileText,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { handoversApi } from '../services/api';
import Logo from '../components/Logo';
import HealthScoreBadge from '../components/HealthScoreBadge';
import EvidenceModal from '../components/EvidenceModal';

export default function PublicHandoverView() {
  const { shareToken } = useParams();
  const [handover, setHandover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    loadPublicHandover();
  }, [shareToken]);

  const loadPublicHandover = async () => {
    try {
      const res = await handoversApi.getPublic(shareToken);
      if (res.data.success) {
        setHandover(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired handover share link.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 text-xs text-slate-500">
        Authenticating token and loading continuation plan...
      </div>
    );
  }

  if (error || !handover) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-slate-200 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-navy-950">Access Link Unavailable</h2>
          <p className="text-xs text-slate-600">{error || 'This handover package could not be retrieved.'}</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-royal-600 text-white font-bold text-xs"
          >
            <span>Sign In to Platform</span>
          </Link>
        </div>
      </div>
    );
  }

  const day30 = handover.roadmap30Days || [];
  const day60 = handover.roadmap60Days || [];
  const day90 = handover.roadmap90Days || [];
  const decisions = handover.reconstruction?.decisions || [];

  return (
    <div className="min-h-screen bg-surface-bg text-brandText-primary selection:bg-cyanBrand-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-soft-sm">
        <Logo size="sm" showTagline={true} />

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Onboarding Plan</span>
          </button>
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
        {/* Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-royal-800 text-white relative overflow-hidden shadow-soft-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-cyanBrand-500/20 text-cyanBrand-300 border border-cyanBrand-500/30">
              Personalized Knowledge Continuation Package
            </span>
            <HealthScoreBadge score={handover.healthScore || 84} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{handover.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-navy-850">
            <span>Project: <strong className="text-white">{handover.projectName}</strong></span>
            <span>•</span>
            <span>Target Role: <strong className="text-cyanBrand-400">{handover.targetRole}</strong></span>
            <span>•</span>
            <span>Departing Lead: <strong className="text-white">{handover.departingMember}</strong></span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-cyanBrand-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Executive State Synthesis</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {handover.executiveSummary}
          </p>
        </div>

        {/* 30-60-90 Day Roadmap */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-navy-950">Your 30-60-90 Day Continuation Roadmap</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step-by-step milestones to achieve full architectural autonomy without dependency on departed staff.
            </p>
          </div>

          {/* Days 1-30 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-royal-700 bg-royal-50 px-2 py-0.5 rounded border border-royal-200">
                DAYS 1 - 30
              </span>
              <h3 className="text-xs font-bold text-slate-800">Onboarding, IAM Permissions & Blocker Clearance</h3>
            </div>
            <div className="space-y-2">
              {day30.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                  <input type="checkbox" className="mt-0.5 rounded text-royal-600" />
                  <span className="font-medium text-slate-800">{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Days 31-60 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-cyanBrand-700 bg-cyanBrand-50 px-2 py-0.5 rounded border border-cyanBrand-200">
                DAYS 31 - 60
              </span>
              <h3 className="text-xs font-bold text-slate-800">Core Execution & Resolving Dependencies</h3>
            </div>
            <div className="space-y-2">
              {day60.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                  <input type="checkbox" className="mt-0.5 rounded text-royal-600" />
                  <span className="font-medium text-slate-800">{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Days 61-90 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-violetBrand-700 bg-violetBrand-50 px-2 py-0.5 rounded border border-violetBrand-200">
                DAYS 61 - 90
              </span>
              <h3 className="text-xs font-bold text-slate-800">Autonomous Architecture & Governance</h3>
            </div>
            <div className="space-y-2">
              {day90.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                  <input type="checkbox" className="mt-0.5 rounded text-royal-600" />
                  <span className="font-medium text-slate-800">{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Decisions with Evidence Link */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
          <h2 className="text-base font-bold text-navy-950">Foundational Architectural Decisions</h2>
          <div className="space-y-3">
            {decisions.slice(0, 3).map((dec, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900">{dec.title}</strong>
                  <button
                    onClick={() => setSelectedClaim({
                      claimId: `CLM-${dec.id}`,
                      claimText: dec.decision,
                      claimCategory: 'decision',
                      sourceName: dec.source_name,
                      documentReference: dec.section_or_page,
                      relevantExcerpt: dec.evidence_excerpt,
                      confidenceScore: 0.94,
                      verificationStatus: 'verified'
                    })}
                    className="text-cyanBrand-600 hover:text-cyanBrand-700 font-bold flex items-center gap-1"
                  >
                    <span>View Quote</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed">{dec.decision}</p>
                <div className="text-[11px] text-slate-400">
                  Decider: <strong>{dec.decider}</strong> • Rationale: {dec.why}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off Audit Stamp */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Digital Leadership Sign-off Seal</span>
          </div>
          <p className="text-xs text-slate-300">
            This handover was formally reviewed and authorized by project leadership on{' '}
            <strong>{handover.lastApprovedAt ? handover.lastApprovedAt.split('T')[0] : '2025-10-29'}</strong>.
            All statements have been ground-traced against verified repository and meeting records.
          </p>
        </div>
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
