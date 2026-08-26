import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Communication from "./pages/Communication";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import PlacementReadiness from "./pages/PlacementReadiness";
import Leaderboard from "./pages/Leaderboard";
import WeeklyGoals from "./pages/WeeklyGoals";
import Achievements from "./pages/Achievements";

export { API_URL } from "./config";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/home" replace />
                  </ProtectedRoute>
                }
              />
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
                path="/communication"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Communication />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Safely redirect previous /copilot bookmark to /practice */}
              <Route
                path="/copilot"
                element={
                  <ProtectedRoute>
                    <Navigate to="/practice" replace />
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

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

