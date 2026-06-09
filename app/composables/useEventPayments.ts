import type { Ref } from 'vue'
import type { PaymentRow, UpdatePaymentDto } from '~/types/operations'

export const useEventPayments = (eventId: string | Ref<string>) => {
  const { rows, pending, error, fetchList, updateItem } = useRealtimeList<
    PaymentRow,
    UpdatePaymentDto
  >(eventId, {
    listPath: (eventId) => `/events/${eventId}/payments`,
    updatePath: (participantId) => `/payments/${participantId}`,
    listUpdatedEvent: 'payments:list-updated',
  })

  return {
    payments: rows,
    isLoading: pending,
    error,
    fetchPayments: fetchList,
    updatePayment: updateItem,
  }
}
