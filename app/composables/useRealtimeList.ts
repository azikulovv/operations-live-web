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
  const { notifyError } = useNotifications()
  const updateQueues = new Map<string, Promise<unknown>>()

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
      notifyError('Не удалось загрузить данные', error.value)
    } finally {
      pending.value = false
    }
  }

  function updateItem(id: string, dto: TUpdate) {
    const previousUpdate = updateQueues.get(id) ?? Promise.resolve()
    const update = previousUpdate.catch(() => undefined).then(async () => {
      try {
        const response = await apiRequest<TItem>(options.updatePath(id, currentEventId.value), {
          method: 'PATCH',
          body: JSON.stringify(dto),
        })
        const updatedItem = response.data

        if (options.getUpdateId) {
          rows.value = rows.value.map((item) => {
            return options.getUpdateId?.(item) === id ? { ...item, ...updatedItem } : item
          })
        }

        return updatedItem
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Не удалось сохранить изменения.'
        notifyError('Ошибка сохранения', message)
        throw err
      }
    })

    updateQueues.set(id, update)
    const clearQueue = () => {
      if (updateQueues.get(id) === update) updateQueues.delete(id)
    }
    void update.then(clearQueue, clearQueue)

    return update
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
