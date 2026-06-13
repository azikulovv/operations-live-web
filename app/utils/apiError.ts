export function collectErrorMessages(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectErrorMessages)
  if (typeof value !== 'object' || value === null) return []

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    if (['data', 'meta', 'stack', 'status', 'statusCode'].includes(key)) return []

    return collectErrorMessages(nestedValue)
  })
}

export function getApiErrorMessage(error: unknown, fallback = 'Не удалось выполнить запрос.') {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string') return error
  if (typeof error !== 'object' || error === null) return fallback

  const messages = collectErrorMessages(error)

  return messages.length > 0 ? messages.join('\n') : fallback
}
