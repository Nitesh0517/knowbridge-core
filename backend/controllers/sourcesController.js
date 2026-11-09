/**
 * Sources Controller for KnowBridge AI
 * Implements 7-step Source Connection Workflow:
 * PDF, DOCX, TXT, MD, GitHub API, Meeting Notes, Decision Logs, Task Imports.
 */

const path = require('path');
const fs = require('fs');
const { localDB } = require('../config/db');
const AIBridge = require('../services/aiBridge');
const GitHubService = require('../services/githubService');

const sourcesCol = localDB.getCollection('sources');
const activitiesCol = localDB.getCollection('activities');

// Populate rich initial sample sources for default demo project if empty
if (sourcesCol.find().length === 0) {
  const initialSources = [
    {
      id: 'src_apex_arch_pdf',
      projectId: 'proj_apex_infra',
      name: 'Apex Infrastructure Architecture Decision Record (ADR-04).pdf',
      type: 'pdf',
      uploadedBy: 'Marcus Chen',
      uploadDate: '2025-09-12',
      permissionLevel: 'Engineering Lead & Project Manager',
      processingStatus: 'ready',
      sourceReference: 'docs/architecture/ADR-04-k8s-migration.pdf',
      pageCount: 6,
      totalChars: 4120,
      content: `--- PAGE 1 ---
ARCHITECTURAL DECISION RECORD: ADR-04
Title: Dual-VPC Kubernetes Multi-Cluster Migration Strategy
Date: 2025-09-12
Author: Marcus Chen (Departing Lead Architect)
Status: Approved

Context:
Our monolithic payment routing system currently runs on legacy EC2 instances inside a single AWS VPC. Scalability bottlenecks and noisy-neighbor issues during peak trading hours necessitate migrating to EKS multi-cluster.

Decision:
We decided to adopt Amazon EKS with Cilium CNI and Terraform infrastructure-as-code instead of Docker Swarm or Nomad.
Decider: Marcus Chen & Sarah Jenkins.
Rationale: Cilium provides eBPF-based high throughput packet inspection and transparent mTLS required for PCI-DSS compliance.

--- PAGE 2 ---
Unfinished Work & Outstanding Dependencies:
TODO: Complete mTLS service mesh verification between Auth Service and Vault before cutover.
Blocked by: Vault certificate auto-rotation issue (#342).
Assigned to: Elena Rostova (Incoming Lead).
Priority: Critical blocker for Day 0 cutover.

--- PAGE 3 ---
Risks & Operational Bottlenecks:
Risk: Single point of failure in PostgreSQL connection pooling. If PgBouncer pod crashes, payment API fails.
Mitigation: Deploy redundant PgBouncer stateful set with anti-affinity rules.
Warning: Marcus Chen holds sole credentials for production Vault cluster root key token. Handover required immediately.

--- PAGE 4 ---
Decided to: Enforce structured JSON logging with OpenTelemetry tracing across all Go and Node microservices.
Decider: Marcus Chen.
Why: Centralized Datadog ingestion requires standardized trace parent headers.
Alternatives considered: Prometheus statsd agent, Jaeger standalone agent.`
    },
    {
      id: 'src_apex_meeting_notes',
      projectId: 'proj_apex_infra',
      name: 'Sprint 24 Architecture & Cutover Handover Meeting.txt',
      type: 'meeting_note',
      uploadedBy: 'Sarah Jenkins',
      uploadDate: '2025-10-18',
      permissionLevel: 'Team Internal',
      processingStatus: 'ready',
      sourceReference: 'meetings/2025-10-18-cutover-sync.txt',
      pageCount: 2,
      totalChars: 2450,
      content: `MEETING NOTES - 18 OCTOBER 2025
Attendees: Sarah Jenkins (PM), Marcus Chen (Departing Lead), Elena Rostova (Incoming Lead), Alex Kim (DevOps)
Agenda: Marcus handover transition, database replication lag, Vault root token migration.

Key Discussion Points & Decisions:
1. Decision: Decided to delay production traffic cutover by 2 weeks until database read-replica lag falls below 50ms.
   Decider: Sarah Jenkins & Marcus Chen.
   Date: 2025-10-18.
   Why: Data corruption risk during failover if replication is out of sync.
   Alternatives considered: Proceed with risk and run offline backfill scripts.

2. Unfinished Work & Pending Tasks:
   - TODO: Automate Vault secret rotation script. Owner: Alex Kim. Priority: High.
   - Incomplete: Redis cluster cache invalidation hooks are still missing in the payment worker. Assigned to: Insufficient Evidence.
   - WIP: Write Terraform module for multi-region disaster recovery failover. Assigned to: Marcus Chen.

3. Ownership & Handover Gaps:
   - Marcus is leaving the organization on Nov 15. All cloud provider root MFA keys must be transferred to Elena Rostova.
   - Gap: Nobody currently owns the Kafka consumer rebalance alert triage protocol.

4. Unresolved Questions:
   - Open question: Who approved the bypass for the third-party credit check webhook timeout?
   - Unclear: Unknown deadlines for PCI-DSS external audit re-certification.`
    },
    {
      id: 'src_apex_github_repo',
      projectId: 'proj_apex_infra',
      name: 'GitHub Repo: fintech-corp/apex-cloud-core',
      type: 'github',
      uploadedBy: 'Marcus Chen',
      uploadDate: '2025-10-25',
      permissionLevel: 'Authorized Engineering Repository',
      processingStatus: 'ready',
      sourceReference: 'https://github.com/fintech-corp/apex-cloud-core',
      pageCount: 3,
      totalChars: 3800,
      content: `# GITHUB REPOSITORY AUDIT: fintech-corp/apex-cloud-core
Description: Core infrastructure terraform manifests and Kubernetes helm templates for Apex Cloud.
Default Branch: main
Primary Language: HCL / Terraform
Open Issues Count: 7

## RECENT COMMITS & ACTIVITY LOG
- [Commit a89f12c] (2025-10-24) by Marcus Chen: fix: update vault agent injector annotations for zero-trust mTLS
- [Commit 4b22c71] (2025-10-22) by Alex Kim: feat: add prometheus servicemonitor for envoy ingress proxy
- [Commit d1e09a3] (2025-10-19) by Marcus Chen: chore: add initial draft of disaster recovery runbook

## OPEN ISSUES & PULL REQUESTS
- [Issue #48] Vault certificate auto-rotation fails intermittently after 72 hours (by Alex Kim) [Labels: bug, critical-blocker]
  Description: Pods lose connection to Vault agent after certificate renewal. Blocks cutover.
- [Pull Request #52] Implement zero-downtime Blue/Green ingress switch via Argo Rollouts (by Elena Rostova) [Labels: enhancement, in-review]
  Description: Adds automated canary analysis using Prometheus error rate metrics.
- [Issue #55] Missing documentation for Kafka dead-letter-queue retry configuration (by Sarah Jenkins) [Labels: documentation, handover-risk]`
    }
  ];

  initialSources.forEach(s => sourcesCol.create(s));
}

