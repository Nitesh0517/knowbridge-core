import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateProjectModal from './components/CreateProjectModal';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Sources from './pages/Sources';
import Reconstruction from './pages/Reconstruction';
import Evidence from './pages/Evidence';
import Timeline from './pages/Timeline';
import Tasks from './pages/Tasks';
import Risks from './pages/Risks';
import HandoverGenerate from './pages/HandoverGenerate';
import Handovers from './pages/Handovers';
import HandoverDetail from './pages/HandoverDetail';
import Approvals from './pages/Approvals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PublicHandoverView from './pages/PublicHandoverView';

// Protected Dashboard Layout Component
function DashboardLayout() {
  const { user, loading } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-300 text-xs font-mono">
        Authenticating KnowBridge Enterprise Session...
      </div>
    );
  }

  // Allow test user session or redirect
  if (!user && !localStorage.getItem('knowbridge_token')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-surface-bg overflow-hidden font-sans">
      {/* Enterprise Sidebar */}
      <Sidebar onCreateProjectClick={() => setCreateModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onCreateProjectClick={() => setCreateModalOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/handover/view/:shareToken" element={<PublicHandoverView />} />

            {/* Authenticated Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="sources" element={<Sources />} />
              <Route path="reconstruction" element={<Reconstruction />} />
              <Route path="evidence" element={<Evidence />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="risks" element={<Risks />} />
              <Route path="handover/generate" element={<HandoverGenerate />} />
              <Route path="handovers" element={<Handovers />} />
              <Route path="handovers/:id" element={<HandoverDetail />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}
