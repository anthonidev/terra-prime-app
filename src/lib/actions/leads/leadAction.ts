"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  CreateUpdateLeadDto,
  CreateUpdateLeadResponse,
  FindLeadByDocumentDto,
  FindLeadResponse,
  LeadDetailResponse,
  PaginatedLeadsResponse,
  RegisterDepartureResponse,
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

export async function getLeads(
  params?: Record<string, any>
): Promise<PaginatedLeadsResponse> {
  try {
    return await httpClient<PaginatedLeadsResponse>("/api/leads", {
      params,
    });
  } catch (error) {
    console.error("Error al obtener leads:", error);
    throw error;
  }
}

export async function registerLeadDeparture(
  leadId: string
): Promise<RegisterDepartureResponse> {
  try {
    return await httpClient<RegisterDepartureResponse>(
      `/api/leads/register-departure/${leadId}`,
      {
        method: "POST",
      }
    );
  } catch (error) {
    console.error(`Error al registrar salida del lead ${leadId}:`, error);
    throw error;
  }
}

export async function getLeadDetail(
  leadId: string
): Promise<LeadDetailResponse> {
  try {
    return await httpClient<LeadDetailResponse>(`/api/leads/${leadId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error(`Error al obtener detalles del lead ${leadId}:`, error);
    throw error;
  }
}
