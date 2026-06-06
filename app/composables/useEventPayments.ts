import type { Ref } from 'vue'
import { useEventsApi } from '~/services/event.api'
import type { EventPayment, UpdateEventPaymentPayload } from '~/types/event'

export const useEventPayments = (eventId: Ref<string>) => {
  const api = useEventsApi()
  const payments = ref<EventPayment[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  async function fetchPayments() {
    if (!eventId.value) {
      payments.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.getEventPayments(eventId.value)
      payments.value = getApiData(response)
    } catch {
      payments.value = []
      error.value = 'Не удалось загрузить оплаты. Попробуйте обновить список.'
    } finally {
      isLoading.value = false
    }
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
