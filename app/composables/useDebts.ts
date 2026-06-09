import type { Ref } from 'vue'
import type { DebtRow, UpdateDebtDto } from '~/types/operations'

export function useDebts(eventId: string | Ref<string>) {
  const { rows, pending, error, fetchList, updateItem } = useRealtimeList<DebtRow, UpdateDebtDto>(
    eventId,
    {
      listPath: (eventId) => `/events/${eventId}/debts`,
      updatePath: (participantId) => `/debts/${participantId}`,
      listUpdatedEvent: 'debts:list-updated',
    },
  )

  return {
    rows,
    pending,
    error,
    fetchList,
    updateDebt: updateItem,
  }
}
