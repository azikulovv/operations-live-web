import type { Ref } from 'vue'
import type { FinalTableRow, UpdateFinalTableDto } from '~/types/operations'

export function useFinalTable(eventId: string | Ref<string>) {
  const { rows, pending, error, fetchList, updateItem } = useRealtimeList<
    FinalTableRow,
    UpdateFinalTableDto
  >(eventId, {
    listPath: (eventId) => `/events/${eventId}/final-table`,
    updatePath: (participantId) => `/final-table/${participantId}`,
    listUpdatedEvent: 'final-table:list-updated',
  })

  return {
    rows,
    pending,
    error,
    fetchList,
    updateFinalTable: updateItem,
  }
}
