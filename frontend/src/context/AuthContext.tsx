import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "@/config";

export interface User {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  level?: number;
  xp?: number;
  coins?: number;
  department?: string;
  college?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string, department?: string, college?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("pm_token") || localStorage.getItem("placementor_token") || null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("pm_user");
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("pm_token") || localStorage.getItem("placementor_token");
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const authenticatedUser: User = {
            id: userData.id || `u-${Date.now()}`,
            name: userData.name || userData.full_name || userData.email.split("@")[0],
            full_name: userData.full_name || userData.name,
            email: userData.email,
            avatar: userData.avatar || DEMO_AVATAR,
            level: userData.level || 1,
            xp: userData.xp || 100,
            coins: userData.coins || 50,
            department: userData.department || "Computer Science & Engineering",
            college: userData.college || "Placement Candidate",
            role: "SDE Aspirant",
          };
          setUser(authenticatedUser);
          setToken(storedToken);
          localStorage.setItem("pm_user", JSON.stringify(authenticatedUser));
        } else {
          // Token invalid or expired
          logout();
        }
      } catch {
        // Keep existing user if network temporarily unavailable
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("pm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pm_user");
    }
  }, [user]);

  useEffect(() => {
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

      const authenticatedUser: User = {
        id: data.user?.id || `u-${Date.now()}`,
        name: data.user?.name || data.user?.full_name || email.split("@")[0],
        full_name: data.user?.full_name || data.user?.name,
        email: data.user?.email || email,
        avatar: data.user?.avatar || DEMO_AVATAR,
        level: data.user?.level || 1,
        xp: data.user?.xp || 100,
        coins: data.user?.coins || 50,
        department: data.user?.department || "Computer Science & Engineering",
        college: data.user?.college || "Placement Candidate",
        role: "SDE Aspirant",
      };

      const newToken = data.access_token;
      setToken(newToken);
      setUser(authenticatedUser);
      localStorage.setItem("pm_token", newToken);
      localStorage.setItem("placementor_token", newToken);
      localStorage.setItem("pm_user", JSON.stringify(authenticatedUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "Unable to connect to authentication server. Please check your network." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    department?: string,
    college?: string
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
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { success: false, error: data.detail || "Email already registered or invalid details" };
      }

      const newUser: User = {
        id: data.user?.id || `u-${Date.now()}`,
        name: fullName.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        avatar: DEMO_AVATAR,
        level: 1,
        xp: 100,
        coins: 50,
        department: department || "Computer Science & Engineering",
        college: college || "Placement Candidate",
        role: "SDE Aspirant",
      };

      const newToken = data.access_token;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("pm_token", newToken);
      localStorage.setItem("placementor_token", newToken);
      localStorage.setItem("pm_user", JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "Unable to connect to authentication server. Please check your network." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pm_user");
    localStorage.removeItem("pm_token");
    localStorage.removeItem("placementor_token");
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

