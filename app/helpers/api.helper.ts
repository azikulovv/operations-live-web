type ApiResponse<T> = {
  data: T
}

const retryableStatuses = new Set([408, 429, 502, 503, 504])
const maxAttempts = 3

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
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
  const url = `${config.public.apiBaseUrl}${path}`

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (response.ok) {
        return response.json() as Promise<ApiResponse<T>>
      }

      if (!retryableStatuses.has(response.status) || attempt === maxAttempts - 1) {
        throw new Error(await getResponseErrorMessage(response))
      }
    } catch (error) {
      const canRetry = error instanceof TypeError && attempt < maxAttempts - 1

      if (!canRetry) throw error
    }

    await wait(400 * 2 ** attempt)
  }

  throw new Error('Не удалось выполнить запрос.')
}
