import type { Ref } from 'vue'
import { getMockEventPayments } from '~/mocks/event.mock'
import { useEventsApi } from '~/services/event.api'
import type { EventPayment, UpdateEventPaymentPayload } from '~/types/event'

export const useEventPayments = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const {
    items: payments,
    isLoading,
    error,
    fetchItems,
    resetItems,
  } = useAsyncList<EventPayment>({
    load: () => api.getEventPayments(eventId.value),
    fallback: getMockEventPayments,
    errorMessage: 'Не удалось загрузить оплаты. Попробуйте обновить список.',
  })
  const isSaving = ref(false)

  async function fetchPayments() {
    if (!eventId.value) {
      resetItems()
      return
    }

    await fetchItems()
  }

  async function updatePayment(participantId: string, payload: UpdateEventPaymentPayload) {
    isSaving.value = true
    error.value = null

    try {
      await api.updateEventPayment(participantId, payload)
      await fetchPayments()
    } catch {
      error.value = 'Не удалось сохранить оплату. Попробуйте ещё раз.'
    } finally {
      isSaving.value = false
    }
  }

  watch(eventId, fetchPayments, {
    immediate: true,
  })

  return {
    payments,
    isLoading,
    isSaving,
    error,
    fetchPayments,
    updatePayment,
  }
}