exports.getSources = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    const sources = sourcesCol.find(filter);
    res.json({ success: true, count: sources.length, data: sources });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const source = sourcesCol.findById(id);
    if (!source) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }
    res.json({ success: true, data: source });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { projectId, permissionLevel } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId is required' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase().replace('.', '');

    // Step 5: Extract and process via Python AI service parser
    const parsed = await AIBridge.parseDocument(filePath, originalName);
    const parsedData = parsed.data || {};

    const newSource = sourcesCol.create({
      projectId,
      name: originalName,
      type: ext in ['pdf', 'docx', 'doc', 'txt', 'md'] ? ext : 'document',
      uploadedBy: req.user?.name || 'Authorized Member',
      uploadDate: new Date().toISOString().split('T')[0],
      permissionLevel: permissionLevel || 'Internal Team',
      processingStatus: 'ready',
      sourceReference: `uploads/${req.file.filename}`,
      pageCount: parsedData.page_count || 1,
      totalChars: parsedData.total_chars || (parsedData.content ? parsedData.content.length : 0),
      content: parsedData.content || '',
      sections: parsedData.sections || [],
      metadata: parsedData.metadata || {}
    });

    // Clean up temporary upload file if desired, or keep in uploads
    activitiesCol.create({
      projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Member',
      action: 'Connected Document Source',
      details: `Ingested ${originalName} (${parsedData.page_count || 1} pages, ${newSource.totalChars} characters).`
    });

    res.status(201).json({ success: true, data: newSource });
  } catch (error) {
    console.error('[Sources Controller] Document upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createMeetingNote = async (req, res) => {
  try {
    const { projectId, title, date, attendees, agenda, discussion, actionItems, permissionLevel } = req.body;

    if (!projectId || !title || !discussion) {
      return res.status(400).json({ success: false, error: 'projectId, title, and discussion content are required' });
    }

    let formattedContent = `# MEETING NOTES: ${title}\n`;
    formattedContent += `Date: ${date || new Date().toISOString().split('T')[0]}\n`;
    formattedContent += `Attendees: ${attendees || 'Team'}\n`;
    formattedContent += `Agenda: ${agenda || 'General Handover Sync'}\n\n`;
    formattedContent += `## DISCUSSION & DECISIONS\n${discussion}\n\n`;
    if (actionItems) {
      formattedContent += `## ACTION ITEMS & UNFINISHED WORK\n${actionItems}\n`;
    }

    const newSource = sourcesCol.create({
      projectId,
      name: `Meeting: ${title}`,
      type: 'meeting_note',
      uploadedBy: req.user?.name || 'Team Member',
      uploadDate: date || new Date().toISOString().split('T')[0],
      permissionLevel: permissionLevel || 'Internal Team',
      processingStatus: 'ready',
      sourceReference: `manual/meeting-${Date.now()}`,
      pageCount: Math.max(1, Math.floor(formattedContent.split('\n').length / 30)),
      totalChars: formattedContent.length,
      content: formattedContent,
      metadata: { attendees, agenda }
    });

    activitiesCol.create({
      projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Member',
      action: 'Added Meeting Note',
      details: `Recorded meeting note: "${title}"`
    });

    res.status(201).json({ success: true, data: newSource });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createDecisionLog = async (req, res) => {
  try {
    const { projectId, title, context, decision, decider, rationale, alternatives, permissionLevel } = req.body;

    if (!projectId || !title || !decision) {
      return res.status(400).json({ success: false, error: 'projectId, title, and decision are required' });
    }

    let formattedContent = `# ARCHITECTURAL DECISION LOG: ${title}\n`;
    formattedContent += `Date: ${new Date().toISOString().split('T')[0]}\n`;
    formattedContent += `Decider: ${decider || req.user?.name || 'Lead Architect'}\n\n`;
    formattedContent += `## CONTEXT & PROBLEM STATEMENT\n${context || 'Architecture decision'}\n\n`;
    formattedContent += `## DECISION\n${decision}\n\n`;
    formattedContent += `## RATIONALE & JUSTIFICATION\n${rationale || 'Selected for system stability'}\n\n`;
    if (alternatives) {
      formattedContent += `## ALTERNATIVES CONSIDERED\n${alternatives}\n`;
    }

    const newSource = sourcesCol.create({
      projectId,
      name: `Decision: ${title}`,
      type: 'decision_log',
      uploadedBy: req.user?.name || 'Architect',
      uploadDate: new Date().toISOString().split('T')[0],
      permissionLevel: permissionLevel || 'Engineering Team',
      processingStatus: 'ready',
      sourceReference: `manual/decision-${Date.now()}`,
      pageCount: 1,
      totalChars: formattedContent.length,
      content: formattedContent,
      metadata: { decider, title }
    });

    activitiesCol.create({
      projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Member',
      action: 'Logged Architectural Decision',
      details: `Logged decision: "${title}"`
    });

    res.status(201).json({ success: true, data: newSource });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.connectGitHub = async (req, res) => {
  try {
    const { projectId, repoUrl, token, permissionLevel } = req.body;

    if (!projectId || !repoUrl) {
      return res.status(400).json({ success: false, error: 'projectId and repoUrl are required' });
    }

    // Connect to actual authorized GitHub REST API
    const ingestedRepo = await GitHubService.ingestRepository(repoUrl, token);

    const newSource = sourcesCol.create({
      projectId,
      name: `GitHub: ${ingestedRepo.repoFullName}`,
      type: 'github',
      uploadedBy: req.user?.name || 'Repository Lead',
      uploadDate: new Date().toISOString().split('T')[0],
      permissionLevel: permissionLevel || 'Authorized Repository Access',
      processingStatus: 'ready',
      sourceReference: repoUrl,
      pageCount: Math.max(1, Math.floor(ingestedRepo.content.split('\n').length / 35)),
      totalChars: ingestedRepo.content.length,
      content: ingestedRepo.content,
      metadata: {
        owner: ingestedRepo.owner,
        repo: ingestedRepo.repo,
        defaultBranch: ingestedRepo.defaultBranch,
        commitsCount: ingestedRepo.commitsCount,
        issuesCount: ingestedRepo.issuesCount,
        openIssues: ingestedRepo.openIssues
      }
    });

    activitiesCol.create({
      projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Member',
      action: 'Connected GitHub Repository',
      details: `Connected ${ingestedRepo.repoFullName} (${ingestedRepo.commitsCount} commits, ${ingestedRepo.issuesCount} issues/PRs audited).`
    });

    res.status(201).json({ success: true, data: newSource });
  } catch (error) {
    console.error('[Sources Controller] GitHub connection error:', error.message);
    res.status(400).json({ success: false, error: `GitHub Ingestion Error: ${error.message}` });
  }
};

exports.deleteSource = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = sourcesCol.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }

    res.json({ success: true, message: 'Source deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
