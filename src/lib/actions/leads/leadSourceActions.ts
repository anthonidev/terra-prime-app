"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  ActiveLeadSourcesResponse,
  CreateLeadSourceDto,
  CreateLeadSourceResponse,
  LeadSourcesResponse,
  UpdateLeadSourceDto,
  UpdateLeadSourceResponse,
} from "@/types/leads.types";

export async function getLeadSources(
  params?: Record<string, unknown> | undefined
): Promise<LeadSourcesResponse> {
  try {
    return await httpClient<LeadSourcesResponse>("/api/lead-sources", {
      params,
    });
  } catch (error) {
    console.error("Error al obtener fuentes de leads:", error);
    throw error;
  }
}
export async function getActiveLeadSources(): Promise<ActiveLeadSourcesResponse> {
  try {
    return await httpClient<ActiveLeadSourcesResponse>(
      "/api/lead-sources/active/list"
    );
  } catch (error) {
    console.error("Error al obtener fuentes de leads activas:", error);
    throw error;
  }
}

export async function createLeadSource(
  data: CreateLeadSourceDto
): Promise<CreateLeadSourceResponse> {
  try {
    return await httpClient<CreateLeadSourceResponse>("/api/lead-sources", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Error al crear fuente de lead:", error);
    throw error;
  }
}

export async function updateLeadSource(
  id: number,
  data: UpdateLeadSourceDto
): Promise<UpdateLeadSourceResponse> {
  try {
    return await httpClient<UpdateLeadSourceResponse>(
      `/api/lead-sources/${id}`,
      {
        method: "PATCH",
        body: data,
      }
    );
  } catch (error) {
    console.error(`Error al actualizar fuente de lead (ID: ${id}):`, error);
    throw error;
  }
}
