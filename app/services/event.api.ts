import type { ApiResponse, EventItem } from '~/types/event'

export function useEventsApi() {
  const api = useApi()

  function getEvents() {
    return api<ApiResponse<EventItem[]>>('/events/active', {
      method: 'GET',
    })
  }

  return {
    getEvents,
  }
}
