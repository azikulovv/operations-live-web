import type { Ref } from 'vue'
import type { BartenderSaleRow, UpdateBartenderSaleDto } from '~/types/operations'

export function useBartenderSales(eventId: string | Ref<string>) {
  const { rows, pending, error, fetchList, updateItem } = useRealtimeList<
    BartenderSaleRow,
    UpdateBartenderSaleDto
  >(eventId, {
    listPath: (eventId) => `/events/${eventId}/bartender-sales`,
    updatePath: (participantId) => `/bartender-sales/${participantId}`,
    listUpdatedEvent: 'bartender-sales:list-updated',
  })

  const totalAmount = computed(() =>
    rows.value.reduce((sum, row) => sum + row.bartenderSale.amount, 0),
  )

  return {
    rows,
    pending,
    error,
    totalAmount,
    fetchList,
    updateSale: updateItem,
  }
}
