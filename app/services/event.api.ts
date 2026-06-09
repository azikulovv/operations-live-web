import type {
  ApiMaybeResponse,
  ApiResponse,
  EventItem,
  EventPayment,
  EventParticipant,
  EventPromotion,
  UpdateEventPaymentPayload,
  UpdateEventParticipantPayload,
  UpdateEventPromotionPayload,
} from '~/types/event'

export function useEventsApi() {
  const api = useApi()

  function getEvents() {
    return api<ApiMaybeResponse<EventItem[]>>('/events', {
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

  function getEventPromotions(eventId: string) {
    return api<ApiMaybeResponse<EventPromotion[]>>(`/events/${eventId}/promotions`, {
      method: 'GET',
    })
  }

  function getEventPayments(eventId: string) {
    return api<ApiMaybeResponse<EventPayment[]>>(`/events/${eventId}/payments`, {
      method: 'GET',
    })
  }

  function updateEventPayment(participantId: string, body: UpdateEventPaymentPayload) {
    return api<ApiResponse<EventPayment>>(`/payments/${participantId}`, {
      method: 'PATCH',
      body,
    })
  }

  function updateEventPromotion(participantId: string, body: UpdateEventPromotionPayload) {
    return api<ApiResponse<EventPromotion>>(`/promotions/${participantId}`, {
      method: 'PATCH',
      body,
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
    getEventPayments,
    getEventParticipants,
    getEventPromotions,
    updateEventPayment,
    updateEventPromotion,
    updateEventParticipant,
  }
}
