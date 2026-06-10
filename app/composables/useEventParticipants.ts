import { unref } from 'vue'
import type { MaybeRef, Ref } from 'vue'
import { useEventsApi } from '~/services/event.api'
import type { EventParticipant, UpdateEventParticipantPayload } from '~/types/event'

export const useEventParticipants = (eventId: MaybeRef<string>) => {
  const api = useEventsApi()
  const eventSocket = useEventSocket()
  const rows = ref<EventParticipant[]>([]) as Ref<EventParticipant[]>
  const pending = ref(false)
  const error = ref<string | null>(null)
  const currentEventId = computed(() => unref(eventId))
  let realtimeSocket: ReturnType<typeof eventSocket.connect> = null

  async function fetchList() {
    if (!currentEventId.value) {
      rows.value = []
      return
    }

    pending.value = true
    error.value = null

    try {
      const response = await api.getEventParticipants(currentEventId.value)
      rows.value = getApiData(response)
    } catch (err) {
      rows.value = []
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить игроков.'
    } finally {
      pending.value = false
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

  onMounted(() => {
    const socket = eventSocket.connect()

    if (!socket) return

    realtimeSocket = socket
    socket.on('events:participants:updated', onParticipantsUpdated)

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
  })

  function fetchParticipants() {
    return fetchList()
  }

  async function updateParticipant(participantId: string, payload: UpdateEventParticipantPayload) {
    if (!currentEventId.value) {
      throw new Error('Event id is required')
    }

    const response = await api.updateEventParticipant(currentEventId.value, participantId, payload)

    return response.data
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
