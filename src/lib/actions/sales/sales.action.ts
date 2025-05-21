"use server";

import { httpClient } from "@/lib/api/http-client";
import { SalesResponse } from "@/types/sales";

export async function getSales(
  params?: Record<string, unknown> | undefined
): Promise<SalesResponse> {
  try {
    return await httpClient<SalesResponse>("/api/sales", {
      params: params,
    });
  } catch (error) {
    if (error instanceof Error)
      console.error("Has been error, reason: %s", error.message);
    throw error;
  }
}
