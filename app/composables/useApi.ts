export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('access_token')
  const { notifyError } = useNotifications()

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {
      if (!token.value) return

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token.value}`,
      } as typeof options.headers
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null

        if (import.meta.client) {
          navigateTo('/signin')
        }

        return
      }

      notifyError(
        'Ошибка запроса',
        getApiErrorMessage(response._data, `API error: ${response.status}`),
      )
    },

    onRequestError({ error }) {
      notifyError('Ошибка запроса', getApiErrorMessage(error))
    },
  })
}
