import React, { useState } from 'react';
import { X, CheckCircle2, Flag, FileText, ExternalLink, Calendar, Shield, Sparkles } from 'lucide-react';
import { evidenceApi } from '../services/api';

export default function EvidenceModal({ claim, isOpen, onClose, onVerified }) {
  const [verifying, setVerifying] = useState(false);
  const [notes, setNotes] = useState(claim?.verifierNotes || '');

  if (!isOpen || !claim) return null;

  const handleVerify = async (status) => {
    setVerifying(true);
    try {
      const res = await evidenceApi.verify(claim.id || claim._id || claim.claimId, status, notes);
      if (res.data.success) {
        if (onVerified) onVerified(res.data.data);
        onClose();
      }
    } catch (err) {
      alert('Verification failed: ' + err.message);
    } finally {
      setVerifying(false);
    }
  };

  const categoryColors = {
    decision: 'bg-purple-50 text-purple-700 border-purple-200',
    unfinished_work: 'bg-amber-50 text-amber-700 border-amber-200',
    risk: 'bg-rose-50 text-rose-700 border-rose-200',
    dependency: 'bg-blue-50 text-blue-700 border-blue-200',
    ownership: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    next_action: 'bg-cyanBrand-50 text-cyanBrand-700 border-cyanBrand-200',
  }[claim.claimCategory] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyanBrand-500/20 text-cyanBrand-400 flex items-center justify-center border border-cyanBrand-400/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyanBrand-400 font-bold">{claim.claimId || 'CLAIM'}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${categoryColors}`}>
                  {claim.claimCategory || 'General Claim'}
                </span>
              </div>
              <h2 className="text-base font-bold mt-0.5 text-white">Source Traceability & Verification</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Claim statement */}
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Extracted Statement</span>
            <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm">
              "{claim.claimText}"
            </div>
          </div>

          {/* Supporting Source & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Supporting Source</span>
              <div className="flex items-center gap-2 mt-1 text-slate-800 font-bold truncate">
                <FileText className="w-4 h-4 text-royal-600 flex-shrink-0" />
                <span className="truncate">{claim.sourceName || 'Authorized Project Source'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Document Reference</span>
              <div className="mt-1 font-mono font-bold text-cyanBrand-600 truncate">
                {claim.documentReference || claim.pageOrSection || 'Section 1'}
              </div>
            </div>
          </div>

          {/* Grounded Verbatim Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyanBrand-500" />
                Verbatim Evidence Excerpt (From Raw Source)
              </span>
              <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Confidence: {Math.round((claim.confidenceScore || 0.92) * 100)}%
              </span>
            </div>
            <div className="p-4 bg-navy-950 text-cyanBrand-300 font-mono text-xs rounded-xl border border-navy-800 leading-relaxed shadow-inner">
              <span className="text-slate-500 select-none">"</span>
              {claim.relevantExcerpt || claim.evidenceExcerpt || 'No verbatim excerpt recorded.'}
              <span className="text-slate-500 select-none">"</span>
            </div>
          </div>

          {/* Verifier Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Human Verifier Notes / Audit Log</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified with outgoing architect Marcus on 28 Oct."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Status: <strong className="uppercase">{claim.verificationStatus || 'unverified'}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleVerify('flagged')}
                disabled={verifying}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold border border-amber-200 transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-amber-600" />
                <span>Flag Uncertainty</span>
              </button>

              <button
                type="button"
                onClick={() => handleVerify('verified')}
                disabled={verifying}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold shadow-soft-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Claim</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
