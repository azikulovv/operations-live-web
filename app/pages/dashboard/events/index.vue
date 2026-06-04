<script setup lang="ts">
import UiTabs from '~/components/ui/UiTabs.vue'
import EventsList from '~/components/events/EventsList.vue'
import UiSearchInput from '~/components/ui/UiSearchInput.vue'
import { operationEvents } from '~/constants/events'
import type { OperationEvent, OperationEventStatus } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'События | Operations Live',
})

const selectedStatus = ref<OperationEventStatus>('active')
const search = ref('')

const tabs: Array<{
  label: string
  value: OperationEventStatus
}> = [
  {
    label: 'Активные',
    value: 'active',
  },
  {
    label: 'Прошедшие',
    value: 'completed',
  },
]

const filteredEvents = computed(() => {
  const query = search.value.trim().toLowerCase()

  return operationEvents.filter((event) => {
    const matchesStatus = event.status === selectedStatus.value

    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.date.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
})

function openEvent(event: OperationEvent) {
  return navigateTo(`/dashboard/events/${event.id}/today`)
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <UiBreadcrumb
          :items="[
            {
              label: 'События',
              to: '/dashboard/events',
            },
            {
              label: 'Выбор рабочей смены',
            },
          ]"
        />

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Активные и прошедшие события
        </h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Выберите событие, чтобы открыть рабочие экраны: хостес, касса, promotions, бар и турнир.
        </p>
      </div>

      <!-- В будущем добавим сюда кнопку для создания события -->
      <!-- <button
        type="button"
        class="h-9 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Создать событие
      </button> -->
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <UiTabs v-model="selectedStatus" :items="tabs" />

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: название или дата" />
        </div>
      </div>

      <EventsList :events="filteredEvents" @open="openEvent" />
    </UiCard>
  </div>
</template>
