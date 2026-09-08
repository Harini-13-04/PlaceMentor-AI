import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = "1009934034032-1o0fi6dtrkbtsh9u5dml93iui3sptghc.apps.googleusercontent.com";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  mode?: "signin" | "signup";
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  mode = "signin",
  className = "",
}) => {
  const { loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [gisLoaded, setGisLoaded] = useState(false);

  const handleCredentialResponse = async (response: { credential: string }) => {
    if (!response?.credential) {
      onError?.("No credential received from Google.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await loginWithGoogle(response.credential);
      if (res.success) {
        onSuccess?.();
      } else {
        onError?.(res.error || "Google sign-in failed.");
      }
    } catch (err: any) {
      onError?.(err?.message || "An unexpected error occurred during Google sign-in.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const initGis = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            cancel_on_tap_outside: true,
          });

          if (buttonRef.current) {
            buttonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(buttonRef.current, {
              type: "standard",
              theme: theme === "dark" ? "filled_black" : "outline",
              size: "medium",
              text: mode === "signup" ? "signup_with" : "signin_with",
              shape: "rectangular",
              logo_alignment: "left",
              width: buttonRef.current.offsetWidth || 200,
            });
          }
          setGisLoaded(true);
        } catch (err) {
          console.error("Failed to initialize Google Identity Services:", err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGis();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGis();
        }
      }, 100);
      const timeout = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [theme, mode]);

  const handleFallbackClick = () => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.prompt();
      } catch {
        onError?.("Google authentication popup could not be opened. Please ensure popups are allowed.");
      }
    } else {
      onError?.("Google Sign-In is initializing. Please wait a moment and try again.");
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Official GIS Render Container */}
      <div
        ref={buttonRef}
        className={`w-full flex justify-center items-center ${isProcessing ? "opacity-40 pointer-events-none" : ""}`}
        style={{ minHeight: "36px" }}
      />

      {/* Fallback custom button if GIS hasn't rendered into DOM yet */}
      {!gisLoaded && (
        <button
          type="button"
          onClick={handleFallbackClick}
          disabled={isProcessing}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#141728]/60 hover:bg-slate-100 dark:hover:bg-[#1a1e34] text-slate-800 dark:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
        </button>
      )}

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-[#101322]/60 rounded-xl backdrop-blur-xs">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
        </div>
      )}
    </div>
  );
};
