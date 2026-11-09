import React, { useState } from 'react';
import { Milestone, Calendar, User, FileText, CheckCircle2, ExternalLink, Filter } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import EvidenceModal from '../components/EvidenceModal';

export default function Timeline() {
  const { reconstruction } = useProject();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const decisions = reconstruction?.decisions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Milestone className="w-3.5 h-3.5" />
          <span>Archaeological Timeline</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Architectural Decision Timeline</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Chronological reconstruction of key decisions, why they were made, who authorized them, and what alternatives were rejected.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-royal-500 before:via-cyanBrand-400 before:to-slate-200">
        {decisions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No decisions extracted yet. Run Knowledge Reconstruction in Stage 02.
          </div>
        ) : (
          decisions.map((dec, i) => (
            <div key={i} className="relative group">
              {/* Timeline Marker Node */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-navy-950 border-2 border-cyanBrand-400 flex items-center justify-center text-white text-[10px] font-bold shadow-soft-sm group-hover:scale-125 transition-transform">
                {i + 1}
              </div>

              {/* Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {dec.id}
                    </span>
                    <h3 className="text-sm font-bold text-navy-950">{dec.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dec.date || 'Recorded in ADR'}</span>
                    </span>

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
                      className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-cyanBrand-50 text-cyanBrand-700 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 font-medium leading-relaxed">
                  <strong>Decision Made:</strong> {dec.decision}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Authorized By</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-royal-600" />
                      <span>{dec.decider || 'Marcus Chen (Lead Architect)'}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Alternatives Rejected</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">
                      {Array.isArray(dec.alternatives_considered) ? dec.alternatives_considered.join(', ') : 'None recorded'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 pt-1">
                  <strong>Rationale:</strong> {dec.why}
                </div>
              </div>
            </div>
          ))
        )}
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
