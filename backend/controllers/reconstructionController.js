/**
 * AI Knowledge Reconstruction Controller for KnowBridge AI
 * Orchestrates multi-source ingestion into Google Gemini / Python AI Engine.
 * Extracts Decisions, Unfinished Work, Ownership, Dependencies, Risks, Next Actions,
 * and Unresolved Questions ("Insufficient Evidence").
 * Persists Evidence Claims for 1-click verification.
 */

const { localDB } = require('../config/db');
const AIBridge = require('../services/aiBridge');

const projectsCol = localDB.getCollection('projects');
const sourcesCol = localDB.getCollection('sources');
const reconstructionsCol = localDB.getCollection('reconstructions');
const claimsCol = localDB.getCollection('evidenceClaims');
const activitiesCol = localDB.getCollection('activities');

exports.triggerReconstruction = async (req, res) => {
  try {
    const { projectId, targetRole, departingMember, customApiKey } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId is required' });
    }

    const project = projectsCol.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const sources = sourcesCol.find({ projectId });
    if (!sources || sources.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No authorized sources connected to this project. Please connect at least one document, meeting note, or GitHub repository first.'
      });
    }

    // Format sources payload
    const formattedSources = sources.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      content: s.content || '',
      metadata: s.metadata || {},
      sections: s.sections || []
    }));

    const payload = {
      project_id: projectId,
      project_name: project.name,
      project_description: project.description,
      sources: formattedSources,
      target_role: targetRole || 'Incoming Lead Engineer',
      departing_member: departingMember || (project.members && project.members[1] ? project.members[1].name : 'Departing Member'),
      gemini_api_key: customApiKey || process.env.GEMINI_API_KEY || null
    };

    // Call Python FastAPI + Gemini AI Engine
    const result = await AIBridge.reconstructKnowledge(payload, payload.gemini_api_key);
    const recData = result.reconstruction || {};

    // Remove older reconstruction for this project if replacing
    reconstructionsCol.deleteMany({ projectId });

    const savedRec = reconstructionsCol.create({
      projectId,
      projectName: project.name,
      targetRole: payload.target_role,
      departingMember: payload.departing_member,
      healthScore: recData.health_score || 80,
      summary: recData.summary || '',
      decisions: recData.decisions || [],
      unfinishedWork: recData.unfinished_work || [],
      ownership: recData.ownership || [],
      dependencies: recData.dependencies || [],
      risks: recData.risks || [],
      nextActions: recData.next_actions || [],
      unresolvedQuestions: recData.unresolved_questions || [],
      evidenceClaims: recData.evidence_claims || [],
      stats: recData.stats || {},
      engineUsed: recData.engine_used || 'KnowBridge Hybrid Engine',
      createdAt: new Date().toISOString()
    });

    // Sync Evidence Claims collection
    // Remove previous claims for this project
    claimsCol.deleteMany({ projectId });
    if (recData.evidence_claims && Array.isArray(recData.evidence_claims)) {
      recData.evidence_claims.forEach(c => {
        claimsCol.create({
          projectId,
          claimId: c.claim_id,
          claimText: c.claim_text,
          claimCategory: c.claim_category,
          sourceId: c.source_id,
          sourceName: c.source_name,
          documentReference: c.document_reference,
          pageOrSection: c.page_or_section,
          relevantExcerpt: c.relevant_excerpt,
          confidenceScore: c.confidence_score || 0.9,
          verificationStatus: c.verification_status || 'unverified',
          lastVerifiedDate: c.last_verified_date || null
        });
      });
    }

    activitiesCol.create({
      projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Architect',
      action: 'Executed Knowledge Reconstruction',
      details: `Reconstructed project state across ${sources.length} sources. Health Score: ${savedRec.healthScore}%. Engine: ${savedRec.engineUsed}.`
    });

    res.json({
      success: true,
      message: 'Knowledge reconstruction completed successfully',
      data: savedRec
    });
  } catch (error) {
    console.error('[Reconstruction Controller] Reconstruction error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLatestReconstruction = async (req, res) => {
  try {
    const { projectId } = req.params;
    const rec = reconstructionsCol.findOne({ projectId });
    if (!rec) {
      return res.json({ success: true, data: null, message: 'No reconstruction executed yet for this project.' });
    }
    res.json({ success: true, data: rec });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
