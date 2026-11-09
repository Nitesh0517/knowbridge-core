/**
 * Evidence-Linked Knowledge Controller for KnowBridge AI
 * Provides source traceability, verification flags, and verbatim text citation auditing.
 */

const { localDB } = require('../config/db');

const claimsCol = localDB.getCollection('evidenceClaims');
const sourcesCol = localDB.getCollection('sources');
const activitiesCol = localDB.getCollection('activities');

exports.getClaims = async (req, res) => {
  try {
    const { projectId, category, status, search } = req.query;
    let claims = claimsCol.find(projectId ? { projectId } : {});

    if (category && category !== 'all') {
      claims = claims.filter(c => c.claimCategory === category);
    }

    if (status && status !== 'all') {
      claims = claims.filter(c => c.verificationStatus === status);
    }

    if (search) {
      const q = search.toLowerCase();
      claims = claims.filter(c =>
        c.claimText.toLowerCase().includes(q) ||
        c.sourceName.toLowerCase().includes(q) ||
        (c.relevantExcerpt && c.relevantExcerpt.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = claimsCol.findById(id);
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Evidence claim not found' });
    }

    // Include source document details
    const source = sourcesCol.findById(claim.sourceId);

    res.json({
      success: true,
      data: {
        ...claim,
        source
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // 'verified', 'flagged', 'unverified'

    if (!['verified', 'flagged', 'unverified'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be verified, flagged, or unverified' });
    }

    const updated = claimsCol.findByIdAndUpdate(id, {
      verificationStatus: status,
      verifiedBy: req.user?.name || 'Human Verifier',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      verifierNotes: notes || null
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Evidence claim not found' });
    }

    activitiesCol.create({
      projectId: updated.projectId,
      userId: req.user?.uid || 'user',
      userName: req.user?.name || 'Human Verifier',
      action: `Claim ${status === 'verified' ? 'Verified' : 'Flagged'}`,
      details: `Claim [${updated.claimId}] was marked as ${status}.`
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
