type ApiResponse<T> = {
  data: T
}

async function getResponseErrorMessage(response: Response) {
  const fallback = `API error: ${response.status}`
  const contentType = response.headers.get('content-type') ?? ''

  try {
    if (contentType.includes('application/json')) {
      const body = (await response.json()) as unknown
      return getApiErrorMessage(body, fallback)
    }

    const text = await response.text()

    return text.trim() || fallback
  } catch {
    return fallback
  }
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
    throw new Error(await getResponseErrorMessage(response))
  }

  return response.json() as Promise<ApiResponse<T>>
}
