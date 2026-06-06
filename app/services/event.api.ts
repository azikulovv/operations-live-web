import type {
  ApiMaybeResponse,
  ApiResponse,
  EventItem,
  EventParticipant,
  UpdateEventParticipantPayload,
} from '~/types/event'

export function useEventsApi() {
  const api = useApi()

  function getEvents() {
    return api<ApiMaybeResponse<EventItem[]>>('/events/active', {
      method: 'GET',
    })
  }

  function getEventParticipants(eventId: string) {
    return api<ApiMaybeResponse<EventParticipant[]>>('/events/participants', {
      method: 'GET',
      query: {
        eventId,
      },
    })
  }

  function updateEventParticipant(participantId: string, body: UpdateEventParticipantPayload) {
    return api<ApiResponse<EventParticipant>>(`/events/participants/${participantId}`, {
      method: 'PATCH',
      body,
    })
  }

  return {
    getEvents,
    getEventParticipants,
    updateEventParticipant,
  }
}
