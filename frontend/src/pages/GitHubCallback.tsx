import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGitHub } = useAuth();

  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      setStatus("error");
      setErrorMessage(errorDescription || "GitHub authorization was cancelled or failed.");
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received from GitHub.");
      return;
    }

    let isMounted = true;

    const exchangeCode = async () => {
      try {
        const res = await loginWithGitHub(code);
        if (!isMounted) return;

        if (res.success) {
          setStatus("success");
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 1200);
        } else {
          setStatus("error");
          setErrorMessage(res.error || "Failed to authenticate with GitHub.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(err?.message || "An unexpected error occurred during GitHub login.");
      }
    };

    exchangeCode();

    return () => {
      isMounted = false;
    };
  }, [searchParams, loginWithGitHub, navigate]);

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#141728] border border-slate-800 shadow-2xl text-center space-y-6">
        
        {/* GitHub Logo Header */}
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </div>

        {status === "processing" && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-purple-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-base font-semibold">Authenticating with GitHub...</span>
            </div>
            <p className="text-xs text-slate-400">
              Securely validating your GitHub credentials and loading your PlaceMentor profile.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-base font-semibold">Authentication Successful!</span>
            </div>
            <p className="text-xs text-slate-400">
              Redirecting you to your placement dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 text-left">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            
            <Link
              to="/login"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Return to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
