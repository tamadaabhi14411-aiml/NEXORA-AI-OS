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
import ExploreProjectsPage from "../pages/ExploreProjectsPage";
import PuterAITest from "../pages/PuterAITest";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Protected Resume AI */}
        <Route
          path="/career/resume-ai"
          element={
            <ProtectedRoute>
              <ResumeAI />
            </ProtectedRoute>
          }
        />

        {/* Protected User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Community */}
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Projects */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ExploreProjectsPage />
            </ProtectedRoute>
          }
        />

        {/* Temporary Puter AI Test */}
        <Route
          path="/test-puter"
          element={<PuterAITest />}
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;