"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  CreateStageDto,
  StageDetailDto,
  UpdateStageDto,
} from "@/types/project.types";

export async function createStage(
  data: CreateStageDto
): Promise<StageDetailDto> {
  try {
    const response = await httpClient<StageDetailDto>("/api/stages", {
      method: "POST",
      body: data,
    });

    return response;
  } catch (error) {
    console.error("Error al crear la etapa:", error);
    throw error;
  }
}

export async function updateStage(
  id: string,
  data: UpdateStageDto
): Promise<StageDetailDto> {
  try {
    const response = await httpClient<StageDetailDto>(`/api/stages/${id}`, {
      method: "PATCH",
      body: data,
    });

    return response;
  } catch (error) {
    console.error(`Error al actualizar la etapa ${id}:`, error);
    throw error;
  }
}
