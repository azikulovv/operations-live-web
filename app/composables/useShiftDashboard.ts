import { socket } from '@/shared/socket'
import { unref } from 'vue'
import type { MaybeRef } from 'vue'
import { apiRequest } from '~/helpers/api.helper'
import type { ShiftDashboard } from '~/types/operations'

export function useShiftDashboard(eventId: MaybeRef<string>) {
  const dashboard = ref<ShiftDashboard | null>(null)
  const pending = ref(false)
  const error = ref<string | null>(null)
  const currentEventId = computed(() => unref(eventId))

  async function fetchDashboard() {
    if (!currentEventId.value) {
      dashboard.value = null
      return
    }

    pending.value = true
    error.value = null

    try {
      const response = await apiRequest<ShiftDashboard>(
        `/events/${currentEventId.value}/shift-dashboard`,
      )
      dashboard.value = response.data
    } catch (err) {
      dashboard.value = null
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      pending.value = false
    }
  }

  function refetchForEvent(payload: { eventId: string }) {
    if (payload.eventId !== currentEventId.value) return
    fetchDashboard()
  }

  socket.on('payments:list-updated', refetchForEvent)
  socket.on('bartender-sales:list-updated', refetchForEvent)
  socket.on('debts:list-updated', refetchForEvent)

  watch(currentEventId, fetchDashboard, {
    immediate: true,
  })

  onBeforeUnmount(() => {
    socket.off('payments:list-updated', refetchForEvent)
    socket.off('bartender-sales:list-updated', refetchForEvent)
    socket.off('debts:list-updated', refetchForEvent)
  })

  return {
    dashboard,
    pending,
    error,
    fetchDashboard,
  }
}
