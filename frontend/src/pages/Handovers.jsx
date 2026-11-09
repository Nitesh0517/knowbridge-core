import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Plus, ChevronRight, FileCheck, Shield, Clock, ExternalLink } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { handoversApi } from '../services/api';

export default function Handovers() {
  const { activeProject } = useProject();
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>Continuity Repository</span>
          </div>
          <h1 className="text-xl font-bold text-navy-950">Handover Packages</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-tailored continuation plans, onboarding roadmaps, and signed transition packages.
          </p>
        </div>

        <Link
          to="/dashboard/handover/generate"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white text-xs font-bold shadow-soft-sm hover:shadow-glow-royal transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Handover Package</span>
        </Link>
      </div>

      {/* Grid of Handovers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {handovers.length === 0 ? (
          <div className="col-span-full p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Send className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Handover Packages Generated Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Synthesize your first role-tailored continuation package to guide incoming members.
            </p>
            <Link
              to="/dashboard/handover/generate"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-royal-600 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Handover</span>
            </Link>
          </div>
        ) : (
          handovers.map((hnd) => (
            <div
              key={hnd.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    hnd.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : hnd.status === 'in_review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {hnd.status === 'approved' ? '✓ Approved' : hnd.status === 'in_review' ? 'In Review Gate' : 'Draft Package'}
                  </span>

                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {hnd.healthScore || 84}% Retention Health
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-navy-950">{hnd.title}</h3>
                  <div className="text-xs font-semibold text-royal-600 mt-0.5">
                    Target: {hnd.targetRole}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {hnd.executiveSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Departing: <strong>{hnd.departingMember || 'Marcus Chen'}</strong>
                </span>

                <Link
                  to={`/dashboard/handovers/${hnd.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-cyanBrand-50 text-cyanBrand-700 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <span>Open Continuation Plan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
