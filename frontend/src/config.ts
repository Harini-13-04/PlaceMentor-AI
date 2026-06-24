// Central config — DO NOT modify this file.
// API_URL is empty in dev (Vite proxy handles /api/* → FastAPI).
// In production it is injected automatically via VITE_BACKEND_URL.
export const API_URL = (import.meta as any).env?.VITE_BACKEND_URL || "";
