/**
 * Handovers Controller for KnowBridge AI
 * Implements 5th Stage: HANDOVER & CONTINUATION.
 * Role-Based Onboarding, 30-60-90 Day Roadmaps, Human Review Approval Workflow,
 * and Controlled Tokenized Sharing for Incoming Members.
 */

const { v4: uuidv4 } = require('uuid');
const { localDB } = require('../config/db');
const AIBridge = require('../services/aiBridge');

const handoversCol = localDB.getCollection('handovers');
const projectsCol = localDB.getCollection('projects');
const reconstructionsCol = localDB.getCollection('reconstructions');
const claimsCol = localDB.getCollection('evidenceClaims');
const activitiesCol = localDB.getCollection('activities');

// Default sample handover for demo project if empty
if (handoversCol.find().length === 0) {
  handoversCol.create({
    id: 'hnd_apex_lead_eng',
    projectId: 'proj_apex_infra',
    projectName: 'Apex Cloud Infrastructure Migration',
    title: 'Incoming Lead Architect Transition Package',
    targetRole: 'Incoming Lead Architect (Elena Rostova)',
    departingMember: 'Marcus Chen',
    status: 'in_review', // draft, in_review, approved, rejected
    healthScore: 84,
    shareToken: 'apex-transition-token-2025',
    shareExpiresAt: '2026-12-31T23:59:59.000Z',
    executiveSummary: 'This transition package synthesizes architectural decisions, unfinished EKS migration tasks, and critical security credentials for the incoming lead architect. Immediate focus is unblocking the Vault certificate auto-rotation issue and securing root MFA keys before Nov 15.',
    roadmap30Days: [
      { id: 'R30-1', phase: 'Days 1-30', task: 'Obtain AWS root account IAM access and transfer Vault production KMS unseal keys from Marcus Chen.', criticality: 'critical', owner: 'Elena Rostova', completed: false },
      { id: 'R30-2', phase: 'Days 1-30', task: 'Resolve Vault agent injector auto-rotation bug (#48) blocking EKS microservices cutover.', criticality: 'critical', owner: 'Elena Rostova', completed: false },
      { id: 'R30-3', phase: 'Days 1-30', task: 'Conduct end-to-end rehearsal of PgBouncer failover under simulated traffic spikes.', criticality: 'high', owner: 'DevOps / Elena', completed: false }
    ],
    roadmap60Days: [
      { id: 'R60-1', phase: 'Days 31-60', task: 'Execute gradual 10% canary traffic cutover using Argo Rollouts blue/green pipeline.', criticality: 'high', owner: 'Elena Rostova', completed: false },
      { id: 'R60-2', phase: 'Days 31-60', task: 'Assign permanent ownership for Kafka dead-letter queue rebalance triage alerts.', criticality: 'medium', owner: 'Elena Rostova', completed: false }
    ],
    roadmap90Days: [
      { id: 'R90-1', phase: 'Days 61-90', task: 'Decommission legacy EC2 single-VPC instances and establish automated ADR repository.', criticality: 'low', owner: 'Elena Rostova', completed: false }
    ],
    reviewers: [
      { name: 'Sarah Jenkins', role: 'Project Manager', status: 'approved', signedAt: '2025-10-28T14:20:00.000Z' },
      { name: 'Marcus Chen', role: 'Departing Lead', status: 'approved', signedAt: '2025-10-29T10:15:00.000Z' },
      { name: 'Elena Rostova', role: 'Incoming Lead', status: 'pending', signedAt: null }
    ],
    keyDecisionsCount: 4,
    activeTasksCount: 3,
    criticalRisksCount: 2,
    createdAt: '2025-10-26T12:00:00.000Z'
  });
}

