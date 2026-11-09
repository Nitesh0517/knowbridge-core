/**
 * Consolidated API Router for KnowBridge AI
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { verifyToken } = require('../middleware/auth');
const projects = require('../controllers/projectsController');
const sources = require('../controllers/sourcesController');
const reconstruction = require('../controllers/reconstructionController');
const evidence = require('../controllers/evidenceController');
const handovers = require('../controllers/handoversController');
const analytics = require('../controllers/analyticsController');
const { localDB } = require('../config/db');

const router = express.Router();

// Multer storage setup for uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit
});

// PUBLIC ROUTES (No auth required)
router.get('/handovers/public/:shareToken', handovers.getPublicHandover);

// AUTH SYNC ROUTE
router.post('/auth/sync-user', verifyToken, (req, res) => {
  const usersCol = localDB.getCollection('users');
  let user = usersCol.findOne({ uid: req.user.uid });
  if (!user) {
    user = usersCol.create({
      uid: req.user.uid,
      email: req.user.email,
      name: req.body.displayName || req.user.name,
      photoURL: req.body.photoURL || null,
      organization: req.body.organization || 'KnowBridge Workspace',
      role: req.body.role || 'Lead Engineer'
    });
  } else {
    user = usersCol.findByIdAndUpdate(user.id, {
      name: req.body.displayName || user.name,
      photoURL: req.body.photoURL || user.photoURL,
      organization: req.body.organization || user.organization
    });
  }
  res.json({ success: true, user });
});

// PROTECTED ROUTES (Require valid Firebase token or local dev session)
router.use(verifyToken);

// PROJECTS
router.get('/projects', projects.getProjects);
router.post('/projects', projects.createProject);
router.get('/projects/:id', projects.getProjectById);
router.put('/projects/:id', projects.updateProject);
router.delete('/projects/:id', projects.deleteProject);
router.post('/projects/:id/members', projects.addMember);

// SOURCES
router.get('/sources', sources.getSources);
router.get('/sources/:id', sources.getSourceById);
router.post('/sources/upload', upload.single('file'), sources.uploadDocument);
router.post('/sources/meeting', sources.createMeetingNote);
router.post('/sources/decision', sources.createDecisionLog);
router.post('/sources/github', sources.connectGitHub);
router.delete('/sources/:id', sources.deleteSource);

// RECONSTRUCTION
router.post('/reconstruction/trigger', reconstruction.triggerReconstruction);
router.get('/reconstruction/project/:projectId', reconstruction.getLatestReconstruction);

// EVIDENCE
router.get('/evidence', evidence.getClaims);
router.get('/evidence/:id', evidence.getClaimById);
router.put('/evidence/:id/verify', evidence.verifyClaim);

// HANDOVERS
router.get('/handovers', handovers.getHandovers);
router.post('/handovers/generate', handovers.generateHandover);
router.get('/handovers/:id', handovers.getHandoverById);
router.put('/handovers/:id', handovers.updateHandover);
router.put('/handovers/:id/status', handovers.updateStatus);

// ANALYTICS & STATS
router.get('/analytics/stats', analytics.getGlobalStats);

module.exports = router;
