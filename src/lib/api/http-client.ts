import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createApiUrl } from ".";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  cache?: RequestCache;
  contentType?: string;
  skipJsonStringify?: boolean; // Nueva opción para omitir la serialización JSON
}

export async function httpClient<T>(
  endpoint: string,
  {
    method = "GET",
    body,
    params,
    cache = "no-store",
    contentType = "application/json",
    skipJsonStringify = false // Por defecto, serializamos a JSON
  }: FetchOptions = {}
): Promise<T> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("No autorizado");

  const queryParams = params
    ? new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    )
    : undefined;

  const url = createApiUrl(endpoint, queryParams);

  // Preparamos las cabeceras
  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  // Solo agregamos Content-Type si no es FormData, ya que FormData establece su propio boundary
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  // Preparamos el cuerpo de la petición según el tipo
  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (skipJsonStringify || body instanceof FormData) {
      // Si es FormData o si se pide explícitamente no serializar, enviamos tal cual
      requestBody = body as BodyInit;
    } else {
      // En otro caso, serializamos a JSON
      requestBody = JSON.stringify(body);
    }
  }

  const options: RequestInit = {
    method,
    headers,
    body: requestBody,
    cache,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorText = await response.json();
      throw new Error(` ${errorText.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}