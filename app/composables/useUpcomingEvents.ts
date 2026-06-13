import type { Ref } from 'vue'
import { useEventsApi } from '~/services/event.api'
import type { EventItem } from '~/types/event'

type UseUpcomingEventsOptions = {
  filters?: {
    search: Ref<string>
  }
}

export const useUpcomingEvents = (options: UseUpcomingEventsOptions = {}) => {
  const api = useEventsApi()
  const {
    items: events,
    isLoading,
    error,
    fetchItems,
  } = useAsyncList<EventItem>({
    load: api.getUpcomingEvents,
    errorMessage: 'Не удалось загрузить предстоящие мероприятия. Попробуйте обновить страницу.',
  })

  const filters = options.filters
  const filteredEvents =
    filters !== undefined
      ? computed(() => filterEventsBySearch(events.value, filters.search.value))
      : events

  async function fetchEvents() {
    await fetchItems()
  }

  onMounted(fetchEvents)

  return {
    events,
    filteredEvents,
    isLoading,
    error,
    fetchEvents,
  }
}
