import { useEventsApi } from '~/services/event.api'
import type { Ref } from 'vue'
import type { EventParticipant } from '~/types/event'

export const useEventParticipants = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const participants = ref<EventParticipant[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchParticipants = async () => {
    if (!eventId.value) {
      participants.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.getEventParticipants(eventId.value)
      participants.value = response.data
    } catch {
      participants.value = []
      error.value = 'Не удалось загрузить игроков. Попробуйте обновить список.'
    } finally {
      isLoading.value = false
    }
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
