// ============================================================
// QUERIES - Funciones de lectura (GET) para la API de Ventas
// ============================================================
// Todas las funciones usan el apiClient configurado con
// autenticacion automatica via Bearer token.
// ============================================================

import { apiClient } from './api-client';
import type {
  Project,
  ProjectStage,
  ProjectBlock,
  Lot,
  LotsQueryParams,
  ClientByDocumentResponse,
  MySale,
  MySalesQueryParams,
  SaleDetail,
  FinancingDetailResponse,
  PaginatedResponse,
} from '../types';

// =============================================
// FLUJO 1: CREAR VENTA - Queries de seleccion
// =============================================

/**
 * Obtiene los proyectos activos disponibles para venta.
 * Paso 1 del formulario de creacion.
 *
 * GET /api/sales/projects/actives
 */
export async function getActiveProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/api/sales/projects/actives');
  return response.data;
}

/**
 * Obtiene las etapas de un proyecto.
 * Paso 1 - despues de seleccionar proyecto.
 *
 * GET /api/sales/stages/:projectId
 */
export async function getProjectStages(projectId: string): Promise<ProjectStage[]> {
  const response = await apiClient.get<ProjectStage[]>(`/api/sales/stages/${projectId}`);
  return response.data;
}

/**
 * Obtiene los bloques/manzanas de una etapa.
 * Paso 1 - despues de seleccionar etapa.
 *
 * GET /api/sales/blocks/:stageId
 */
export async function getStageBlocks(stageId: string): Promise<ProjectBlock[]> {
  const response = await apiClient.get<ProjectBlock[]>(`/api/sales/blocks/${stageId}`);
  return response.data;
}

/**
 * Obtiene los lotes disponibles de un bloque (solo status "Activo").
 * Paso 1 - despues de seleccionar bloque.
 *
 * GET /api/sales/lots/:blockId?status=Activo
 */
export async function getBlockLots(blockId: string): Promise<Lot[]> {
  const response = await apiClient.get<Lot[]>(`/api/sales/lots/${blockId}`, {
    params: { status: 'Activo' },
  });
  return response.data;
}

/**
 * Obtiene los lotes de un proyecto con paginacion y filtros.
 *
 * GET /api/sales/projects/lots/:projectId
 */
export async function getProjectLots(
  projectId: string,
  params: LotsQueryParams = {}
): Promise<PaginatedResponse<Lot>> {
  const response = await apiClient.get<{
    items: Lot[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>(`/api/sales/projects/lots/${projectId}`, { params });

  return {
    items: response.data.items,
    meta: response.data.meta,
  };
}

/**
 * Busca un cliente por numero de documento.
 * Paso 4 del formulario de creacion.
 * Retorna null si no se encuentra (404).
 *
 * GET /api/sales/clients/document/:document
 */
export async function getClientByDocument(
  document: string
): Promise<ClientByDocumentResponse | null> {
  try {
    const response = await apiClient.get<ClientByDocumentResponse>(
      `/api/sales/clients/document/${document}`
    );
    return response.data;
  } catch {
    return null;
  }
}

// =============================================
// FLUJO 2: LISTAR MIS VENTAS
// =============================================

/**
 * Obtiene las ventas del vendedor autenticado (rol VEN).
 * Soporta paginacion, filtros y ordenamiento.
 *
 * GET /api/sales/all/list/vendor
 *
 * Query params:
 * - page: numero de pagina (default: 1)
 * - limit: items por pagina (default: 20)
 * - order: 'ASC' | 'DESC'
 * - status: filtrar por estado de venta
 * - type: filtrar por tipo (DIRECT_PAYMENT | FINANCED)
 * - projectId: filtrar por proyecto
 * - clientName: filtrar por nombre de cliente
 */
export async function getMySales(
  params: MySalesQueryParams = {}
): Promise<PaginatedResponse<MySale>> {
  const { page, limit, order, status, type, projectId, clientName } = params;
  const response = await apiClient.get<{
    items: MySale[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>('/api/sales/all/list/vendor', {
    params: { page, limit, order, status, type, projectId, clientName },
  });

  return {
    items: response.data.items,
    meta: response.data.meta,
  };
}

// =============================================
// FLUJO 3: VER DETALLE DE VENTA
// =============================================

/**
 * Obtiene el detalle completo de una venta por su ID.
 * Incluye: cliente, lote, pagos, financiamiento, participantes.
 *
 * GET /api/sales/:id
 */
export async function getSaleDetail(id: string): Promise<SaleDetail> {
  const response = await apiClient.get<SaleDetail>(`/api/sales/${id}`);
  return response.data;
}

/**
 * Obtiene el detalle del financiamiento de una venta.
 * Incluye cuotas, pagos, mora, historial de adendas.
 *
 * GET /api/sales/:saleId/financing/:financingId
 */
export async function getFinancingDetail(
  saleId: string,
  financingId: string
): Promise<FinancingDetailResponse> {
  const response = await apiClient.get<FinancingDetailResponse>(
    `/api/sales/${saleId}/financing/${financingId}`
  );
  return response.data;
}
