export function getApiData<T>(response: T[] | { data?: T[] } | null | undefined) {
  if (Array.isArray(response)) return response

  return Array.isArray(response?.data) ? response.data : []
}
