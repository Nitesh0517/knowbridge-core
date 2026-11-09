import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsApi, reconstructionApi } from '../services/api';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [reconstruction, setReconstruction] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      const list = res.data.data || [];
      setProjects(list);

      // Select stored or first project
      const savedProjectId = localStorage.getItem('knowbridge_active_project_id');
      const found = list.find(p => p.id === savedProjectId);
      if (found) {
        setActiveProject(found);
      } else if (list.length > 0) {
        setActiveProject(list[0]);
        localStorage.setItem('knowbridge_active_project_id', list[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // When activeProject changes, fetch latest reconstruction
  useEffect(() => {
    if (activeProject?.id) {
      localStorage.setItem('knowbridge_active_project_id', activeProject.id);
      loadReconstruction(activeProject.id);
    }
  }, [activeProject?.id]);

  const loadReconstruction = async (projectId) => {
    try {
      const res = await reconstructionApi.getLatest(projectId);
      setReconstruction(res.data.data || null);
    } catch (err) {
      console.warn('Could not load reconstruction for project:', err.message);
      setReconstruction(null);
    }
  };

  const switchProject = (project) => {
    setActiveProject(project);
  };

  const refreshActiveProject = async () => {
    if (!activeProject?.id) return;
    try {
      const res = await projectsApi.getById(activeProject.id);
      if (res.data.data) {
        setActiveProject(res.data.data);
      }
      await loadReconstruction(activeProject.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      reconstruction,
      loading,
      loadProjects,
      switchProject,
      refreshActiveProject,
      setReconstruction
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
