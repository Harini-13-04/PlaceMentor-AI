import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL, getAuthToken, setAuthToken, getAuthUser, setAuthUser } from "@/config";

export interface User {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  banner_image?: string;
  level?: number;
  xp?: number;
  coins?: number;
  department?: string;
  college?: string;
  year?: string;
  role?: string;
  gender?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  dob?: string;
  target_role?: string;
  target_company?: string;
  skills?: string[];
  preferred_languages?: string[];
  programming_level?: string;
  dsa_level?: string;
  aptitude_level?: string;
  core_cs_level?: string;
}

export const mapAuthUserData = (userData: any): User => ({
  id: userData.id || "",
  name: userData.name || userData.full_name || userData.email?.split("@")[0] || "Student",
  full_name: userData.full_name || userData.name || "",
  email: userData.email || "",
  avatar: userData.avatar || "",
  banner_image: userData.banner_image || "",
  level: userData.level || 1,
  xp: userData.xp || 0,
  coins: userData.coins || 0,
  department: userData.department || "",
  college: userData.college || "",
  year: userData.year || "",
  role: userData.target_role || "SDE Aspirant",
  gender: userData.gender || "",
  bio: userData.bio || "",
  phone: userData.phone || "",
  location: userData.location || "",
  website: userData.website || "",
  github: userData.github || "",
  linkedin: userData.linkedin || "",
  dob: userData.dob || "",
  target_role: userData.target_role || "",
  target_company: userData.target_company || "",
  skills: Array.isArray(userData.skills) ? userData.skills : [],
  preferred_languages: Array.isArray(userData.preferred_languages) ? userData.preferred_languages : [],
  programming_level: userData.programming_level || "",
  dsa_level: userData.dsa_level || "",
  aptitude_level: userData.aptitude_level || "",
  core_cs_level: userData.core_cs_level || "",
});

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    fullName: string,
    email: string,
    password: string,
    department?: string,
    college?: string,
    gender?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return getAuthToken();
  });

  const [user, setUser] = useState<User | null>(() => {
    return getAuthUser();
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate active token with /api/auth/me on mount or token change
  useEffect(() => {
    const validateSession = async () => {
      const activeToken = token || getAuthToken();
      if (!activeToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const authenticatedUser = mapAuthUserData(userData);
          setUser(authenticatedUser);
          setAuthUser(authenticatedUser);
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (err) {
        console.warn("Session verification network issue:", err);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [token]);

  useEffect(() => {
    setAuthUser(user);
    if (user) {
      localStorage.setItem("pm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pm_user");
    }
  }, [user]);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("pm_token", token);
      localStorage.setItem("placementor_token", token);
    } else {
      localStorage.removeItem("pm_token");
      localStorage.removeItem("placementor_token");
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { success: false, error: data.detail || "Invalid email or password" };
      }

      const receivedToken = data.access_token || data.token;
      if (!receivedToken) {
        return { success: false, error: "Authentication failed: No access token received" };
      }

      const authenticatedUser = mapAuthUserData(data.user || {});
      setUser(authenticatedUser);
      setToken(receivedToken);
      setAuthUser(authenticatedUser);
      setAuthToken(receivedToken);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "Unable to connect to authentication server. Please check your network and try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { success: false, error: data.detail || "Google authentication failed" };
      }

      const authenticatedUser: User = {
        id: data.user?.id || `u-${Date.now()}`,
        name: data.user?.name || data.user?.full_name || "Google User",
        full_name: data.user?.full_name || data.user?.name,
        email: data.user?.email || "",
        avatar: data.user?.avatar || DEMO_AVATAR,
        level: data.user?.level || 1,
        xp: data.user?.xp || 100,
        coins: data.user?.coins || 50,
        department: data.user?.department || "Computer Science & Engineering",
        college: data.user?.college || "Placement Candidate",
        role: "SDE Aspirant",
        gender: data.user?.gender || "",
      };

      const receivedToken = data.access_token || data.token || "demo-jwt-token";
      setUser(authenticatedUser);
      setToken(receivedToken);
      setAuthUser(authenticatedUser);
      setAuthToken(receivedToken);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to connect to authentication server" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    department?: string,
    college?: string,
    gender?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          department: department || "",
          college: college || "",
          gender: gender || "",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { success: false, error: data.detail || "Email already registered or invalid registration details" };
      }

      const newUser = mapAuthUserData(data.user || {});
      const receivedToken = data.access_token || data.token;
      if (!receivedToken) {
        return { success: false, error: "Registration succeeded but no access token was returned" };
      }

      setUser(newUser);
      setToken(receivedToken);
      setAuthUser(newUser);
      setAuthToken(receivedToken);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "Unable to connect to registration server. Please check your network and try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthUser(null);
    setAuthToken(null);
    localStorage.removeItem("pm_token");
    localStorage.removeItem("placementor_token");
    localStorage.removeItem("pm_user");
    localStorage.removeItem("placementor_auth_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

