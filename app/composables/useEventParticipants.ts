import { unref } from 'vue'
import type { MaybeRef, Ref } from 'vue'
import { useEventsApi } from '~/services/event.api'
import type { EventParticipant, UpdateEventParticipantPayload } from '~/types/event'

const relatedListUpdatedEvents = [
  'payments:list-updated',
  'promotions:list-updated',
  'debts:list-updated',
  'bartender-sales:list-updated',
  'tournament:list-updated',
  'final-table:list-updated',
  'tables:list-updated',
] as const

export const useEventParticipants = (eventId: MaybeRef<string>) => {
  const api = useEventsApi()
  const eventSocket = useEventSocket()
  const rows = ref<EventParticipant[]>([]) as Ref<EventParticipant[]>
  const pending = ref(false)
  const error = ref<string | null>(null)
  const currentEventId = computed(() => unref(eventId))
  let realtimeSocket: ReturnType<typeof eventSocket.connect> = null
  let relatedRefreshInProgress = false
  let relatedRefreshQueued = false

  async function fetchList(silent = false) {
    if (!currentEventId.value) {
      rows.value = []
      return
    }

    if (!silent) pending.value = true
    error.value = null

    try {
      const response = await api.getEventParticipants(currentEventId.value)
      rows.value = getApiData(response)
    } catch (err) {
      if (!silent) rows.value = []
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить игроков.'
    } finally {
      if (!silent) pending.value = false
    }
  }

  function onParticipantsUpdated(
    payload: { eventId?: string; data?: EventParticipant[] } | EventParticipant[],
  ) {
    if (!Array.isArray(payload) && payload.eventId && payload.eventId !== currentEventId.value) {
      return
    }

    rows.value = getApiData(payload)
  }

  async function refreshAfterRelatedUpdate() {
    if (relatedRefreshInProgress) {
      relatedRefreshQueued = true
      return
    }

    relatedRefreshInProgress = true

    try {
      do {
        relatedRefreshQueued = false
        await fetchList(true)
      } while (relatedRefreshQueued)
    } finally {
      relatedRefreshInProgress = false
    }
  }

  function onRelatedListUpdated(payload: { eventId?: string | number }) {
    if (String(payload.eventId ?? '') !== currentEventId.value) return

    void refreshAfterRelatedUpdate()
  }

  onMounted(() => {
    const socket = eventSocket.connect()

    if (!socket) return

    realtimeSocket = socket
    socket.on('events:participants:updated', onParticipantsUpdated)
    relatedListUpdatedEvents.forEach((event) => {
      socket.on(event, onRelatedListUpdated)
    })

    if (currentEventId.value) {
      socket.emit('events:participants:subscribe', {
        eventId: currentEventId.value,
      })
    }
  })

  watch(
    currentEventId,
    async (newEventId, oldEventId) => {
      if (realtimeSocket && oldEventId) {
        realtimeSocket.emit('events:participants:unsubscribe', {
          eventId: oldEventId,
        })
      }

      if (realtimeSocket && newEventId) {
        realtimeSocket.emit('events:participants:subscribe', {
          eventId: newEventId,
        })
      }

      await fetchList()
    },
    {
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    if (!realtimeSocket) return

    realtimeSocket.emit('events:participants:unsubscribe', {
      eventId: currentEventId.value,
    })
    realtimeSocket.off('events:participants:updated', onParticipantsUpdated)
    relatedListUpdatedEvents.forEach((event) => {
      realtimeSocket?.off(event, onRelatedListUpdated)
    })
  })

  function fetchParticipants() {
    return fetchList()
  }

  async function updateParticipant(participantId: string, payload: UpdateEventParticipantPayload) {
    if (!currentEventId.value) {
      throw new Error('Event id is required')
    }

    const response = await api.updateEventParticipant(currentEventId.value, participantId, payload)
    const updatedParticipant = response.data

    rows.value = rows.value.map((participant) => {
      return participant.id === participantId ? { ...participant, ...updatedParticipant } : participant
    })

    return updatedParticipant
  }

  return {
    rows,
    pending,
    error,
    fetchList,
    updateItem: updateParticipant,
    updateParticipant,
    participants: rows,
    isLoading: pending,
    fetchParticipants,
  }
}
