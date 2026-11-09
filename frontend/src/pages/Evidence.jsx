import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Flag,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { evidenceApi } from '../services/api';
import EvidenceModal from '../components/EvidenceModal';

export default function Evidence() {
  const { activeProject } = useProject();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    loadClaims();
  }, [activeProject?.id, categoryFilter, statusFilter, search]);

  const loadClaims = async () => {
    if (!activeProject?.id) return;
    try {
      const res = await evidenceApi.getClaims({
        projectId: activeProject.id,
        category: categoryFilter,
        status: statusFilter,
        search: search || undefined
      });
      if (res.data.success) {
        setClaims(res.data.data || []);
      }
    } catch (err) {
      console.warn('Could not load claims:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'decision': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'unfinished_work': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'risk': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'dependency': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ownership': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          text: 'Verified Claim'
        };
      case 'flagged':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: Flag,
          text: 'Flagged Uncertainty'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: ShieldCheck,
          text: 'Unverified'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Stage 03: Grounding & Traceability</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Evidence-Linked Knowledge System</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Auditable proof engine. Every statement is directly referenced to raw document passages, meeting minutes, or commit logs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search statements, quotes, sources, or claim IDs..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="decision">Decisions</option>
            <option value="unfinished_work">Unfinished Work</option>
            <option value="risk">Risks</option>
            <option value="dependency">Dependencies</option>
            <option value="ownership">Ownership</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
            <option value="flagged">Flagged Uncertainty</option>
          </select>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Evidence Claims Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Execute Knowledge Reconstruction on your project sources to populate verified evidence claims.
            </p>
          </div>
        ) : (
          claims.map((claim) => {
            const statusConfig = getStatusBadge(claim.verificationStatus);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={claim.id || claim._id || claim.claimId}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4 hover:border-cyanBrand-400 transition-all"
              >
                {/* Top Row: Claim ID, Category, Confidence, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {claim.claimId}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(claim.claimCategory)}`}>
                      {claim.claimCategory}
                    </span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                      {Math.round((claim.confidenceScore || 0.90) * 100)}% Confidence
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${statusConfig.bg}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.text}</span>
                    </span>

                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="px-3 py-1 rounded-xl bg-slate-50 hover:bg-cyanBrand-50 text-cyanBrand-700 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Audit & Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Statement */}
                <div className="text-sm font-bold text-navy-950">
                  "{claim.claimText}"
                </div>

                {/* Verbatim Excerpt Grounding */}
                <div className="p-3.5 bg-navy-950 text-cyanBrand-300 font-mono text-xs rounded-xl border border-navy-800 leading-relaxed shadow-inner">
                  <span className="text-slate-500 select-none">"</span>
                  {claim.relevantExcerpt || claim.evidenceExcerpt || 'No raw excerpt recorded.'}
                  <span className="text-slate-500 select-none">"</span>
                </div>

                {/* Source & Reference Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-royal-600" />
                    <span>Source: <strong className="text-slate-800">{claim.sourceName}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-cyanBrand-600">{claim.documentReference || claim.pageOrSection}</span>
                  </div>

                  {claim.lastVerifiedDate && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Verified: {claim.lastVerifiedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Evidence Verification Modal */}
      {selectedClaim && (
        <EvidenceModal
          claim={selectedClaim}
          isOpen={Boolean(selectedClaim)}
          onClose={() => setSelectedClaim(null)}
          onVerified={() => {
            loadClaims();
            setSelectedClaim(null);
          }}
        />
      )}
    </div>
  );
}
