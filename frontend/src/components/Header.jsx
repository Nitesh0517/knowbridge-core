import React, { useState } from 'react';
import { Search, Bell, Plus, ShieldCheck, ChevronRight, User } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import HealthScoreBadge from './HealthScoreBadge';

export default function Header({ pageTitle = 'Dashboard', onCreateProjectClick }) {
  const { activeProject, reconstruction } = useProject();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Reconstruction Completed', time: '10m ago', unread: true },
    { id: 2, title: 'Vault rotation task unassigned', time: '1h ago', unread: true },
    { id: 3, title: 'Handover package approved by Sarah J.', time: '1d ago', unread: false },
  ];

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-soft-sm">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {activeProject ? activeProject.name : 'Workspace'}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <h1 className="text-base font-bold text-navy-950">
          {pageTitle}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Health Score Pill */}
        {reconstruction && (
          <div className="hidden sm:block">
            <HealthScoreBadge score={reconstruction.healthScore || 80} size="sm" />
          </div>
        )}

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search claims, decisions, code..."
            className="w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 transition-all"
          />
        </div>

        {/* Create Project Button */}
        <button
          onClick={onCreateProjectClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white text-xs font-semibold shadow-soft-sm hover:shadow-glow-royal transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-cyanBrand-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-cyanBrand-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-2.5 text-xs hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-cyanBrand-50/30' : ''}`}>
                    <div className="font-semibold text-slate-800">{n.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-royal-600 to-cyanBrand-500 flex items-center justify-center text-white text-xs font-bold shadow-soft-sm">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
