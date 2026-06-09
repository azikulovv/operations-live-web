import type { Ref } from 'vue'
import { getMockEvents } from '~/mocks/event.mock'
import { useEventsApi } from '~/services/event.api'
import type { EventFilterStatus, EventItem } from '~/types/event'

type UseEventsOptions = {
  filters?: {
    search: Ref<string>
    status: Ref<EventFilterStatus>
  }
}

function normalize(value: null | number | string | undefined) {
  return value == null ? '' : String(value).toLowerCase()
}

function getFilterStatus(event: EventItem): EventFilterStatus {
  return event.status === 'completed' ? 'completed' : 'active'
}

export const useEvents = (options: UseEventsOptions = {}) => {
  const api = useEventsApi()
  const {
    items: events,
    isLoading,
    error,
    fetchItems,
  } = useAsyncList<EventItem>({
    load: api.getEvents,
    fallback: getMockEvents,
    errorMessage: 'Не удалось загрузить события. Попробуйте обновить страницу.',
  })

  const filterEvents = (search: Ref<string>, selectedStatus: Ref<EventFilterStatus>) => {
    return computed(() => {
      const query = search.value.trim().toLowerCase()

      return events.value.filter((event) => {
        const matchesStatus = getFilterStatus(event) === selectedStatus.value
        const searchableText = [
          event.title,
          event.city,
          event.address,
          event.gameType,
          event.features,
          event.startsAt,
          event.endsAt,
        ]
          .map(normalize)
          .join(' ')

        return matchesStatus && (!query || searchableText.includes(query))
      })
    })
  }

  const filteredEvents =
    options.filters !== undefined
      ? filterEvents(options.filters.search, options.filters.status)
      : events

  const statusCounts = computed<Record<EventFilterStatus, number>>(() => {
    return events.value.reduce(
      (acc, event) => {
        acc[getFilterStatus(event)] += 1
        return acc
      },
      {
        active: 0,
        completed: 0,
      },
    )
  })

  async function fetchEvents() {
    await fetchItems()
  }

  onMounted(fetchEvents)

  return {
    events,
    filteredEvents,
    statusCounts,
    isLoading,
    error,
    fetchEvents,
    filterEvents,
  }
}
