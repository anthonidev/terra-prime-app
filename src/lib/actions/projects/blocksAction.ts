"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  BlockDetailDto,
  CreateBlockDto,
  UpdateBlockDto,
} from "@/types/project.types";

export async function createBlock(
  data: CreateBlockDto
): Promise<BlockDetailDto> {
  try {
    const response = await httpClient<BlockDetailDto>("/api/blocks", {
      method: "POST",
      body: data,
    });

    return response;
  } catch (error) {
    console.error("Error al crear la manzana:", error);
    throw error;
  }
}

export async function updateBlock(
  id: string,
  data: UpdateBlockDto
): Promise<BlockDetailDto> {
  try {
    const response = await httpClient<BlockDetailDto>(`/api/blocks/${id}`, {
      method: "PATCH",
      body: data,
    });

    return response;
  } catch (error) {
    console.error(`Error al actualizar la manzana ${id}:`, error);
    throw error;
  }
}
