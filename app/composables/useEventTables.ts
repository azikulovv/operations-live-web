import { socket } from '@/shared/socket'
import { unref } from 'vue'
import type { MaybeRef } from 'vue'
import { apiRequest } from '~/helpers/api.helper'
import type {
  EventTableRow,
  ModuleListUpdatedPayload,
  UpdateEventTableDto,
} from '~/types/operations'

export function useEventTables(eventId: MaybeRef<string>) {
  const rows = ref<EventTableRow[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)
  const currentEventId = computed(() => unref(eventId))

  async function fetchList() {
    if (!currentEventId.value) {
      rows.value = []
      return
    }

    pending.value = true
    error.value = null

    try {
      const response = await apiRequest<EventTableRow[]>(`/events/${currentEventId.value}/tables`)
      rows.value = response.data
    } catch (err) {
      rows.value = []
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      pending.value = false
    }
  }

  async function updateTable(tableNumber: number, dto: UpdateEventTableDto) {
    const response = await apiRequest<EventTableRow>(
      `/events/${currentEventId.value}/tables/${tableNumber}`,
      {
        method: 'PATCH',
        body: JSON.stringify(dto),
      },
    )

    return response.data
  }

  function onListUpdated(payload: ModuleListUpdatedPayload<EventTableRow>) {
    if (payload.eventId !== currentEventId.value) return
    rows.value = payload.data
  }

  socket.on('tables:list-updated', onListUpdated)

  watch(currentEventId, fetchList, {
    immediate: true,
  })

  onBeforeUnmount(() => {
    socket.off('tables:list-updated', onListUpdated)
  })

  return {
    rows,
    pending,
    error,
    fetchList,
    updateTable,
  }
}
