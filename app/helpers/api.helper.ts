type ApiResponse<T> = {
  data: T
}

export async function apiRequest<T>(path: string, options?: RequestInit) {
  const config = useRuntimeConfig()

  const response = await fetch(`${config.public.apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json() as Promise<ApiResponse<T>>
}
