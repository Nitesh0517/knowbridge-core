import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Cpu,
  CheckCircle2,
  Send,
  Milestone,
  ListTodo,
  ShieldAlert,
  BarChart3,
  Settings,
  FileCheck,
  ChevronDown,
  Plus,
  LogOut,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Logo from './Logo';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onCreateProjectClick }) {
  const { projects, activeProject, switchProject } = useProject();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const mainNav = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { name: '01. Connect Sources', path: '/dashboard/sources', icon: Database, badge: 'Ingest' },
    { name: '02. AI Reconstruction', path: '/dashboard/reconstruction', icon: Cpu, badge: 'Gemini' },
    { name: '03. Evidence Claims', path: '/dashboard/evidence', icon: CheckCircle2, badge: 'Verify' },
    { name: '04. Review & Approvals', path: '/dashboard/approvals', icon: FileCheck, badge: 'Gate' },
    { name: '05. Handover Packages', path: '/dashboard/handovers', icon: Send, badge: 'Plan' },
  ];

  const analysisNav = [
    { name: 'Decision Timeline', path: '/dashboard/timeline', icon: Milestone },
    { name: 'Tasks & Ownership', path: '/dashboard/tasks', icon: ListTodo },
    { name: 'Risks & Dependencies', path: '/dashboard/risks', icon: ShieldAlert },
    { name: 'Knowledge Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings & API Keys', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-navy-950 text-slate-300 flex flex-col flex-shrink-0 h-screen border-r border-navy-850 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-850/80">
        <Logo size="md" showTagline={true} light={true} />
      </div>

      {/* Active Project Switcher */}
      <div className="px-4 py-3 border-b border-navy-850/60 relative">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
          <span>Active Project</span>
          <button
            onClick={onCreateProjectClick}
            className="text-cyanBrand-400 hover:text-cyanBrand-300 flex items-center gap-1 transition-colors"
            title="Create New Project"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>

        <button
          onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-navy-900 border border-navy-700/60 hover:border-cyanBrand-500/50 hover:bg-navy-850 transition-all text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-cyanBrand-400 animate-pulse flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate group-hover:text-cyanBrand-300 transition-colors">
                {activeProject ? activeProject.name : 'Select Project'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {activeProject ? activeProject.organization : 'Workspace'}
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${projectDropdownOpen ? 'rotate-180 text-cyanBrand-400' : ''}`} />
        </button>

        {/* Project Switcher Dropdown */}
        {projectDropdownOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-navy-900 border border-navy-700 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-56 overflow-y-auto">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  switchProject(p);
                  setProjectDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-navy-800 transition-colors ${
                  activeProject?.id === p.id ? 'bg-royal-600/30 text-cyanBrand-300 font-semibold border-l-2 border-cyanBrand-400' : 'text-slate-300'
                }`}
              >
                <div className="truncate mr-2">
                  <div className="truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.category}</div>
                </div>
                {activeProject?.id === p.id && (
                  <span className="text-[9px] bg-cyanBrand-500/20 text-cyanBrand-300 px-1.5 py-0.5 rounded">Active</span>
                )}
              </button>
            ))}
            <div className="border-t border-navy-800 p-1.5">
              <button
                onClick={() => {
                  setProjectDropdownOpen(false);
                  onCreateProjectClick();
                }}
                className="w-full text-center text-xs py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-cyanBrand-400 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Continuity Stages */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyanBrand-400" />
            <span>Continuity Engine</span>
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-royal-600 to-navy-800 text-white font-semibold shadow-soft-sm'
                        : 'text-slate-400 hover:text-white hover:bg-navy-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-navy-800 text-cyanBrand-300 border border-navy-700/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Archaeological Views */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Archaeology & Analysis
          </div>
          <nav className="space-y-1">
            {analysisNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-royal-600 to-navy-800 text-white font-semibold shadow-soft-sm'
                        : 'text-slate-400 hover:text-white hover:bg-navy-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Card & Sign Out */}
      <div className="p-3 border-t border-navy-850/80 bg-navy-900/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-navy-850/70 border border-navy-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyanBrand-500 to-royal-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {user?.displayName || 'Lead Architect'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {user?.role || 'Incoming Engineer'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-navy-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
