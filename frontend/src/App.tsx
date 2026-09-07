import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Aptitude from "./pages/Aptitude";
import Communication from "./pages/Communication";
import Resume from "./pages/Resume";
import PlacementReadiness from "./pages/PlacementReadiness";
import BrainZone from "./pages/BrainZone";
import Quizee from "./pages/Quizee";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import WeeklyGoals from "./pages/WeeklyGoals";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

export { API_URL } from "./config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Entry & Authentication Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dedicated Full-Screen Onboarding Route (No Layout/Dashboard behind it) */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              {/* Protected Application Core Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Home />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Practice />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/:problemId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Practice />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aptitude"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Aptitude />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/communication"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Communication />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Resume />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-readiness"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PlacementReadiness />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/brain-zone"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BrainZone />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizee"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Quizee />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Leaderboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/weekly-goals"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <WeeklyGoals />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Achievements />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Recommendations />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Legacy Aliases and Redirects */}
              <Route path="/quiz" element={<Navigate to="/quizee" replace />} />
              <Route path="/readiness" element={<Navigate to="/placement-readiness" replace />} />
              <Route path="/copilot" element={<Navigate to="/practice" replace />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
