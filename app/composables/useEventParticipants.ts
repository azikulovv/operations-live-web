import type { Ref } from 'vue'
import { getMockEventParticipants } from '~/mocks/event.mock'
import { useEventsApi } from '~/services/event.api'
import type { EventParticipant } from '~/types/event'

export const useEventParticipants = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const {
    items: participants,
    isLoading,
    error,
    fetchItems,
    resetItems,
  } = useAsyncList<EventParticipant>({
    load: () => api.getEventParticipants(eventId.value),
    fallback: () => getMockEventParticipants(eventId.value),
    errorMessage: 'Не удалось загрузить игроков. Попробуйте обновить список.',
  })

  async function fetchParticipants() {
    if (!eventId.value) {
      resetItems()
      return
    }

    await fetchItems()
  }

  watch(eventId, fetchParticipants, {
    immediate: true,
  })

  return {
    participants,
    isLoading,
    error,
    fetchParticipants,
  }
}
