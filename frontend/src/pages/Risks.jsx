import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, GitFork, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import EvidenceModal from '../components/EvidenceModal';

export default function Risks() {
  const { reconstruction } = useProject();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const risks = reconstruction?.risks || [];
  const dependencies = reconstruction?.dependencies || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Risk Assessment & Dependencies</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Transition Risks & Blockers</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Surfacing tacit vulnerabilities, single-points-of-failure, and blocked upstream dependencies.
        </p>
      </div>

      {/* Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  risk.severity === 'high' || risk.severity === 'critical'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {risk.severity || 'Critical'} Severity
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase">Probability: {risk.probability}</span>
              </div>

              <h3 className="text-sm font-bold text-navy-950">{risk.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                <strong>Mitigation Plan:</strong> {risk.mitigation}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedClaim({
                    claimId: `CLM-${risk.id}`,
                    claimText: risk.title,
                    claimCategory: 'risk',
                    sourceName: risk.source_name,
                    documentReference: 'Risk Audit',
                    relevantExcerpt: risk.evidence_excerpt,
                    confidenceScore: 0.92,
                    verificationStatus: 'unverified'
                  })}
                  className="text-cyanBrand-600 hover:text-cyanBrand-700 font-bold text-xs flex items-center gap-1"
                >
                  <span>View Evidence Quote</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dependencies Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
          <GitFork className="w-4 h-4 text-royal-600" />
          <span>Active Technical & Task Dependencies</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {dependencies.map((dep, i) => (
            <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    dep.is_blocked ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {dep.is_blocked ? 'BLOCKED' : 'Dependency'}
                  </span>
                  <strong className="text-slate-900">{dep.dependent_item}</strong>
                </div>
                <div className="text-slate-500">
                  Prerequisite: <strong className="text-royal-600">{dep.depends_on}</strong>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 self-start sm:self-auto">
                {dep.type || 'technical_dependency'}
              </span>
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
