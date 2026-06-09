import { socket } from '@/shared/socket'
import { apiRequest } from '~/helpers/api.helper'
import type {
  BartenderSaleRow,
  BartenderSalesListUpdatedPayload,
  UpdateBartenderSaleDto,
} from '~/types/bartender-sales'

export function useBartenderSales(eventId: string) {
  const rows = ref<BartenderSaleRow[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchList() {
    pending.value = true
    error.value = null

    try {
      const response = await apiRequest<BartenderSaleRow[]>(`/events/${eventId}/bartender-sales`)
      rows.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      pending.value = false
    }
  }

  async function updateSale(participantId: string, dto: UpdateBartenderSaleDto) {
    const response = await apiRequest(`/bartender-sales/${participantId}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })

    return response.data
  }

  function onListUpdated(payload: BartenderSalesListUpdatedPayload) {
    if (payload.eventId !== eventId) return
    rows.value = payload.data
  }

  socket.on('bartender-sales:list-updated', onListUpdated)

  onBeforeUnmount(() => {
    socket.off('bartender-sales:list-updated', onListUpdated)
  })

  fetchList()

  return {
    rows,
    pending,
    error,
    fetchList,
    updateSale,
  }
}
