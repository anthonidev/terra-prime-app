import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createApiUrl } from ".";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  cache?: RequestCache;
}

export async function httpClient<T>(
  endpoint: string,
  { method = "GET", body, params, cache = "no-store" }: FetchOptions = {}
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

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}
