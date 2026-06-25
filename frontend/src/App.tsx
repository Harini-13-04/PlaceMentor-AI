import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Communication from "./pages/Communication";
import AICopilot from "./pages/AICopilot";
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
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/copilot" element={<AICopilot />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/placement-readiness" element={<PlacementReadiness />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/weekly-goals" element={<WeeklyGoals />} />
            <Route path="/achievements" element={<Achievements />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
