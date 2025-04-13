import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

interface ApiRequestOptions {
  on401?: 'returnNull';
}

export async function apiRequest(
  method: string,
  endpoint: string,
  body?: any
) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'An error occurred');
    throw error;
  }

  return response;
}

export function getQueryFn(options?: ApiRequestOptions) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [endpoint] = queryKey;
    try {
      const response = await apiRequest('GET', endpoint);
      if (response.status === 401 && options?.on401 === 'returnNull') {
        return null;
      }
      return await response.json();
    } catch (error) {
      if ((error as any)?.status === 401 && options?.on401 === 'returnNull') {
        return null;
      }
      throw error;
    }
  };
}
