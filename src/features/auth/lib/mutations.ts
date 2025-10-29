import { apiClient } from "@/shared/lib/api-client";
import type { AuthResponse, LoginInput, RefreshTokenInput } from "../types";

export async function login(data: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
  return response.data;
}

export async function refreshToken(
  data: RefreshTokenInput
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/refresh",
    data
  );
  return response.data;
}

export async function logout(): Promise<void> {
  // Clear local storage
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}
