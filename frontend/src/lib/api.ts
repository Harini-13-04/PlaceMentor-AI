import { API_URL } from "../config";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...restOptions } = options;

  const storedToken =
    token !== undefined
      ? token
      : localStorage.getItem("pm_token") || localStorage.getItem("placementor_token");

  const headers: HeadersInit = {
    ...customHeaders,
  };

  // Don't set Content-Type if body is FormData (browser will automatically set with boundary)
  if (!(restOptions.body instanceof FormData) && !("Content-Type" in (customHeaders || {}))) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (storedToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${storedToken}`;
  }

  // Normalize path
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_URL}${normalizedEndpoint}`;

  const response = await fetch(fullUrl, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("pm_token");
      localStorage.removeItem("placementor_token");
    }
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((d: { msg?: string }) => d.msg || JSON.stringify(d))
            .join(", ");
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Body is not JSON
    }

    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  // For 204 or empty response
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}
