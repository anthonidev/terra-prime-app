export const createApiUrl = (endpoint: string, params?: URLSearchParams) => {
  const baseUrl = `${process.env.API_BACKENDL_URL}${endpoint}`;
  return params?.toString() ? `${baseUrl}?${params}` : baseUrl;
};
