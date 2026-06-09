import type { Ref } from 'vue'
import { getMockEventPromotions } from '~/mocks/event.mock'
import { useEventsApi } from '~/services/event.api'
import type { EventPromotion, UpdateEventPromotionPayload } from '~/types/event'

export const useEventPromotions = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const {
    items: promotions,
    isLoading,
    error,
    fetchItems,
    resetItems,
  } = useAsyncList<EventPromotion>({
    load: () => api.getEventPromotions(eventId.value),
    fallback: getMockEventPromotions,
    errorMessage: 'Не удалось загрузить промо. Попробуйте обновить список.',
  })
  const isSaving = ref(false)

  async function fetchPromotions() {
    if (!eventId.value) {
      resetItems()
      return
    }

    await fetchItems()
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
