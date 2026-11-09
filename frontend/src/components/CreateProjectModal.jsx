import React, { useState } from 'react';
import { X, FolderPlus, Building, Calendar, Shield, User } from 'lucide-react';
import { projectsApi } from '../services/api';
import { useProject } from '../context/ProjectContext';

export default function CreateProjectModal({ isOpen, onClose }) {
  const { loadProjects, switchProject } = useProject();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organization: 'FinTech Dynamics Corp',
    category: 'Cloud Engineering & DevOps',
    projectManager: 'Sarah Jenkins',
    startDate: new Date().toISOString().split('T')[0],
    status: 'In Progress',
    accessLevel: 'Internal Team'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await projectsApi.create(formData);
      if (res.data.success) {
        await loadProjects();
        switchProject(res.data.data);
        onClose();
      }
    } catch (err) {
      alert('Failed to create project: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyanBrand-500/20 text-cyanBrand-400 flex items-center justify-center border border-cyanBrand-400/30">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Create New Project Workspace</h2>
              <p className="text-xs text-slate-300">Isolate project sources, claims, decisions and handovers.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Falcon Real-Time Clearing Engine"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Summary of project goals, microservices, and transition scope..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="FinTech Dynamics Corp"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Cloud Engineering & DevOps</option>
                <option>AI / Machine Learning</option>
                <option>Full-Stack Web App</option>
                <option>Financial Infrastructure</option>
                <option>Research & Data Science</option>
                <option>Student / Volunteer Project</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Project Manager / Lead</label>
              <input
                type="text"
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
                placeholder="Sarah Jenkins"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Project Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>In Transition / Handover</option>
                <option>Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Access Level</label>
              <select
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Internal Team</option>
                <option>Restricted</option>
                <option>Confidential</option>
              </select>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-royal-600 to-navy-800 hover:from-royal-500 hover:to-navy-700 text-white font-bold shadow-soft-sm hover:shadow-glow-royal transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating Workspace...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
