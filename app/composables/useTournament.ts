import type { Ref } from 'vue'
import type { TournamentRow, UpdateTournamentDto } from '~/types/operations'

export function useTournament(eventId: string | Ref<string>) {
  const { rows, pending, error, fetchList, updateItem } = useRealtimeList<
    TournamentRow,
    UpdateTournamentDto
  >(eventId, {
    listPath: (eventId) => `/events/${eventId}/tournament`,
    updatePath: (participantId) => `/tournament/${participantId}`,
    listUpdatedEvent: 'tournament:list-updated',
  })

  return {
    rows,
    pending,
    error,
    fetchList,
    updateTournament: updateItem,
  }
}
