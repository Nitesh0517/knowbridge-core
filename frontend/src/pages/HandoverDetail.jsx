import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Send,
  Share2,
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
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { handoversApi } from '../services/api';
import HealthScoreBadge from '../components/HealthScoreBadge';
import EvidenceModal from '../components/EvidenceModal';

export default function HandoverDetail() {
  const { id } = useParams();
  const [handover, setHandover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [copied, setCopied] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    loadHandover();
  }, [id]);

  const loadHandover = async () => {
    try {
      const res = await handoversApi.getById(id);
      if (res.data.success) {
        setHandover(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load handover package:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!handover?.shareToken) return;
    const url = `${window.location.origin}/handover/view/${handover.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await handoversApi.updateStatus(id, 'approved', 'Signed off and verified by engineering leadership.');
      if (res.data.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setHandover(res.data.data);
      }
    } catch (err) {
      alert('Approval failed: ' + err.message);
    } finally {
      setApproving(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!handover) return;
    let md = `# ${handover.title}\n\n`;
    md += `Project: ${handover.projectName}\n`;
    md += `Target Role: ${handover.targetRole}\n`;
    md += `Departing Member: ${handover.departingMember}\n`;
    md += `Status: ${handover.status}\n`;
    md += `Knowledge Retention Health: ${handover.healthScore}%\n\n`;
    md += `## Executive State Summary\n${handover.executiveSummary}\n\n`;
    md += `## 30-Day Onboarding Roadmap\n`;
    (handover.roadmap30Days || []).forEach(t => {
      md += `- [ ] ${t.task} (${t.criticality || 'Normal'})\n`;
    });
    md += `\n## 60-Day Execution Roadmap\n`;
    (handover.roadmap60Days || []).forEach(t => {
      md += `- [ ] ${t.task} (${t.criticality || 'Normal'})\n`;
    });
    md += `\n## 90-Day Autonomy Roadmap\n`;
    (handover.roadmap90Days || []).forEach(t => {
      md += `- [ ] ${t.task} (${t.criticality || 'Normal'})\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Handover-${handover.id}.md`;
    link.click();
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading handover package...</div>;
  }

  if (!handover) {
    return <div className="p-12 text-center text-xs text-rose-600 font-bold">Handover package not found.</div>;
  }

  const day30 = handover.roadmap30Days || [];
  const day60 = handover.roadmap60Days || [];
  const day90 = handover.roadmap90Days || [];
  const decisions = handover.reconstruction?.decisions || [];
  const risks = handover.reconstruction?.risks || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/dashboard/handovers" className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1">
          ← Back to Packages
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-soft-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Share Link Copied!' : 'Copy Secure Share Link'}</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-soft-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-soft-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-royal-800 text-white relative overflow-hidden shadow-soft-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${
              handover.status === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {handover.status === 'approved' ? '✓ Approved Transition Package' : 'Status: Under Leadership Review'}
            </span>
          </div>

          <HealthScoreBadge score={handover.healthScore || 84} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{handover.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-navy-800">
          <span>Project: <strong className="text-white">{handover.projectName}</strong></span>
          <span>•</span>
          <span>Target Role: <strong className="text-cyanBrand-400">{handover.targetRole}</strong></span>
          <span>•</span>
          <span>Departing Member: <strong className="text-white">{handover.departingMember}</strong></span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-3">
        <div className="flex items-center gap-2 text-cyanBrand-600 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Executive State Synthesis</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {handover.executiveSummary}
        </p>
      </div>

      {/* 30-60-90 Day Continuation Roadmap */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-navy-950">30-60-90 Day Continuation Roadmap</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-tailored phased onboarding and delivery milestones for {handover.targetRole}.
          </p>
        </div>

        {/* Phase 1: Days 1-30 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="font-mono text-xs font-bold text-royal-700 bg-royal-50 px-2 py-0.5 rounded border border-royal-200">
              DAYS 1 - 30
            </span>
            <h3 className="text-xs font-bold text-slate-800">Onboarding, Environment Access & Immediate Blockers</h3>
          </div>
          <div className="space-y-2">
            {day30.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                <input type="checkbox" className="mt-0.5 rounded text-royal-600 focus:ring-royal-500" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-800">{item.task}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Criticality: <strong className="uppercase text-royal-600">{item.criticality || 'High'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2: Days 31-60 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="font-mono text-xs font-bold text-cyanBrand-700 bg-cyanBrand-50 px-2 py-0.5 rounded border border-cyanBrand-200">
              DAYS 31 - 60
            </span>
            <h3 className="text-xs font-bold text-slate-800">Core Execution & Resolving Flagged Dependencies</h3>
          </div>
          <div className="space-y-2">
            {day60.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                <input type="checkbox" className="mt-0.5 rounded text-royal-600 focus:ring-royal-500" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-800">{item.task}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 3: Days 61-90 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="font-mono text-xs font-bold text-violetBrand-700 bg-violetBrand-50 px-2 py-0.5 rounded border border-violetBrand-200">
              DAYS 61 - 90
            </span>
            <h3 className="text-xs font-bold text-slate-800">Autonomous Architecture & Long-Term Stability</h3>
          </div>
          <div className="space-y-2">
            {day90.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                <input type="checkbox" className="mt-0.5 rounded text-royal-600 focus:ring-royal-500" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-800">{item.task}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Human Review & Approvals Gate */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-950">4-Eye Human Sign-off Gate</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict governance requires departing lead and project management verification.
            </p>
          </div>

          {handover.status !== 'approved' && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-soft-sm transition-all"
            >
              {approving ? 'Signing off...' : '✓ Approve & Sign Off Handover'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(handover.reviewers || []).map((rev, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{rev.role || 'Reviewer'}</span>
              <strong className="text-slate-800 block">{rev.name}</strong>
              <div className="flex items-center gap-1.5 pt-1">
                {rev.status === 'approved' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Signed: {rev.signedAt ? rev.signedAt.split('T')[0] : 'Approved'}</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium text-[11px]">Awaiting Sign-off</span>
                )}
              </div>
            </div>
          ))}
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
