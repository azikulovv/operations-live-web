import type { ApiResponse, EventItem, EventParticipant } from '~/types/event'

export function useEventsApi() {
  const api = useApi()

  function getEvents() {
    return api<ApiResponse<EventItem[]>>('/events/active', {
      method: 'GET',
    })
  }

  function getEventParticipants(eventId: string) {
    return api<ApiResponse<EventParticipant[]>>('/events/participants', {
      method: 'GET',
      query: {
        eventId,
      },
    })
  }

  return {
    getEvents,
    getEventParticipants,
  }
}