exports.getHandovers = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    const handovers = handoversCol.find(filter);
    res.json({ success: true, count: handovers.length, data: handovers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHandoverById = async (req, res) => {
  try {
    const { id } = req.params;
    const handover = handoversCol.findById(id);
    if (!handover) {
      return res.status(404).json({ success: false, error: 'Handover package not found' });
    }

    const project = projectsCol.findById(handover.projectId);
    const reconstruction = reconstructionsCol.findOne({ projectId: handover.projectId });
    const claims = claimsCol.find({ projectId: handover.projectId });

    res.json({
      success: true,
      data: {
        ...handover,
        project,
        reconstruction,
        evidenceClaims: claims
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPublicHandover = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const handover = handoversCol.findOne({ shareToken });
    if (!handover) {
      return res.status(404).json({ success: false, error: 'Invalid or expired handover share link.' });
    }

    // Check expiration if set
    if (handover.shareExpiresAt && new Date(handover.shareExpiresAt) < new Date()) {
      return res.status(410).json({ success: false, error: 'This handover access link has expired.' });
    }

    const project = projectsCol.findById(handover.projectId);
    const reconstruction = reconstructionsCol.findOne({ projectId: handover.projectId });
    const claims = claimsCol.find({ projectId: handover.projectId });

    res.json({
      success: true,
      data: {
        ...handover,
        project,
        reconstruction,
        evidenceClaims: claims
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateHandover = async (req, res) => {
  try {
    const { projectId, targetRole, departingMember, reviewers, notes } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId is required' });
    }

    const project = projectsCol.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    let rec = reconstructionsCol.findOne({ projectId });
    if (!rec) {
      return res.status(400).json({
        success: false,
        error: 'Please run Knowledge Reconstruction on the project sources before generating a handover package.'
      });
    }

    const handoverPayload = {
      project_name: project.name,
      target_role: targetRole || 'Incoming Lead Engineer',
      reconstruction: {
        summary: rec.summary,
        health_score: rec.healthScore,
        decisions: rec.decisions,
        unfinished_work: rec.unfinishedWork,
        risks: rec.risks,
        unresolved_questions: rec.unresolvedQuestions,
        evidence_claims: rec.evidenceClaims
      },
      reviewers: reviewers || ['Project Manager', departingMember || 'Departing Lead'],
      notes: notes || ''
    };

    const aiRes = await AIBridge.generateHandover(handoverPayload);
    const plan = aiRes.handover || {};

    const shareToken = uuidv4();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90); // 90 days valid

    const newHandover = handoversCol.create({
      projectId,
      projectName: project.name,
      title: plan.title || `Handover: ${project.name} -> ${targetRole}`,
      targetRole: targetRole || 'Incoming Member',
      departingMember: departingMember || 'Departing Member',
      status: 'draft',
      healthScore: plan.health_score || rec.healthScore || 80,
      shareToken,
      shareExpiresAt: expiryDate.toISOString(),
      executiveSummary: plan.executive_summary || rec.summary || '',
      roadmap30Days: plan.roadmap_30_days || [],
      roadmap60Days: plan.roadmap_60_days || [],
      roadmap90Days: plan.roadmap_90_days || [],
      reviewers: (reviewers || ['Project Manager', 'Lead Architect']).map(r => ({
        name: r,
        role: 'Reviewer',
        status: 'pending',
        signedAt: null
      })),
      keyDecisionsCount: (rec.decisions || []).length,
      activeTasksCount: (rec.unfinishedWork || []).length,
      criticalRisksCount: (rec.risks || []).length,
      customNotes: notes || ''
    });

    activitiesCol.create({
      projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Architect',
      action: 'Generated Role-Based Handover',
      details: `Created handover continuation package for ${targetRole}. Status: Draft.`
    });

    res.status(201).json({ success: true, data: newHandover });
  } catch (error) {
    console.error('[Handovers Controller] Generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateHandover = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = handoversCol.findByIdAndUpdate(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Handover package not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body; // 'draft', 'in_review', 'approved', 'rejected'

    const handover = handoversCol.findById(id);
    if (!handover) {
      return res.status(404).json({ success: false, error: 'Handover not found' });
    }

    const reviewers = handover.reviewers || [];
    const currentUserName = req.user?.name || 'Authorized Reviewer';

    // Update reviewer state
    let reviewerFound = false;
    reviewers.forEach(r => {
      if (r.name.toLowerCase() === currentUserName.toLowerCase() || reviewers.length === 1) {
        r.status = status;
        r.signedAt = new Date().toISOString();
        r.comment = comment || '';
        reviewerFound = true;
      }
    });

    if (!reviewerFound) {
      reviewers.push({
        name: currentUserName,
        role: 'Reviewer',
        status,
        signedAt: new Date().toISOString(),
        comment: comment || ''
      });
    }

    const updated = handoversCol.findByIdAndUpdate(id, {
      status,
      reviewers,
      lastApprovedBy: status === 'approved' ? currentUserName : handover.lastApprovedBy,
      lastApprovedAt: status === 'approved' ? new Date().toISOString() : handover.lastApprovedAt
    });

    activitiesCol.create({
      projectId: handover.projectId,
      userId: req.user?.uid || 'user',
      userName: currentUserName,
      action: `Handover Status: ${status.toUpperCase()}`,
      details: `Handover package for ${handover.targetRole} marked as ${status}.`
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
