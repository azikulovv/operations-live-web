import type { ApiMaybeResponse } from '~/types/event'

type UseAsyncListOptions<T> = {
  load: () => Promise<ApiMaybeResponse<T[]>>
  fallback?: () => T[]
  errorMessage: string
}

function getErrorStatus(error: unknown) {
  if (typeof error !== 'object' || error === null) return null

  const status =
    'status' in error && typeof error.status === 'number'
      ? error.status
      : 'statusCode' in error && typeof error.statusCode === 'number'
        ? error.statusCode
        : null

  if (status) return status

  const response =
    'response' in error && typeof error.response === 'object' && error.response !== null
      ? error.response
      : null

  return response && 'status' in response && typeof response.status === 'number'
    ? response.status
    : null
}

export function useAsyncList<T>({ load, fallback, errorMessage }: UseAsyncListOptions<T>) {
  const items = ref<T[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems() {
    isLoading.value = true
    error.value = null

    try {
      const response = await load()
      items.value = getApiData(response)
    } catch (cause) {
      if (getErrorStatus(cause) === 401) {
        items.value = []
        error.value = errorMessage
        return
      }

      const fallbackItems = fallback?.()

      if (fallbackItems) {
        items.value = fallbackItems
        return
      }

      items.value = []
      error.value = errorMessage
    } finally {
      isLoading.value = false
    }
  }

  function resetItems() {
    items.value = []
    error.value = null
  }

  return {
    items,
    isLoading,
    error,
    fetchItems,
    resetItems,
  }
}
