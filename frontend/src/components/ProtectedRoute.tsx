import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0a14] text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h3 className="font-semibold text-lg tracking-tight text-white">PlaceMentor AI</h3>
            <p className="text-xs text-muted-foreground animate-pulse">Restoring your session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
