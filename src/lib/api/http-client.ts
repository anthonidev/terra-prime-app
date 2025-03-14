"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { createApiUrl } from ".";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  cache?: RequestCache;
  contentType?: string;
  skipJsonStringify?: boolean;
}

export async function httpClient<T>(
  endpoint: string,
  {
    method = "GET",
    body,
    params,
    cache = "no-store",
    contentType = "application/json",
    skipJsonStringify = false,
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

  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (skipJsonStringify || body instanceof FormData) {
      requestBody = body as BodyInit;
    } else {
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
    
    // Return structured error responses instead of throwing
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || response.statusText,
        status: response.status,
      } as unknown as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    // Return a structured error instead of throwing
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
      status: 500,
    } as unknown as T;
  }
}