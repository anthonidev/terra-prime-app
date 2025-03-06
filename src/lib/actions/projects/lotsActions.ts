"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  CreateLotDto,
  LotResponseDto,
  UpdateLotDto,
} from "@/types/project.types";

export async function createLot(data: CreateLotDto): Promise<LotResponseDto> {
  try {
    const response = await httpClient<LotResponseDto>("/api/lots", {
      method: "POST",
      body: data,
    });

    return response;
  } catch (error) {
    console.error("Error al crear el lote:", error);
    throw error;
  }
}

export async function updateLot(
  id: string,
  data: UpdateLotDto
): Promise<LotResponseDto> {
  try {
    const response = await httpClient<LotResponseDto>(`/api/lots/${id}`, {
      method: "PATCH",
      body: data,
    });

    return response;
  } catch (error) {
    console.error(`Error al actualizar el lote ${id}:`, error);
    throw error;
  }
}
