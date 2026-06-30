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

  async function updateTournament(participantId: string, payload: UpdateTournamentDto) {
    const updatedRow = await updateItem(participantId, payload)

    rows.value = rows.value.map((row) => {
      if (row.participantId !== participantId) return row

      return {
        ...row,
        ...updatedRow,
        tournament: {
          ...row.tournament,
          ...payload,
          ...updatedRow.tournament,
        },
      }
    })

    return updatedRow
  }

  return {
    rows,
    pending,
    error,
    fetchList,
    updateTournament,
  }
}
