import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Database,
  FileCheck2,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { analyticsApi } from '../services/api';
import HealthScoreBadge from '../components/HealthScoreBadge';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getStats()
      .then(res => {
        if (res.data.success) setStats(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const riskData = [
    { name: 'Critical', count: 1, color: '#dc2626' },
    { name: 'High', count: 2, color: '#f59e0b' },
    { name: 'Medium', count: 3, color: '#3b82f6' },
    { name: 'Low', count: 1, color: '#10b981' },
  ];

  const sourceData = stats?.sourceTypeDistribution || [
    { name: 'PDF', count: 3 },
    { name: 'DOCX', count: 2 },
    { name: 'GitHub', count: 2 },
    { name: 'Meeting Notes', count: 4 },
  ];

  const coverageData = [
    { metric: 'Decisions', covered: 100 },
    { metric: 'Tasks', covered: 82 },
    { metric: 'Ownership', covered: 65 },
    { metric: 'Dependencies', covered: 90 },
    { metric: 'Risks', covered: 88 },
  ];

  const COLORS = ['#2563EB', '#06B6D4', '#7C3AED', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry & Audit Metrics</span>
          </div>
          <h1 className="text-xl font-bold text-navy-950">Knowledge Retention Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time health scores, documentation coverage indices, and transition risk distribution.
          </p>
        </div>

        <HealthScoreBadge score={stats?.averageHealthScore || 84} />
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Global Health Score</span>
          <div className="text-3xl font-black text-navy-950 mt-1">{stats?.averageHealthScore || 84}%</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Optimal Retention Tier</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Evidence Verification Rate</span>
          <div className="text-3xl font-black text-cyanBrand-600 mt-1">{stats?.verificationRate || 78}%</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{stats?.totalClaims || 14} claims backed by quotes</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Ownership Gaps Flagged</span>
          <div className="text-3xl font-black text-amber-500 mt-1">{stats?.unassignedTasks || 2}</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Unassigned task items</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Handovers</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats?.approvedHandovers || 1}</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Signed off by PM & Lead</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage by Subsystem */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-navy-950">Grounding & Evidence Coverage %</h3>
            <p className="text-[11px] text-slate-500">Percentage of statements anchored by verbatim source excerpts</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="covered" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-navy-950">Source Ingestion Breakdown</h3>
            <p className="text-[11px] text-slate-500">Distribution across documents, meeting logs, and GitHub</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
