import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { createApiUrl } from '.';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  cache?: RequestCache;
  contentType?: string;
  skipJsonStringify?: boolean;
  next?: {
    tags?: string[];
    revalidate?: number;
  };
}

export async function httpClient<T>(
  endpoint: string,
  {
    method = 'GET',
    body,
    params,
    cache = 'default',
    contentType = 'application/json',
    skipJsonStringify = false,
    next
  }: FetchOptions = {}
): Promise<T> {
  const session = await getServerSession(authOptions);

  const queryParams = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      )
    : undefined;

  const url = createApiUrl(endpoint, queryParams);

  const headers: HeadersInit = {};

  if (session?.accessToken) headers['Authorization'] = `Bearer ${session.accessToken}`;
  if (!(body instanceof FormData)) headers['Content-Type'] = contentType;

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (skipJsonStringify || body instanceof FormData) requestBody = body as BodyInit;
    else requestBody = JSON.stringify(body);
  }

  const options: RequestInit = {
    method,
    headers,
    body: requestBody,
    cache,
    next
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.json();
      throw new Error(errorText.message);
    }
    return response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}
