"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  CreateUpdateLeadDto,
  CreateUpdateLeadResponse,
  FindLeadByDocumentDto,
  FindLeadResponse,
} from "@/types/leads.types";

export async function findLeadByDocument(
  findDto: FindLeadByDocumentDto
): Promise<FindLeadResponse> {
  try {
    return await httpClient<FindLeadResponse>("/api/leads/find-by-document", {
      method: "POST",
      body: findDto,
    });
  } catch (error) {
    console.error("Error al buscar lead por documento:", error);
    throw error;
  }
}

export async function createOrUpdateLead(
  leadData: CreateUpdateLeadDto
): Promise<CreateUpdateLeadResponse> {
  try {
    return await httpClient<CreateUpdateLeadResponse>("/api/leads/register", {
      method: "POST",
      body: leadData,
    });
  } catch (error) {
    console.error("Error al crear o actualizar lead:", error);
    throw error;
  }
}
