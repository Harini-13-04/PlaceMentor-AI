import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  full_name: string;
  email: string;
  college: string;
  department: string;
  year: string;
  skills: string[];
  avatar: string;
  bio: string;
  phone: string;
  github: string;
  linkedin: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  college?: string;
  department?: string;
  year?: string;
  skills?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  uploadAvatar: (fileOrUrl: File | string) => Promise<User>;
  removeAvatar: () => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "placementor_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated user using GET /api/auth/me
  const refreshUser = useCallback(async (): Promise<User | null> => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const userData = await apiRequest<User>("/api/auth/me", { token: currentToken });
      setUser(userData);
      return userData;
    } catch (err: any) {
      console.warn("Session restore failed, clearing token:", err.message);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{ access_token: string; token_type: string; user: User }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: RegisterData) => {
    const res = await apiRequest<{ access_token: string; token_type: string; user: User }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    const updated = await apiRequest<User>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    setUser(updated);
    return updated;
  };

  const uploadAvatar = async (fileOrUrl: File | string): Promise<User> => {
    let updated: User;

    if (fileOrUrl instanceof File) {
      const formData = new FormData();
      formData.append("avatar_file", fileOrUrl);
      updated = await apiRequest<User>("/api/users/me/avatar", {
        method: "POST",
        body: formData,
      });
    } else {
      updated = await apiRequest<User>("/api/users/me/avatar", {
        method: "POST",
        body: JSON.stringify({ avatar_url: fileOrUrl }),
      });
    }

    setUser(updated);
    return updated;
  };

  const removeAvatar = async (): Promise<User> => {
    const updated = await apiRequest<User>("/api/users/me/avatar", {
      method: "DELETE",
    });
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await apiRequest("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        removeAvatar,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
