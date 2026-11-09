import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Layers,
  User,
  Users,
  FileCheck2,
  Calendar,
  Shield,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProject } from '../context/ProjectContext';
import { handoversApi } from '../services/api';

export default function HandoverGenerate() {
  const { activeProject, reconstruction } = useProject();
  const navigate = useNavigate();

  const [targetRole, setTargetRole] = useState('Incoming Lead Architect');
  const [departingMember, setDepartingMember] = useState('Marcus Chen');
  const [reviewers, setReviewers] = useState('Sarah Jenkins (PM), Marcus Chen (Departing Lead), Elena Rostova (Incoming Lead)');
  const [notes, setNotes] = useState('Handover focuses on Vault token migration and EKS cluster zero-downtime cutover.');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!activeProject?.id) return;
    setGenerating(true);
    try {
      const reviewerList = reviewers.split(',').map(r => r.trim()).filter(Boolean);
      const res = await handoversApi.generate({
        projectId: activeProject.id,
        targetRole,
        departingMember,
        reviewers: reviewerList,
        notes
      });

      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        navigate(`/dashboard/handovers/${res.data.data.id}`);
      }
    } catch (err) {
      alert('Handover generation failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Send className="w-3.5 h-3.5" />
          <span>Stage 05: Continuity & Handover</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Generate Role-Based Handover Package</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Synthesize a role-appropriate continuation plan and 30-60-90 day onboarding roadmap for incoming teammates.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleGenerate} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-6 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Target Incoming Role *</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option>Incoming Lead Architect</option>
            <option>Incoming Frontend Developer</option>
            <option>Incoming Backend Engineer</option>
            <option>Incoming Full Stack Engineer</option>
            <option>Incoming DevOps / SRE Lead</option>
            <option>Incoming Project Manager / Scrum Master</option>
            <option>Incoming QA / Test Automation Lead</option>
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">
            The roadmap and checklist priorities will be customized for this specific engineering discipline.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Departing Team Member</label>
            <input
              type="text"
              value={departingMember}
              onChange={(e) => setDepartingMember(e.target.value)}
              placeholder="Marcus Chen"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Active Project Workspace</label>
            <input
              type="text"
              disabled
              value={activeProject ? activeProject.name : 'Apex Cloud Migration'}
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Reviewers & Sign-off Gate (Comma-separated)</label>
          <input
            type="text"
            value={reviewers}
            onChange={(e) => setReviewers(e.target.value)}
            placeholder="Sarah Jenkins (PM), Marcus Chen (Lead), Elena Rostova"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Required reviewers who must audit and sign off before the package is marked as Approved.
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Transition Directives & Custom Notes</label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special considerations for the transition period, emergency escalations, or external auditor requirements..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-cyanBrand-600 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Automated Package Contents</span>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <li className="flex items-center gap-1.5">✓ Executive State Synthesis</li>
            <li className="flex items-center gap-1.5">✓ 30-Day Critical Setup Tasks</li>
            <li className="flex items-center gap-1.5">✓ 60-Day Execution Roadmaps</li>
            <li className="flex items-center gap-1.5">✓ 90-Day Architecture Autonomy</li>
            <li className="flex items-center gap-1.5">✓ Grounded Evidence Excerpts</li>
            <li className="flex items-center gap-1.5">✓ Single-Point-of-Failure Directory</li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={generating}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyanBrand-500 via-royal-600 to-navy-800 hover:from-cyanBrand-400 hover:to-royal-500 text-white font-extrabold text-xs shadow-soft-md hover:shadow-glow-cyan transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span>{generating ? 'Synthesizing Continuation Roadmap...' : 'Generate Handover Package'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
