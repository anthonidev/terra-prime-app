import { apiClient } from "@/shared/lib/api-client";
import { UserMenuResponse } from "../types/menu.types";

export async function userMenuSidebar(): Promise<UserMenuResponse> {
  const response = await apiClient.get<UserMenuResponse>("/api/user/menu");
  return response.data;
}
