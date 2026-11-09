import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle2, XCircle, AlertTriangle, ChevronRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProject } from '../context/ProjectContext';
import { handoversApi } from '../services/api';

export default function Approvals() {
  const { activeProject } = useProject();
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadHandovers();
  }, [activeProject?.id]);

  const loadHandovers = async () => {
    if (!activeProject?.id) return;
    try {
      const res = await handoversApi.getAll(activeProject.id);
      if (res.data.success) {
        setHandovers(res.data.data || []);
      }
    } catch (err) {
      console.warn('Could not load handovers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionId(id);
    try {
      const comment = status === 'approved' ? 'Formally approved and signed off.' : 'Revision requested by leadership.';
      const res = await handoversApi.updateStatus(id, status, comment);
      if (res.data.success) {
        if (status === 'approved') {
          confetti({ particleCount: 70, spread: 60 });
        }
        await loadHandovers();
      }
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Stage 04: Human Review & Approval</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Approval & Verification Gate</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Empower engineering leads and project managers to audit, reject, edit, and digitally sign off on knowledge handovers.
        </p>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-4">
        {handovers.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No handover packages currently in the approval queue.
          </div>
        ) : (
          handovers.map((hnd) => (
            <div
              key={hnd.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      hnd.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {hnd.status}
                    </span>
                    <h3 className="text-base font-bold text-navy-950">{hnd.title}</h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    Target Role: <strong className="text-royal-600">{hnd.targetRole}</strong> • Health: <strong className="text-emerald-600">{hnd.healthScore}%</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Link
                    to={`/dashboard/handovers/${hnd.id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
                  >
                    Inspect Full Package
                  </Link>

                  {hnd.status !== 'approved' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(hnd.id, 'rejected')}
                        disabled={actionId === hnd.id}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                      >
                        Request Changes
                      </button>

                      <button
                        onClick={() => handleStatusChange(hnd.id, 'approved')}
                        disabled={actionId === hnd.id}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-soft-sm transition-all"
                      >
                        Sign Off & Approve
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl">
                {hnd.executiveSummary}
              </p>

              {/* Reviewers List */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="font-bold text-slate-700">Reviewers:</span>
                {(hnd.reviewers || []).map((rev, ri) => (
                  <span key={ri} className="flex items-center gap-1.5">
                    {rev.status === 'approved' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{rev.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
