import React, { useState, useEffect } from 'react';
import {
  Database,
  UploadCloud,
  FileText,
  GitBranch,
  Calendar,
  FileCheck2,
  Trash2,
  Eye,
  Plus,
  CheckCircle2,
  AlertCircle,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { sourcesApi } from '../services/api';
import { useProject } from '../context/ProjectContext';

export default function Sources() {
  const { activeProject } = useProject();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'github', 'meeting', 'decision'
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewSource, setPreviewSource] = useState(null);

  // Form States
  const [selectedFile, setSelectedFile] = useState(null);
  const [permissionLevel, setPermissionLevel] = useState('Internal Team Access');

  // GitHub Form
  const [githubUrl, setGithubUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');

  // Meeting Form
  const [meetingData, setMeetingData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    attendees: '',
    agenda: '',
    discussion: '',
    actionItems: ''
  });

  // Decision Form
  const [decisionData, setDecisionData] = useState({
    title: '',
    decider: '',
    context: '',
    decision: '',
    rationale: '',
    alternatives: ''
  });

  useEffect(() => {
    loadSources();
  }, [activeProject?.id]);

  const loadSources = async () => {
    if (!activeProject?.id) return;
    try {
      const res = await sourcesApi.getAll(activeProject.id);
      if (res.data.success) {
        setSources(res.data.data || []);
      }
    } catch (err) {
      console.warn('Could not load sources:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload Document Handler (PDF, DOCX, TXT, MD)
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a PDF, DOCX, TXT, or MD file to upload.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', activeProject.id);
      formData.append('permissionLevel', permissionLevel);

      const res = await sourcesApi.uploadDocument(formData);
      if (res.data.success) {
        setSuccessMsg(`Successfully ingested and parsed: ${res.data.data.name}`);
        setSelectedFile(null);
        await loadSources();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  // GitHub Connection Handler
  const handleConnectGitHub = async (e) => {
    e.preventDefault();
    if (!githubUrl) {
      setErrorMsg('Please enter a GitHub repository URL or slug (e.g. owner/repo).');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await sourcesApi.connectGitHub({
        projectId: activeProject.id,
        repoUrl: githubUrl,
        token: githubToken || undefined,
        permissionLevel
      });
      if (res.data.success) {
        setSuccessMsg(`Connected GitHub repository: ${res.data.data.name}`);
        setGithubUrl('');
        setGithubToken('');
        await loadSources();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'GitHub connection failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Meeting Note Handler
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await sourcesApi.createMeeting({
        projectId: activeProject.id,
        ...meetingData,
        permissionLevel
      });
      if (res.data.success) {
        setSuccessMsg(`Added meeting notes: ${res.data.data.name}`);
        setMeetingData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          attendees: '',
          agenda: '',
          discussion: '',
          actionItems: ''
        });
        await loadSources();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save meeting notes');
    } finally {
      setSubmitting(false);
    }
  };

  // Decision Log Handler
  const handleCreateDecision = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await sourcesApi.createDecision({
        projectId: activeProject.id,
        ...decisionData,
        permissionLevel
      });
      if (res.data.success) {
        setSuccessMsg(`Recorded architectural decision: ${res.data.data.name}`);
        setDecisionData({
          title: '',
          decider: '',
          context: '',
          decision: '',
          rationale: '',
          alternatives: ''
        });
        await loadSources();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record decision');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSource = async (id, name) => {
    if (!window.confirm(`Remove source "${name}"? Extracted claims will remain until next reconstruction.`)) {
      return;
    }
    try {
      await sourcesApi.delete(id);
      await loadSources();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const getSourceTypeBadge = (type) => {
    switch (type) {
      case 'pdf': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'docx':
      case 'doc': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'github': return 'bg-slate-900 text-white border-slate-700';
      case 'meeting_note': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'decision_log': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyanBrand-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <Database className="w-3.5 h-3.5" />
          <span>Stage 01: Connect & Ingest</span>
        </div>
        <h1 className="text-xl font-bold text-navy-950">Knowledge Source Ingestion</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect authorized project sources into <strong>{activeProject ? activeProject.name : 'Workspace'}</strong>.
          KnowBridge extracts structured text, preserves line & page references, and enforces access permissions.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800"><X className="w-4 h-4" /></button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 hover:text-rose-800"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Ingestion Tabs Container */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-navy-900 text-white shadow-soft-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Document Upload (PDF, DOCX, TXT, MD)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'github'
                ? 'bg-navy-900 text-white shadow-soft-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub Repository API</span>
          </button>

          <button
            onClick={() => setActiveTab('meeting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'meeting'
                ? 'bg-navy-900 text-white shadow-soft-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Meeting Notes & Syncs</span>
          </button>

          <button
            onClick={() => setActiveTab('decision')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'decision'
                ? 'bg-navy-900 text-white shadow-soft-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Architectural Decision Log (ADR)</span>
          </button>
        </div>

        {/* Tab 1: Document Upload */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-slate-200 hover:border-royal-400 rounded-2xl p-8 text-center transition-all bg-slate-50/50">
              <UploadCloud className="w-10 h-10 text-royal-600 mx-auto mb-3" />
              <div className="font-bold text-sm text-slate-800">
                {selectedFile ? selectedFile.name : 'Select or drag project documents here'}
              </div>
              <p className="text-slate-500 mt-1 text-[11px]">
                Supported formats: PDF (.pdf), Microsoft Word (.docx), Markdown (.md), Plain Text (.txt)
              </p>
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.docx,.doc,.txt,.md,.markdown"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="inline-block mt-4 px-5 py-2 rounded-xl bg-white border border-slate-200 text-royal-600 font-bold hover:bg-slate-100 cursor-pointer shadow-soft-sm transition-all"
              >
                Browse Files
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Project</label>
                <input
                  type="text"
                  disabled
                  value={activeProject ? activeProject.name : 'Apex Cloud Migration'}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permission Level</label>
                <select
                  value={permissionLevel}
                  onChange={(e) => setPermissionLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>Internal Team Access</option>
                  <option>Confidential / Lead Architects Only</option>
                  <option>External Auditor Viewable</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting || !selectedFile}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold shadow-soft-sm hover:shadow-glow-royal transition-all disabled:opacity-50"
              >
                {submitting ? 'Parsing & Ingesting...' : 'Upload & Extract Knowledge'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: GitHub Repository API */}
        {activeTab === 'github' && (
          <form onSubmit={handleConnectGitHub} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3">
              <GitBranch className="w-5 h-5 text-cyanBrand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Authorized GitHub REST API Connection</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  KnowBridge connects directly to the GitHub REST API to audit commits, pull requests, open issues, and README documentation for historical evidence.
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Repository URL or Slug *</label>
              <input
                type="text"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="e.g. https://github.com/facebook/react or owner/repo"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Personal Access Token (Optional for public, required for private)</label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_••••••••••••••••••••••••••••••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Tokens are transmitted securely and never exposed in frontend code.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold shadow-soft-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Connecting & Auditing Commits...' : 'Connect Repository'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Meeting Notes */}
        {activeTab === 'meeting' && (
          <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={meetingData.title}
                  onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
                  placeholder="e.g. Sprint 26 Database Cutover Architecture Review"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Attendees</label>
                <input
                  type="text"
                  value={meetingData.attendees}
                  onChange={(e) => setMeetingData({ ...meetingData, attendees: e.target.value })}
                  placeholder="Sarah Jenkins (PM), Marcus Chen (Lead), Elena Rostova"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agenda</label>
                <input
                  type="text"
                  value={meetingData.agenda}
                  onChange={(e) => setMeetingData({ ...meetingData, agenda: e.target.value })}
                  placeholder="Review Vault token rotation, discuss Kafka consumer lag"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discussion & Decisions Recorded *</label>
              <textarea
                rows="4"
                required
                value={meetingData.discussion}
                onChange={(e) => setMeetingData({ ...meetingData, discussion: e.target.value })}
                placeholder="Marcus explained the decision to postpone cutover until replica lag drops under 50ms. Rationale: avoid data divergence..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Action Items & Unfinished Tasks</label>
              <textarea
                rows="2"
                value={meetingData.actionItems}
                onChange={(e) => setMeetingData({ ...meetingData, actionItems: e.target.value })}
                placeholder="TODO: Alex to write automated rotation script. Priority: High. Blocked on Vault IAM approval."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold shadow-soft-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Record Meeting Note'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Decision Log */}
        {activeTab === 'decision' && (
          <form onSubmit={handleCreateDecision} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Decision Title *</label>
                <input
                  type="text"
                  required
                  value={decisionData.title}
                  onChange={(e) => setDecisionData({ ...decisionData, title: e.target.value })}
                  placeholder="e.g. Adoption of Amazon EKS with Cilium CNI"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Decider / Lead</label>
                <input
                  type="text"
                  value={decisionData.decider}
                  onChange={(e) => setDecisionData({ ...decisionData, decider: e.target.value })}
                  placeholder="Marcus Chen (Lead Architect)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Decision Statement *</label>
              <textarea
                rows="2"
                required
                value={decisionData.decision}
                onChange={(e) => setDecisionData({ ...decisionData, decision: e.target.value })}
                placeholder="We decided to deploy Cilium CNI on EKS to enforce transparent mTLS and eBPF observability..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rationale & Why</label>
              <textarea
                rows="2"
                value={decisionData.rationale}
                onChange={(e) => setDecisionData({ ...decisionData, rationale: e.target.value })}
                placeholder="Required for PCI-DSS compliance and sub-10ms inter-service latency under heavy load..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alternatives Considered</label>
              <input
                type="text"
                value={decisionData.alternatives}
                onChange={(e) => setDecisionData({ ...decisionData, alternatives: e.target.value })}
                placeholder="Docker Swarm, Nomad, Istio service mesh"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold shadow-soft-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Recording...' : 'Log Architectural Decision'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Connected Sources List */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-navy-950">
              Connected Sources ({sources.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Authorized documents and repositories feeding the AI reconstruction engine
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            All Sources Ready
          </span>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {sources.map((src) => (
            <div key={src.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-700" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-royal-600 transition-colors">
                      {src.name}
                    </h4>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getSourceTypeBadge(src.type)}`}>
                      {src.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span>Uploaded: {src.uploadDate || '2025-10-20'}</span>
                    <span>•</span>
                    <span>By: {src.uploadedBy || 'Lead'}</span>
                    <span>•</span>
                    <span>{src.pageCount || 1} pages ({src.totalChars || 1200} chars)</span>
                    <span>•</span>
                    <span className="text-cyanBrand-600 font-semibold">{src.permissionLevel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setPreviewSource(src)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview Text</span>
                </button>

                <button
                  onClick={() => handleDeleteSource(src.id, src.name)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Source"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Preview Modal */}
      {previewSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyanBrand-400 font-mono">SOURCE AUDIT PREVIEW</span>
                <h3 className="text-base font-bold truncate mt-0.5">{previewSource.name}</h3>
              </div>
              <button
                onClick={() => setPreviewSource(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Type</span>
                  <strong className="uppercase">{previewSource.type}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Length</span>
                  <strong>{previewSource.totalChars} characters</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <strong className="text-emerald-600">Extracted & Ready</strong>
                </div>
              </div>

              <div className="p-4 bg-navy-950 text-slate-200 font-mono text-xs rounded-2xl border border-navy-800 whitespace-pre-wrap leading-relaxed">
                {previewSource.content || 'No content parsed.'}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewSource(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
