"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  ActiveLinersResponse,
  CreateLinerDto,
  CreateLinerResponse,
  LinersResponse,
  UpdateLinerDto,
  UpdateLinerResponse,
} from "@/types/leads.types";

export async function getLiners(
  params?: Record<string, unknown> | undefined
): Promise<LinersResponse> {
  try {
    return await httpClient<LinersResponse>("/api/liners", {
      params,
    });
  } catch (error) {
    console.error("Error al obtener liners:", error);
    throw error;
  }
}

export async function getActiveLiners(): Promise<ActiveLinersResponse> {
  try {
    return await httpClient<ActiveLinersResponse>("/api/liners/active/list");
  } catch (error) {
    console.error("Error al obtener liners activos:", error);
    throw error;
  }
}

export async function createLiner(
  data: CreateLinerDto
): Promise<CreateLinerResponse> {
  try {
    return await httpClient<CreateLinerResponse>("/api/liners", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Error al crear liner:", error);
    throw error;
  }
}

export async function updateLiner(
  id: string,
  data: UpdateLinerDto
): Promise<UpdateLinerResponse> {
  try {
    return await httpClient<UpdateLinerResponse>(`/api/liners/${id}`, {
      method: "PATCH",
      body: data,
    });
  } catch (error) {
    console.error(`Error al actualizar liner (ID: ${id}):`, error);
    throw error;
  }
}
