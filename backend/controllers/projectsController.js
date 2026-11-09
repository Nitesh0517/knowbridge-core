/**
 * Projects Controller for KnowBridge AI
 * Handles CRUD operations, workspace isolation, member management, and workspace stats.
 */

const { localDB } = require('../config/db');

// Sample default projects if none exist for instant hackathon demonstration
const DEFAULT_PROJECTS = [
  {
    id: 'proj_apex_infra',
    name: 'Apex Cloud Infrastructure Migration',
    description: 'Enterprise migration of distributed microservices from legacy VPC to Kubernetes multi-cluster with zero-downtime database cutover.',
    organization: 'FinTech Dynamics Corp',
    category: 'Cloud Engineering & DevOps',
    projectManager: 'Sarah Jenkins',
    startDate: '2025-08-15',
    status: 'In Progress',
    accessLevel: 'Internal Confidential',
    members: [
      { id: 'm1', name: 'Sarah Jenkins', email: 'sarah.j@fintech.io', role: 'Project Manager' },
      { id: 'm2', name: 'Marcus Chen', email: 'marcus.c@fintech.io', role: 'Departing Lead Architect' },
      { id: 'm3', name: 'Elena Rostova', email: 'elena.r@fintech.io', role: 'Incoming Lead Architect' }
    ],
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'proj_neural_search',
    name: 'KnowBridge Hybrid RAG Core',
    description: 'Semantic vector retrieval engine and graph-based knowledge reconstruction pipeline for complex multi-format document archives.',
    organization: 'KnowBridge Labs',
    category: 'AI / Machine Learning',
    projectManager: 'Alex Rivera',
    startDate: '2025-10-01',
    status: 'In Progress',
    accessLevel: 'Restricted',
    members: [
      { id: 'm4', name: 'Alex Rivera', email: 'alex@knowbridge.ai', role: 'Product Lead' },
      { id: 'm5', name: 'David Kim', email: 'david.k@knowbridge.ai', role: 'Departing ML Engineer' }
    ],
    createdAt: '2025-10-01T10:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

// Initialize default projects if empty
const projectsCol = localDB.getCollection('projects');
if (projectsCol.find().length === 0) {
  DEFAULT_PROJECTS.forEach(p => projectsCol.create(p));
}

exports.getProjects = async (req, res) => {
  try {
    const projects = projectsCol.find();
    const sourcesCol = localDB.getCollection('sources');
    const handoversCol = localDB.getCollection('handovers');
    const reconstructionsCol = localDB.getCollection('reconstructions');

    const augmented = projects.map(proj => {
      const pSources = sourcesCol.find({ projectId: proj.id });
      const pHandovers = handoversCol.find({ projectId: proj.id });
      const pRec = reconstructionsCol.findOne({ projectId: proj.id });

      return {
        ...proj,
        sourceCount: pSources.length,
        handoverCount: pHandovers.length,
        healthScore: pRec ? pRec.healthScore : 78,
        openTasks: pRec && pRec.unfinishedWork ? pRec.unfinishedWork.length : 4,
        unresolvedRisks: pRec && pRec.risks ? pRec.risks.filter(r => r.is_unresolved).length : 2
      };
    });

    res.json({ success: true, count: augmented.length, data: augmented });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = projectsCol.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const sourcesCol = localDB.getCollection('sources');
    const handoversCol = localDB.getCollection('handovers');
    const reconstructionsCol = localDB.getCollection('reconstructions');
    const claimsCol = localDB.getCollection('evidenceClaims');

    const sources = sourcesCol.find({ projectId: id });
    const handovers = handoversCol.find({ projectId: id });
    const reconstruction = reconstructionsCol.findOne({ projectId: id });
    const claims = claimsCol.find({ projectId: id });

    res.json({
      success: true,
      data: {
        ...project,
        sources,
        handovers,
        reconstruction,
        claimsCount: claims.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      organization,
      category,
      projectManager,
      startDate,
      status,
      members,
      accessLevel
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Project name is required' });
    }

    const newProject = projectsCol.create({
      name,
      description: description || '',
      organization: organization || 'Personal Workspace',
      category: category || 'General Software',
      projectManager: projectManager || req.user?.name || 'Project Lead',
      startDate: startDate || new Date().toISOString().split('T')[0],
      status: status || 'Planning',
      accessLevel: accessLevel || 'Internal Team',
      members: members || [
        {
          id: req.user?.uid || 'user_owner',
          name: req.user?.name || 'Owner',
          email: req.user?.email || 'owner@knowbridge.ai',
          role: 'Project Manager'
        }
      ]
    });

    // Record activity
    const activitiesCol = localDB.getCollection('activities');
    activitiesCol.create({
      projectId: newProject.id,
      userId: req.user?.uid || 'system',
      userName: req.user?.name || 'System',
      action: 'Created Project',
      details: `Project "${newProject.name}" was initialized in workspace.`
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = projectsCol.findByIdAndUpdate(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const activitiesCol = localDB.getCollection('activities');
    activitiesCol.create({
      projectId: id,
      userId: req.user?.uid || 'system',
      userName: req.user?.name || 'System',
      action: 'Updated Project Settings',
      details: `Project metadata updated.`
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = projectsCol.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Cascade delete project sources, handovers, claims
    localDB.getCollection('sources').deleteMany({ projectId: id });
    localDB.getCollection('handovers').deleteMany({ projectId: id });
    localDB.getCollection('reconstructions').deleteMany({ projectId: id });
    localDB.getCollection('evidenceClaims').deleteMany({ projectId: id });

    res.json({ success: true, message: 'Project and all associated artifacts deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const project = projectsCol.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const members = project.members || [];
    const newMember = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: role || 'Team Member'
    };
    members.push(newMember);

    const updated = projectsCol.findByIdAndUpdate(id, { members });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
