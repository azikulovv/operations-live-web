import type { Ref } from 'vue'
import { useEventsApi } from '~/services/event.api'
import type { EventPromotion, UpdateEventPromotionPayload } from '~/types/event'

export const useEventPromotions = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const promotions = ref<EventPromotion[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  async function fetchPromotions() {
    if (!eventId.value) {
      promotions.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.getEventPromotions(eventId.value)
      promotions.value = getApiData(response)
    } catch {
      promotions.value = []
      error.value = 'Не удалось загрузить промо. Попробуйте обновить список.'
    } finally {
      isLoading.value = false
    }
  }

  async function updatePromotion(participantId: string, payload: UpdateEventPromotionPayload) {
    isSaving.value = true
    error.value = null

    try {
      await api.updateEventPromotion(participantId, payload)
      await fetchPromotions()
    } catch {
      error.value = 'Не удалось сохранить промо. Попробуйте ещё раз.'
    } finally {
      isSaving.value = false
    }
  }

  watch(eventId, fetchPromotions, {
    immediate: true,
  })

  return {
    promotions,
    isLoading,
    isSaving,
    error,
    fetchPromotions,
    updatePromotion,
  }
}
