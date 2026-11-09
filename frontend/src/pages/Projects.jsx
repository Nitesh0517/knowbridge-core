import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  Calendar,
  Shield,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Building,
  Sparkles
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { projectsApi } from '../services/api';
import HealthScoreBadge from '../components/HealthScoreBadge';

export default function Projects({ onCreateProjectClick }) {
  const { projects, activeProject, switchProject, loadProjects } = useProject();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete workspace "${name}" and all its ingested sources and handovers?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await projectsApi.delete(id);
      await loadProjects();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-950">Project Workspaces</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage isolated project environments, team permissions, and knowledge continuity workspaces.
          </p>
        </div>

        <button
          onClick={onCreateProjectClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white text-xs font-bold shadow-soft-sm hover:shadow-glow-royal transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Workspace</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isActive = activeProject?.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => switchProject(proj)}
              className={`p-6 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft-sm hover:shadow-soft-md relative flex flex-col justify-between ${
                isActive
                  ? 'border-royal-500 ring-2 ring-royal-500/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {proj.category || 'General Software'}
                  </span>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-cyanBrand-600 bg-cyanBrand-50 px-2 py-0.5 rounded-full border border-cyanBrand-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyanBrand-500 animate-pulse" />
                        Active Workspace
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">Click to switch</span>
                    )}

                    <button
                      onClick={(e) => handleDelete(proj.id, proj.name, e)}
                      disabled={deletingId === proj.id}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Project Title & Organization */}
                <h3 className="text-base font-bold text-navy-950 hover:text-royal-600 transition-colors">
                  {proj.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{proj.organization || 'FinTech Dynamics Corp'}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              {/* Stats & Members Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Sources</span>
                    <span className="text-xs font-black text-navy-950">{proj.sourceCount || 3}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Open Tasks</span>
                    <span className="text-xs font-black text-navy-950">{proj.openTasks || 4}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Handovers</span>
                    <span className="text-xs font-black text-navy-950">{proj.handoverCount || 1}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.members ? proj.members.length : 3} Members</span>
                  </div>
                  <span className="font-semibold text-royal-600">{proj.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
