"use server";

import { httpClient } from "@/lib/api/http-client";
import { ExcelValidationResponse, ProjectData } from "@/types/project.types";

/**
 * Valida un archivo Excel para la creación de un proyecto
 * @param formData - FormData que contiene el archivo Excel
 * @returns Respuesta de validación
 */
export async function validateProjectExcel(
    formData: FormData
): Promise<ExcelValidationResponse> {
    try {
        return await httpClient<ExcelValidationResponse>("/api/projects/validate-excel", {
            method: "POST",
            body: formData,
            skipJsonStringify: true,
        });
    } catch (error) {
        console.error("Error en validateProjectExcel:", error);
        throw error;
    }
}

/**
 * Crea un proyecto a partir de los datos validados
 * @param projectData - Datos del proyecto validados
 * @returns Proyecto creado
 */
export async function createBulkProject(projectData: ProjectData): Promise<any> {
    try {
        return await httpClient<any>("/api/projects/bulk-create", {
            method: "POST",
            body: { "projectData": projectData },
        });
    } catch (error) {
        throw error;
    }
}