import type { Ref } from 'vue'
import { useEventsApi } from '~/services/event.api'
import type { EventPromotion } from '~/types/event'

export const useEventPromotions = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const promotions = ref<EventPromotion[]>([])
  const isLoading = ref(false)
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

  watch(eventId, fetchPromotions, {
    immediate: true,
  })

  return {
    promotions,
    isLoading,
    error,
    fetchPromotions,
  }
}
