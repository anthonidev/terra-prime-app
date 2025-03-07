"use server";

import { httpClient } from "@/lib/api/http-client";
import { LotStatusCount, RoleCount } from "@/types/dashboard.types";


export async function getRoleCounts(): Promise<RoleCount[]> {
  try {
    return await httpClient<RoleCount[]>("/api/dashboard/role-counts");
  } catch (error) {
    console.error("Error al obtener conteo de roles:", error);
    throw error;
  }
}

export async function getLotStatusCounts(projectId?: string): Promise<LotStatusCount[]> {
    try {
      const params = projectId ? { projectId } : undefined;
      
      return await httpClient<LotStatusCount[]>("/api/dashboard/lot-status-counts", {
        params
      });
    } catch (error) {
      console.error("Error al obtener conteo de estados de lotes:", error);
      throw error;
    }
  }
  