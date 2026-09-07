// Central config — DO NOT modify this file.
// API_URL is empty in dev (Vite proxy handles /api/* → FastAPI).
// In production it is injected automatically via VITE_BACKEND_URL.
export const API_URL = import.meta.env?.VITE_BACKEND_URL || "";

// Canonical storage keys
export const CANONICAL_TOKEN_KEY = "access_token";
export const CANONICAL_USER_KEY = "user";

/**
 * Single canonical API for retrieving the authenticated user's JWT token.
 * Reads the canonical key with fallback to legacy keys for backward compatibility.
 */
export function getAuthToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return (
    localStorage.getItem(CANONICAL_TOKEN_KEY) ||
    localStorage.getItem("pm_token") ||
    localStorage.getItem("placementor_token") ||
    localStorage.getItem("token") ||
    null
  );
}

/**
 * Returns Authorization headers with Bearer token if present.
 */
export function getAuthHeaders(contentType: boolean = true): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Sets the canonical token in localStorage (and syncs legacy keys for safe fallback).
 */
export function setAuthToken(token: string | null): void {
  if (typeof localStorage === "undefined") return;
  if (token) {
    localStorage.setItem(CANONICAL_TOKEN_KEY, token);
    localStorage.setItem("pm_token", token);
    localStorage.setItem("placementor_token", token);
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem(CANONICAL_TOKEN_KEY);
    localStorage.removeItem("pm_token");
    localStorage.removeItem("placementor_token");
    localStorage.removeItem("token");
  }
}

/**
 * Gets the current stored user object.
 */
export function getAuthUser(): any | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(CANONICAL_USER_KEY) || localStorage.getItem("pm_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Sets the current stored user object.
 */
export function setAuthUser(user: any | null): void {
  if (typeof localStorage === "undefined") return;
  if (user) {
    const raw = JSON.stringify(user);
    localStorage.setItem(CANONICAL_USER_KEY, raw);
    localStorage.setItem("pm_user", raw);
  } else {
    localStorage.removeItem(CANONICAL_USER_KEY);
    localStorage.removeItem("pm_user");
  }
}


