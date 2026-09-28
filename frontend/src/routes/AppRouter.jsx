import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import Chat from "../pages/chat/Chat";
import ResumeAI from "../pages/career/ResumeAI";
import UserProfilePage from "../pages/UserProfilePage";

import CommunityPage from "../pages/CommunityPage";
import CommunityDetailsPage from "../pages/CommunityDetailsPage";

import SkillFeedPage from "../pages/SkillFeedPage";

import ExploreProjectsPage from "../pages/ExploreProjectsPage";
import CreateProjectPage from "../pages/CreateProjectPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Core Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/career/resume-ai"
          element={
            <ProtectedRoute>
              <ResumeAI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Skill Feed */}
        <Route
          path="/skills/feed"
          element={
            <ProtectedRoute>
              <SkillFeedPage />
            </ProtectedRoute>
          }
        />

        {/* Communities */}
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/:communityId"
          element={
            <ProtectedRoute>
              <CommunityDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Collaborative Projects */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ExploreProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/create"
          element={
            <ProtectedRoute>
              <CreateProjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
