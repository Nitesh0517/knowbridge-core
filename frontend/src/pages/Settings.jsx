import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, GitBranch, User, Shield, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('knowbridge_gemini_key') || '');
  const [githubToken, setGithubToken] = useState(localStorage.getItem('knowbridge_github_token') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (geminiKey) {
      localStorage.setItem('knowbridge_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('knowbridge_gemini_key');
    }

    if (githubToken) {
      localStorage.setItem('knowbridge_github_token', githubToken.trim());
    } else {
      localStorage.removeItem('knowbridge_github_token');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Workspace Preferences</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Settings & API Credentials</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure Google Gemini AI extraction keys, GitHub integration tokens, and user profile parameters.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Credentials updated successfully! Active across all reconstruction jobs.</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-6 text-xs">
        {/* Gemini API Key */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-royal-600" />
            <label className="font-bold text-slate-800 text-sm">Google Gemini API Key</label>
          </div>
          <p className="text-slate-500 text-[11px]">
            Used for structured zero-shot knowledge extraction (Gemini 2.5 Flash). If left blank, the platform uses the server-configured environment key or high-precision deterministic pattern fallback.
          </p>
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy••••••••••••••••••••••••••••••••••••••••"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
          />
        </div>

        {/* GitHub Token */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-royal-600" />
            <label className="font-bold text-slate-800 text-sm">GitHub Personal Access Token (PAT)</label>
          </div>
          <p className="text-slate-500 text-[11px]">
            Required for connecting private repositories and lifting GitHub REST API rate limits.
          </p>
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_••••••••••••••••••••••••••••••••••••••••"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
          />
        </div>

        {/* User Profile Summary */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-royal-600" />
            <label className="font-bold text-slate-800 text-sm">Current Authenticated Profile</label>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Name</span>
              <strong className="text-slate-800">{user?.displayName || 'Elena Rostova'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Email</span>
              <strong className="text-slate-800">{user?.email || 'architect@knowbridge.ai'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Role</span>
              <strong className="text-royal-600">{user?.role || 'Incoming Lead Architect'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Organization</span>
              <strong className="text-slate-800">{user?.organization || 'FinTech Dynamics Corp'}</strong>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold text-xs shadow-soft-sm hover:shadow-glow-royal transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
