import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Cpu,
  FileCheck2,
  Database,
  ArrowRight,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  Lock,
  Sparkles,
  Users,
  Compass,
  FileText,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import Logo from '../components/Logo';

export default function Landing() {
  const stages = [
    { num: '01', title: 'CONNECT', icon: Database, desc: 'Connect authorized project sources: PDFs, DOCX, meeting notes, decision logs, and GitHub repositories.' },
    { num: '02', title: 'RECONSTRUCT', icon: Cpu, desc: 'Google Gemini AI extracts architectural decisions, pending tasks, ownership gaps, and hidden dependencies.' },
    { num: '03', title: 'VERIFY', icon: FileCheck2, desc: 'Every claim is bound to verbatim source excerpts with confidence metrics and "Insufficient Evidence" checks.' },
    { num: '04', title: 'REVIEW', icon: Shield, desc: 'Human verification workflow allowing leads to audit, correct, and digitally approve handovers.' },
    { num: '05', title: 'HANDOVER', icon: Zap, desc: 'Generate role-tailored 30-60-90 day continuation plans shared via secure tokenized links.' },
  ];

  const features = [
    { title: 'Smart Source Ingestion', desc: 'Native parsers for PDF, Word DOCX, Markdown, plain text, and real GitHub REST API commits & issues.', icon: Database },
    { title: 'AI Project Reconstruction', desc: 'Gemini 2.5 Flash engine extracts ground-truth decisions, ownership, dependencies, and risks.', icon: Cpu },
    { title: 'Decision Timeline', desc: 'Traceable chronology of why choices were made, who made them, and what alternatives were rejected.', icon: Clock },
    { title: 'Responsibility Mapping', desc: 'Identifies single points of failure, departing maintainers, and unassigned task risks.', icon: Users },
    { title: 'Risk & Dependency Detection', desc: 'Surfaces hidden blockers, technical debt, and cross-team dependencies before they stall progress.', icon: AlertTriangle },
    { title: 'Evidence-Linked Summaries', desc: 'No hallucination. Every statement cites exact source quotes and page numbers for auditability.', icon: FileText },
    { title: 'Role-Based Handovers', desc: 'Continuity plans customized for incoming frontend devs, backend leads, PMs, or architects.', icon: Layers },
    { title: 'Human Approval Workflow', desc: '4-eye review protocol ensuring departing and incoming leads inspect and sign off on handovers.', icon: FileCheck2 },
    { title: 'Controlled Knowledge Sharing', desc: 'Tokenized, time-limited, read-only handover portals for smooth incoming member onboarding.', icon: Lock },
  ];

  const useCases = [
    { name: 'Corporate Enterprise Teams', desc: 'Eliminate knowledge loss during senior architect rotations, reorganizations, and contractor exits.' },
    { name: 'Student Project Teams', desc: 'Pass capstone projects and research code seamlessly across academic cohorts and semesters.' },
    { name: 'Research Laboratories', desc: 'Preserve experiment setup protocols, dataset versions, and undocumented research methodologies.' },
    { name: 'Volunteer & Non-Profit Orgs', desc: 'Keep mission-critical grant projects active when core volunteer leadership transitions.' },
    { name: 'High-Growth Startups', desc: 'Scale engineering rapidly without losing early architectural rationale and critical runbooks.' },
    { name: 'Software Development Teams', desc: 'Ensure day-one productivity for new hires with comprehensive 30-60-90 day continuation plans.' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg text-brandText-primary selection:bg-cyanBrand-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" showTagline={true} />

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-royal-600 transition-colors">How It Works</a>
            <a href="#problem" className="hover:text-royal-600 transition-colors">The Problem</a>
            <a href="#features" className="hover:text-royal-600 transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-royal-600 transition-colors">Use Cases</a>
            <a href="#security" className="hover:text-royal-600 transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-royal-600 hover:bg-slate-100 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white text-sm font-bold shadow-soft-md hover:shadow-glow-royal transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyanBrand-50 border border-cyanBrand-200/60 text-cyanBrand-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-soft-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyanBrand-500" />
          <span>Intelligent Knowledge Handover Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-950 tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Your Team Changes. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-royal-600 via-cyanBrand-500 to-violetBrand-600 bg-clip-text text-transparent">
            Your Knowledge Shouldn't.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Transform scattered project documents, meeting notes, and GitHub repositories into structured,
          evidence-backed knowledge handovers. Help incoming members continue exactly where others left off.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold text-base shadow-soft-lg hover:shadow-glow-royal flex items-center justify-center gap-2.5 transition-all"
          >
            <span>Start Building Your Handover</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-soft-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Platform</span>
          </a>
        </div>

        {/* Interactive Dashboard Preview Banner */}
        <div className="mt-16 max-w-6xl mx-auto rounded-3xl bg-navy-950 p-2 sm:p-4 shadow-2xl border border-navy-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-royal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyanBrand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Browser Mockup Chrome */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-navy-800 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-[11px] text-slate-500">app.knowbridge.ai/dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-cyanBrand-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyanBrand-400 animate-pulse" />
              <span>Real-Time Evidence Grounding</span>
            </div>
          </div>

          {/* Dashboard Preview Inside */}
          <div className="p-4 sm:p-6 bg-navy-900 rounded-2xl text-left space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Knowledge Health</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">84% Optimal</div>
                <span className="text-[10px] text-slate-500">12 verified claims</span>
              </div>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Decisions Cataloged</span>
                <div className="text-2xl font-bold text-white mt-1">7 ADRs</div>
                <span className="text-[10px] text-cyanBrand-400">100% evidence-linked</span>
              </div>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Ownership Gaps</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">2 Flagged</div>
                <span className="text-[10px] text-slate-500">Departing architect scope</span>
              </div>
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Continuation Plan</span>
                <div className="text-2xl font-bold text-royal-400 mt-1">30-60-90 Day</div>
                <span className="text-[10px] text-slate-500">Ready for sign-off</span>
              </div>
            </div>

            {/* Evidence Sample Card */}
            <div className="p-4 bg-navy-950/80 rounded-xl border border-navy-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-cyanBrand-400 font-bold">CLAIM #CLM-003: Verified Architectural Rationale</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">95% Verifiable</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                "We decided to adopt Amazon EKS with Cilium CNI and Terraform infrastructure-as-code instead of Docker Swarm or Nomad."
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-navy-850">
                <span>Source: <strong>ADR-04-k8s-migration.pdf (Page 1)</strong></span>
                <span className="text-slate-500">Decider: Marcus Chen (Departing Lead)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              The Reality of Team Transitions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-4">
              When People Leave, Critical Knowledge Disappears With Them.
            </h2>
            <p className="mt-4 text-slate-600">
              Even in well-documented teams, vital context remains scattered across tickets, PDFs, chat threads, and code commits.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-6">
                ?
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Decisions Become Untraceable</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Why was a specific database chosen? Why was an alternative rejected? Incoming engineers waste weeks re-debating settled questions without historical context.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-6">
                !
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Unfinished Work Loses Ownership</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Half-finished features, undocumented bugs, and silent dependencies fall through the cracks until a production outage surfaces them.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-royal-100 text-royal-600 flex items-center justify-center font-bold text-xl mb-6">
                ⏳
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Prolonged Onboarding Friction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                New leads take months to gain full momentum, remaining heavily reliant on ad-hoc Slack messages to departed team members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 5 Essential Stages */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-cyanBrand-600 uppercase tracking-widest bg-cyanBrand-50 px-3 py-1 rounded-full border border-cyanBrand-200">
            Methodology & Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-4">
            The 5 Essential Stages of KnowBridge AI
          </h2>
          <p className="mt-4 text-slate-600">
            A disciplined knowledge archaeology pipeline that converts raw sources into verified, actionable handovers.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.num} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm flex flex-col justify-between hover:border-cyanBrand-400 hover:shadow-soft-md transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-cyanBrand-500 transition-colors">
                      {stage.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-navy-900 group-hover:text-cyanBrand-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mb-2">{stage.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-cyanBrand-600">
                  <span>Explore Stage</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-royal-600 uppercase tracking-widest bg-royal-50 px-3 py-1 rounded-full border border-royal-200">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-4">
              Engineered for Auditability, Evidence and Trust
            </h2>
            <p className="mt-4 text-slate-600">
              Never build on hallucinations. KnowBridge connects every claim to verifiable source excerpts.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-3xl bg-surface-bg border border-slate-200/80 hover:border-royal-300 hover:bg-white transition-all shadow-soft-sm group">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-cyanBrand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-violetBrand-600 uppercase tracking-widest bg-violetBrand-50 px-3 py-1 rounded-full border border-violetBrand-200">
            Versatile Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-4">
            Built for Every Team That Evolves
          </h2>
          <p className="mt-4 text-slate-600">
            From university research groups to enterprise infrastructure squads, KnowBridge protects project momentum.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
              <div className="w-3 h-3 rounded-full bg-cyanBrand-500 mb-4" />
              <h3 className="text-base font-bold text-navy-950 mb-2">{uc.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-cyanBrand-400 uppercase tracking-widest bg-cyanBrand-500/20 px-3 py-1 rounded-full border border-cyanBrand-500/30">
                Enterprise-Grade Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 leading-tight">
                Permission-Aware Ingestion & Controlled Handover Sharing
              </h2>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                KnowBridge AI is designed with strict data isolation. Project workspaces are partitioned, source permissions are respected, and handovers can only be shared with authorized incoming members via time-expiring cryptographic tokens.
              </p>

              <div className="mt-8 space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Strict zero-hallucination policy with explicit "Insufficient Evidence" checks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Backend Firebase JWT token verification on all protected endpoints</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Audit trail logs for claim verification and human sign-offs</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
              <div className="flex items-center gap-3 text-cyanBrand-400 font-mono text-xs">
                <Lock className="w-4 h-4" />
                <span>ACCESS CONTROL MATRIX</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Authorized Repository Token</span>
                  <span className="text-emerald-400 font-mono">Encrypted at rest</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Document Workspace Isolation</span>
                  <span className="text-cyanBrand-400 font-mono">Tenant Partitioned</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Public Handover Share Links</span>
                  <span className="text-amber-400 font-mono">UUIDv4 + 90d Expiry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-royal-800 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Prevent Knowledge Loss?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Set up your first project in minutes. Connect your documents, run Gemini reconstruction, and give your incoming teammates the clarity they deserve.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyanBrand-500 hover:bg-cyanBrand-400 text-navy-950 font-extrabold text-base shadow-soft-lg hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                <span>Launch KnowBridge Platform</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" showTagline={true} />
          <p className="text-xs text-slate-500">
            © 2026 KnowBridge AI. Intelligent Knowledge Handover Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
