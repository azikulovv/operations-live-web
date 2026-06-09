import { socket } from '@/shared/socket'
import { unref } from 'vue'
import type { MaybeRef, Ref } from 'vue'
import { apiRequest } from '~/helpers/api.helper'
import type { ModuleListUpdatedPayload } from '~/types/operations'

type RealtimeListOptions<TItem> = {
  listPath: (eventId: string) => string
  updatePath: (id: string, eventId: string) => string
  listUpdatedEvent: string
  getUpdateId?: (item: TItem) => string
}

export function useRealtimeList<TItem, TUpdate>(
  eventId: MaybeRef<string>,
  options: RealtimeListOptions<TItem>,
) {
  const rows = ref<TItem[]>([]) as Ref<TItem[]>
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
      const response = await apiRequest<TItem[]>(options.listPath(currentEventId.value))
      rows.value = response.data
    } catch (err) {
      rows.value = []
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      pending.value = false
    }
  }

  async function updateItem(id: string, dto: TUpdate) {
    const response = await apiRequest<TItem>(options.updatePath(id, currentEventId.value), {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })

    return response.data
  }

  function onListUpdated(payload: ModuleListUpdatedPayload<TItem>) {
    if (payload.eventId !== currentEventId.value) return
    rows.value = payload.data
  }

  socket.on(options.listUpdatedEvent, onListUpdated)

  watch(currentEventId, fetchList, {
    immediate: true,
  })

  onBeforeUnmount(() => {
    socket.off(options.listUpdatedEvent, onListUpdated)
  })

  return {
    rows,
    pending,
    error,
    fetchList,
    updateItem,
  }
}
