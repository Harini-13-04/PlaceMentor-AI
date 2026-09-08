import React, { useState } from "react";
import { GITHUB_CLIENT_ID } from "@/config";
import { Loader2 } from "lucide-react";

interface GitHubSignInButtonProps {
  mode?: "signin" | "signup";
  onError?: (error: string) => void;
  className?: string;
}

export const GitHubSignInButton: React.FC<GitHubSignInButtonProps> = ({
  mode = "signin",
  onError,
  className = "",
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    const clientId = GITHUB_CLIENT_ID || (window as any).__GITHUB_CLIENT_ID__;
    if (!clientId || clientId.startsWith("Ov23liXXXX")) {
      onError?.("GitHub OAuth is ready! Please configure GITHUB_CLIENT_ID in backend/.env to connect your GitHub App.");
      return;
    }

    setIsRedirecting(true);
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = "read:user user:email";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRedirecting}
      className={`w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728]/60 hover:bg-slate-100 dark:hover:bg-[#1a1e34] text-slate-800 dark:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${className}`}
    >
      {isRedirecting ? (
        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
      ) : (
        <svg className="w-4 h-4 shrink-0 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )}
      <span>{mode === "signup" ? "GitHub" : "GitHub"}</span>
    </button>
  );
};
