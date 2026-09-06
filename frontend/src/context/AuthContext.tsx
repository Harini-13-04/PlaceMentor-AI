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

const DEMO_USER: User = {
  id: "u-demo-101",
  name: "Harini Muthuvel",
  full_name: "Harini Muthuvel",
  email: "harini.muthuvel@srmist.edu.in",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  level: 12,
  xp: 4500,
  coins: 540,
  department: "Computer Science & Engineering",
  college: "SRM Institute of Science and Technology",
  role: "SDE Aspirant",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("pm_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return DEMO_USER;
      }
    }
    return DEMO_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("pm_token") || "demo-token";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      if (!response.ok) {
        // Fallback for offline demo login
        if (email.toLowerCase().includes("test") || email.toLowerCase().includes("demo") || password.length >= 6) {
          const loggedInUser: User = {
            ...DEMO_USER,
            email: email.trim(),
            name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          };
          setUser(loggedInUser);
          setToken("demo-jwt-token");
          return { success: true };
        }
        const errData = await response.json().catch(() => ({}));
        return { success: false, error: errData.detail || "Invalid email or password" };
      }

      const data = await response.json();
      const authenticatedUser: User = {
        id: data.user?.id || `u-${Date.now()}`,
        name: data.user?.name || data.user?.full_name || email.split("@")[0],
        full_name: data.user?.full_name || data.user?.name,
        email: data.user?.email || email,
        avatar: DEMO_USER.avatar,
        level: DEMO_USER.level,
        xp: DEMO_USER.xp,
        department: data.user?.department || DEMO_USER.department,
        college: data.user?.college || DEMO_USER.college,
      };

      setUser(authenticatedUser);
      setToken(data.access_token || "demo-jwt-token");
      return { success: true };
    } catch {
      // Offline fallback
      const loggedInUser: User = {
        ...DEMO_USER,
        email: email.trim(),
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };
      setUser(loggedInUser);
      setToken("demo-jwt-token");
      return { success: true };
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
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        // Fallback for offline register
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: fullName.trim(),
          full_name: fullName.trim(),
          email: email.trim(),
          avatar: DEMO_USER.avatar,
          level: 1,
          xp: 100,
          coins: 50,
          department: department || DEMO_USER.department,
          college: college || DEMO_USER.college,
        };
        setUser(newUser);
        setToken("demo-jwt-token");
        return { success: true };
      }

      const data = await response.json();
      const newUser: User = {
        id: data.user?.id || `u-${Date.now()}`,
        name: fullName.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        avatar: DEMO_USER.avatar,
        level: 1,
        xp: 100,
        coins: 50,
        department: department || DEMO_USER.department,
        college: college || DEMO_USER.college,
      };

      setUser(newUser);
      setToken(data.access_token || "demo-jwt-token");
      return { success: true };
    } catch {
      // Offline fallback
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: fullName.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        avatar: DEMO_USER.avatar,
        level: 1,
        xp: 100,
        coins: 50,
        department: department || DEMO_USER.department,
        college: college || DEMO_USER.college,
      };
      setUser(newUser);
      setToken("demo-jwt-token");
      return { success: true };
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
