import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ProfileEditorPage from './pages/ProfileEditor';
import PagesSectionsPage from './pages/PagesSections';
import ProjectsPage from './pages/Projects';
import SkillsPage from './pages/Skills';
import ExperiencePage from './pages/Experience';
import EducationPage from './pages/Education';
import MediaPage from './pages/Media';
import MessagesPage from './pages/Messages';
import SettingsPage from './pages/Settings';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfileEditorPage />} />
        <Route path="pages" element={<PagesSectionsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
